# arkadz.dev — Portfolio Infrastructure

> *"If it's not in code, it doesn't exist."*

![preview](./docs/preview.png)

A personal portfolio website with a hacker/terminal aesthetic — and more importantly, a full infrastructure pipeline to go with it. The site itself is the project.

---

## Stack

| Layer | Tool |
|---|---|
| DNS / CDN | Cloudflare |
| Web Server / Proxy | Nginx |
| CI / CD | GitHub Actions |
| Infrastructure as Code | Terraform |
| Configuration Management | Ansible |
| Containers | Docker |
| OS / Shell | Linux · Bash |

---

## Project Structure

```
Portfolio/
├── src/
│   └── App.jsx           # React frontend (single config object at top)
├── Dockerfile            # Multi-stage build: Node → Nginx
├── index.html
├── vite.config.js
├── package.json
├── terraform/            # coming soon
├── ansible/              # coming soon
└── .github/
    └── workflows/        # coming soon
```

---

## Local Development

```bash
# install dependencies
npm install

# start dev server with hot reload
npm run dev
# → http://localhost:5173
```

**Personalising the site** — all personal info lives in one place, nothing else needs changing:

```js
// src/App.jsx — top of file
const CONFIG = {
  firstName: "Arkadz",
  lastName:  "Minkevich",
  domain:    "arkadz.dev",
  // ...
}
```

---

## Production Build (Docker)

```bash
# build
docker build -t portfolio .

# run
docker run -p 8080:80 portfolio
# → http://localhost:8080
```

---

## Deployment Pipeline

The full deployment is automated — a `git push` to `main` is all it takes:

```
git push → GitHub Actions
              ├── docker build
              ├── docker push → ghcr.io
              └── SSH to VPS
                    ├── docker pull
                    └── docker restart
```

Infrastructure is provisioned with **Terraform** (DigitalOcean Droplet + firewall + Cloudflare DNS) and configured with **Ansible** (Docker install, Nginx reverse proxy, TLS via Certbot).

> Pipeline and IaC are actively being built — follow along.

---

## Roadmap

- [x] React frontend
- [x] Dockerized build
- [x] Push image to GHCR
- [ ] Terraform — DigitalOcean + Cloudflare
- [ ] Ansible — server config + Nginx + TLS
- [ ] GitHub Actions — full CI/CD pipeline

---

## Author

**Arkadz Minkevich** · DevOps / Platform Engineer · Minsk, Belarus  
[arkadz.dev](https://arkadz.dev)
