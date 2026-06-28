# Nginx Cert Conflict — Troubleshooting Guide

## What happened

The portfolio nginx container failed to start with:

```
nginx: [emerg] cannot load certificate "/etc/letsencrypt/live/normalsound.chibixar.com/fullchain.pem"
```

Even though `default.conf` looked correct, nginx loads **all** `.conf` files from `./nginx/conf/`. The NormalSound Ansible role had deployed `normalsound.conf` into that directory referencing a TLS cert that didn't exist yet.

### Root cause chain

1. NormalSound Ansible role ran and wrote `normalsound.conf` into `/opt/portfolio/nginx/conf/`
2. That config references `/etc/letsencrypt/live/normalsound.chibixar.com/fullchain.pem`
3. Certbot had not yet issued a cert for `normalsound.chibixar.com`
4. nginx refuses to start if **any** loaded config references a missing cert file
5. Because nginx was down, certbot's webroot challenge couldn't complete either — classic chicken-and-egg

---

## The general rule

> **nginx must be running before certbot can issue a cert via webroot.**  
> **nginx cannot start if it references a cert that doesn't exist yet.**

Any time a new subdomain's nginx config is deployed before its cert is issued, this deadlock occurs.

---

## How to break the deadlock

### Step 1 — Remove the offending config so nginx can start

```bash
rm /opt/portfolio/nginx/conf/normalsound.conf
cd /opt/portfolio && docker compose up -d
```

Verify nginx is running:

```bash
docker compose ps
curl -I http://localhost
```

### Step 2 — Issue the cert now that nginx is up

```bash
docker run --rm \
  -v /opt/portfolio/certbot/www:/var/www/certbot \
  -v /opt/portfolio/certbot/conf:/etc/letsencrypt \
  certbot/certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  --email YOUR_EMAIL \
  --agree-tos --no-eff-email --non-interactive \
  -d normalsound.chibixar.com
```

### Step 3 — Re-deploy the nginx config

```bash
# Via Ansible (recommended — idempotent)
ansible-playbook ansible/deploy.yml -i ansible/inventory/hosts.ini \
  --tags web \
  --extra-vars "..."

# Or manually copy the config back
cp /path/to/normalsound.conf /opt/portfolio/nginx/conf/normalsound.conf
docker compose exec nginx nginx -t   # validate first
docker compose restart nginx
```

---

## How to prevent this in future Ansible roles

The `web` role must gate the nginx config deployment behind a cert existence check.

### Pattern: dummy cert → nginx start → real cert → reload

```yaml
# 1. Check if a real cert already exists
- name: Check if cert exists for {{ web_ns_domain }}
  ansible.builtin.stat:
    path: /etc/letsencrypt/live/{{ web_ns_domain }}/fullchain.pem
  register: ns_cert

# 2. Generate a dummy self-signed cert so nginx can start
- name: Create dummy cert directory
  ansible.builtin.file:
    path: /etc/letsencrypt/live/{{ web_ns_domain }}
    state: directory
    mode: "0755"
  when: not ns_cert.stat.exists

- name: Generate dummy cert
  ansible.builtin.command: >
    openssl req -x509 -nodes -newkey rsa:2048
    -keyout /etc/letsencrypt/live/{{ web_ns_domain }}/privkey.pem
    -out    /etc/letsencrypt/live/{{ web_ns_domain }}/fullchain.pem
    -days 1 -subj "/CN={{ web_ns_domain }}"
  when: not ns_cert.stat.exists

# 3. Deploy nginx config (cert file now exists, nginx will accept it)
- name: Deploy normalsound.conf
  ansible.builtin.template:
    src: normalsound.conf.j2
    dest: "{{ portfolio_dir }}/nginx/conf/normalsound.conf"
  notify: reload nginx container

# 4. Ensure nginx is running
- name: Start containers
  community.docker.docker_compose_v2:
    project_src: "{{ portfolio_dir }}"
    state: present

# 5. Wait for nginx port 80 to be ready
- name: Wait for nginx on port 80
  ansible.builtin.wait_for:
    port: 80
    delay: 3
    timeout: 60
  when: not ns_cert.stat.exists

# 6. Replace dummy cert with real Let's Encrypt cert
- name: Issue real cert via certbot
  ansible.builtin.command: >
    certbot certonly --webroot
    -w {{ portfolio_dir }}/certbot/www
    -d {{ web_ns_domain }}
    --non-interactive --agree-tos
    -m {{ letsencrypt_email }}
    --keep-until-expiring
  when: not ns_cert.stat.exists

# 7. Reload nginx to load the real cert
- name: Reload nginx
  ansible.builtin.command: >
    docker exec {{ nginx_container_name }} nginx -s reload
  when: not ns_cert.stat.exists
```

---

## Diagnosing this class of error in future

If nginx fails to start, always check **all** conf files loaded — not just `default.conf`:

```bash
# List every config file nginx will load
ls -la /opt/portfolio/nginx/conf/

# Check which cert path each file references
grep -r "ssl_certificate" /opt/portfolio/nginx/conf/

# Cross-reference against what certs actually exist
ls /opt/portfolio/certbot/conf/live/

# Validate the full nginx config (run inside the container)
docker run --rm \
  -v /opt/portfolio/nginx/conf:/etc/nginx/conf.d:ro \
  -v /opt/portfolio/certbot/conf:/etc/letsencrypt:ro \
  nginx:alpine nginx -t
```

A cert path referenced in any `.conf` file must exist on disk before nginx will start.

---

## Key files involved

| File | Purpose |
|---|---|
| `/opt/portfolio/nginx/conf/default.conf` | Portfolio + uptime-kuma — deployed by portfolio Ansible role |
| `/opt/portfolio/nginx/conf/normalsound.conf` | NormalSound subdomain — deployed by NormalSound Ansible role |
| `/opt/portfolio/certbot/conf/live/` | All issued certs — must exist before nginx loads a config referencing them |
| `/opt/portfolio/certbot/www/` | Webroot for ACME challenges — must be served by nginx on port 80 |
