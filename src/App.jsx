import { useState, useEffect, useRef, useCallback } from "react";

// ╔══════════════════════════════════════════════════════════════════╗
// ║                     PORTFOLIO CONFIG                            ║
// ║         Edit this object — nothing else needs to change         ║
// ╚══════════════════════════════════════════════════════════════════╝
const CONFIG = {
  firstName: "Arkadz",
  lastName: "Minkevich",
  handle: "arkadz",
  hostname: "minsk",
  domain: "chibixar.com",
  role: "DevOps / Platform Engineer",
  location: "Minsk, Belarus",
  locationCoords: "53.9045° N, 27.5615° E",
  timezone: "UTC+3",
  timezoneLabel: "BY",
  portfolioRepo: "https://github.com/chibixar/Portfolio",
  devOpsStart: new Date("2025-03-01"),           // used by `uptime` command
  bio: [
    "Engineer at the intersection of infrastructure, automation, and reliability.",
    "I turn manual toil into deterministic pipelines — if it's not in code, it doesn't exist.",
  ],
  contact: {
    email: "minkevicharkadz@gmail.com",
    github: "github.com/chibixar",
    linkedin: null,
  },
  skills: [
    {
      group: "infrastructure/",
      items: [
        { name: "Linux / Bash",  level: "daily" },
        { name: "Docker",        level: "daily" },
        { name: "Ansible",       level: "comfortable" },
        { name: "Terraform",     level: "comfortable" },
        { name: "Kubernetes",    level: "learning" },
      ],
    },
    {
      group: "delivery/",
      items: [
        { name: "Nginx",          level: "daily" },
        { name: "Traefik",        level: "comfortable" },
        { name: "Git",            level: "daily" },
        { name: "GitHub Actions", level: "comfortable" },
        { name: "Cloudflare DNS", level: "comfortable" },
      ],
    },
    {
      group: "platforms/",
      items: [
        { name: "Hetzner",        level: "daily" },
        { name: "Yandex Cloud",   level: "familiar" },
        { name: "Self-hosting",   level: "daily" },
        { name: "Kubernetes lab", level: "learning" },
      ],
    },
  ],
  timeline: [
    {
      date: "2026 — present",
      title: "Portfolio Infrastructure",
      desc: "Built and deployed this portfolio using Terraform, Ansible, GitHub Actions, Docker, and Nginx on a cloud VPS. Full IaC pipeline.",
      tags: ["terraform", "ansible", "docker", "nginx", "github-actions"],
      type: "project",
    },
    {
      date: "2026",
      title: "SadServers Master",
      desc: "Achieved Master rank on SadServers.com — solved real-world Linux debugging challenges covering filesystem issues, process management, networking, and system recovery under production-like pressure.",
      tags: ["linux", "bash", "debugging", "sysadmin"],
      type: "milestone",
    },
    {
      date: "2026",
      title: "Self-hosted Homelab v2",
      desc: "Upgraded from Dell Inspiron to a dedicated cloud VPS. Deployed Pi-hole DNS, WireGuard VPN, and Uptime Kuma monitoring.",
      tags: ["self-hosted", "wireguard", "pi-hole", "linux"],
      type: "milestone",
    },
    {
      date: "2025 — 2026",
      title: "Innowise DevOps Practice Course",
      desc: "Completed hands-on DevOps course covering Linux administration, Git workflows, Docker containerisation, and Ansible automation.",
      tags: ["linux", "docker", "ansible", "git"],
      type: "education",
    },
    {
      date: "2025",
      title: "First Homelab",
      desc: "Started homelabbing on a Dell Inspiron 15 — self-hosted services, bare-metal Linux, local networking. Where the obsession began.",
      tags: ["homelab", "linux", "bare-metal"],
      type: "milestone",
    },
    {
      date: "2025",
      title: "Started Learning DevOps",
      desc: "Began learning Linux, networking fundamentals, and shell scripting. First steps into infrastructure and automation.",
      tags: ["linux", "bash", "networking"],
      type: "education",
    },
  ],
  projects: [
    {
      name: "do-vpn-infra",
      desc: "Production-ready WireGuard VPN on a cloud VPC. Nginx reverse proxy handles traffic routing; provisioned with Terraform, configured with Ansible.",
      tags: ["wireguard", "nginx", "terraform", "ansible"],
      status: "active",
      link: null,
    },
    {
      name: "pi-hole-server",
      desc: "Self-hosted Pi-hole DNS sinkhole on Ubuntu for network-wide ad and tracker blocking. Configured as the primary DNS resolver for the local network.",
      tags: ["pi-hole", "dns", "ubuntu", "self-hosted"],
      status: "active",
      link: null,
    },
    {
      name: "portfolio-infra",
      desc: "This very site — infrastructure fully defined as code. Terraform provisions the cloud resources, Ansible configures the server, GitHub Actions deploys on every push to main.",
      tags: ["terraform", "ansible", "github-actions", "nginx", "docker"],
      status: "active",
      link: "https://github.com/chibixar/Portfolio",
    },
    {
      name: "docker-lab",
      desc: "Ongoing practice Dockerizing diverse applications — multi-stage builds, compose stacks, networking, volumes — to build production-grade containerisation muscle.",
      tags: ["docker", "bash", "linux"],
      status: "active",
      link: null,
    },
    {
      name: "kubernetes-lab",
      desc: "Hands-on Kubernetes practice — deployments, services, ingress controllers, namespaces, and resource limits. Progressing from local kind clusters toward cloud-managed nodes.",
      tags: ["kubernetes", "docker", "linux", "yaml"],
      status: "active",
      link: null,
    },
  ],
  infraStack: [
    { layer: "DNS / CDN",              tools: ["Cloudflare"],     icon: "🌐" },
    { layer: "Web Server / Proxy",     tools: ["Nginx"],          icon: "🔀" },
    { layer: "CI / CD",                tools: ["GitHub Actions"], icon: "⚙️" },
    { layer: "Infrastructure as Code", tools: ["Terraform"],      icon: "🏗️" },
    { layer: "Configuration Mgmt",     tools: ["Ansible"],        icon: "🔧" },
    { layer: "Containers",             tools: ["Docker"],         icon: "🐳" },
    { layer: "OS / Shell",             tools: ["Linux", "Bash"],  icon: "🖥️" },
  ],
};
// ══════════════════════════════════════════════════════════════════════

const PROMPT = `${CONFIG.handle}@${CONFIG.hostname}:~$`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcUptime() {
  const now = new Date();
  const ms = now - CONFIG.devOpsStart;
  const days = Math.floor(ms / 86400000);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  const remDays = days % 30;
  const parts = [];
  if (years > 0) parts.push(`${years}y`);
  if (remMonths > 0) parts.push(`${remMonths}mo`);
  parts.push(`${remDays}d`);
  return parts.join(" ");
}

// ─── Typewriter ───────────────────────────────────────────────────────────────
function useTypewriter(text, speed = 40, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(""); setDone(false);
    let intervalId = null;
    const timeoutId = setTimeout(() => {
      let i = 0;
      intervalId = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(intervalId); setDone(true); }
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);
  return { displayed, done };
}

// ─── Network Background ───────────────────────────────────────────────────────
function NetworkBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const startDelay = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      let animId;
      const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
      resize();
      window.addEventListener("resize", resize);
      const isMobile = () => window.innerWidth < 600;
      const nodeCount = () => isMobile() ? 25 : 45;
      let nodes = [];
      const initNodes = () => {
        nodes = Array.from({ length: nodeCount() }, () => ({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.5 + 0.5, pulse: Math.random() * Math.PI * 2,
        }));
      };
      initNodes();
      const maxDist = isMobile() ? 100 : 140;
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        nodes.forEach(n => {
          n.x += n.vx; n.y += n.vy; n.pulse += 0.02;
          if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
          if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        });
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDist) {
              ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.strokeStyle = `rgba(0,255,65,${(1 - dist / maxDist) * 0.15})`; ctx.lineWidth = 0.5; ctx.stroke();
            }
          }
        }
        nodes.forEach(n => {
          const p = Math.sin(n.pulse) * 0.5 + 0.5;
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r + p * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,255,65,${0.3 + p * 0.4})`; ctx.fill();
        });
        animId = requestAnimationFrame(draw);
      };
      draw();
      return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
    }, 200);
    return () => clearTimeout(startDelay);
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, pointerEvents: "none" }} />;
}

// ─── Glitch Text ──────────────────────────────────────────────────────────────
function GlitchText({ text }) {
  return <span className="glitch" data-text={text} style={{ position: "relative", display: "inline-block" }}>{text}</span>;
}

// ─── 3D Hero Terminal ─────────────────────────────────────────────────────────
function HeroTerminal3D({ children, title }) {
  const wrapRef = useRef(null);
  const rotRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(null);
  const hoveredRef = useRef(false);
  const runningRef = useRef(false);

  useEffect(() => {
    if (window.innerWidth < 640) return;
    const el = wrapRef.current; if (!el) return;
    const onMove = (e) => {
      if (!hoveredRef.current) return;
      const rect = el.getBoundingClientRect();
      targetRef.current = {
        x: ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * -7,
        y: ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 7,
      };
    };
    const tick = () => {
      rotRef.current.x += (targetRef.current.x - rotRef.current.x) * 0.08;
      rotRef.current.y += (targetRef.current.y - rotRef.current.y) * 0.08;
      const { x, y } = rotRef.current;
      if (Math.abs(x) > 0.05 || Math.abs(y) > 0.05) {
        const g = (Math.abs(x) + Math.abs(y)) * 1.2;
        el.style.transform = `perspective(1200px) rotateX(${x}deg) rotateY(${y}deg)`;
        el.style.filter = `drop-shadow(0 ${4 + g}px ${20 + g * 2}px rgba(0,255,65,${0.15 + g * 0.008}))`;
        frameRef.current = requestAnimationFrame(tick);
      } else {
        el.style.transform = ""; el.style.filter = "drop-shadow(0 4px 20px rgba(0,255,65,0.15))";
        runningRef.current = false;
      }
    };
    const onEnter = () => {
      hoveredRef.current = true;
      if (!runningRef.current) { runningRef.current = true; tick(); }
    };
    const onLeave = () => { hoveredRef.current = false; targetRef.current = { x: 0, y: 0 }; if (!runningRef.current) { runningRef.current = true; tick(); } };
    el.addEventListener("mouseenter", onEnter); el.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousemove", onMove); cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div ref={wrapRef} style={{ borderRadius: 4, transition: "filter 0.4s ease", willChange: "transform" }}>
      <div style={{ background: "rgba(0,8,0,0.92)", border: "1px solid #00ff41", borderRadius: 4, fontFamily: "'JetBrains Mono','Fira Code',monospace", overflow: "hidden", boxShadow: "0 0 0 1px rgba(0,255,65,0.08), 0 20px 60px rgba(0,0,0,0.7), inset 0 0 40px rgba(0,0,0,0.4)" }}>
        <div style={{ background: "#001400", borderBottom: "1px solid #00ff41", padding: "6px 12px", display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", flexShrink: 0, display: "inline-block", boxShadow: "0 0 6px #ff5f57" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", flexShrink: 0, display: "inline-block", boxShadow: "0 0 6px #febc2e" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", flexShrink: 0, display: "inline-block", boxShadow: "0 0 6px #28c840" }} />
          <span style={{ color: "#00aa2a", fontSize: 11, marginLeft: 8, letterSpacing: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
        </div>
        <div style={{ padding: "16px 20px", overflowX: "auto" }}>{children}</div>
        <div style={{ height: 2, background: "linear-gradient(90deg,transparent,rgba(0,255,65,0.3),transparent)" }} />
      </div>
    </div>
  );
}

// ─── Terminal Window ──────────────────────────────────────────────────────────
function Terminal({ title = "terminal", children, style = {} }) {
  return (
    <div style={{ background: "rgba(0,8,0,0.92)", border: "1px solid #00ff41", borderRadius: 4, fontFamily: "'JetBrains Mono','Fira Code',monospace", overflow: "hidden", boxShadow: "0 0 30px rgba(0,255,65,0.12), inset 0 0 30px rgba(0,0,0,0.5)", ...style }}>
      <div style={{ background: "#001400", borderBottom: "1px solid #00ff41", padding: "6px 12px", display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", flexShrink: 0, display: "inline-block" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", flexShrink: 0, display: "inline-block" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", flexShrink: 0, display: "inline-block" }} />
        <span style={{ color: "#00aa2a", fontSize: 11, marginLeft: 8, letterSpacing: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
      </div>
      <div style={{ padding: "16px 20px", overflowX: "auto" }}>{children}</div>
    </div>
  );
}

// ─── Prompt Line ──────────────────────────────────────────────────────────────
function Prompt({ cmd, output, delay = 0 }) {
  const [showOutput, setShowOutput] = useState(false);
  const { displayed, done } = useTypewriter(cmd, 35, delay);
  useEffect(() => { if (done) { const t = setTimeout(() => setShowOutput(true), 200); return () => clearTimeout(t); } }, [done]);
  return (
    <div style={{ marginBottom: 12, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
        <span style={{ color: "#00ff41", flexShrink: 0, fontSize: "clamp(10px,2.5vw,13px)" }}>{PROMPT}</span>
        <span style={{ color: "#e0ffe0", wordBreak: "break-all", fontSize: "clamp(10px,2.5vw,13px)" }}>
          {displayed}{!done && <span style={{ animation: "blink 1s infinite" }}>▋</span>}
        </span>
      </div>
      {showOutput && <div style={{ color: "#88cc88", marginTop: 4, lineHeight: 1.7, fontSize: "clamp(10px,2.5vw,12px)" }}>{output}</div>}
    </div>
  );
}

// ─── Skill Badge ──────────────────────────────────────────────────────────────
const SKILL_LEVELS = {
  daily:       { label: "daily driver", color: "#00ff41" },
  comfortable: { label: "comfortable",  color: "#44aaff" },
  familiar:    { label: "familiar",     color: "#aaaa44" },
  learning:    { label: "learning",     color: "#aa44ff" },
};
function SkillBadge({ name, level }) {
  const meta = SKILL_LEVELS[level] || SKILL_LEVELS.familiar;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
      <span style={{ color: "#00ff41", fontSize: 12, letterSpacing: 1 }}>{name}</span>
      <span style={{
        fontSize: 9, padding: "2px 8px", border: `1px solid ${meta.color}`, color: meta.color,
        borderRadius: 2, letterSpacing: 2, whiteSpace: "nowrap", textTransform: "uppercase",
        boxShadow: `0 0 6px ${meta.color}22`,
      }}>
        {meta.label}
      </span>
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ name, desc, tags, status, link }) {
  const [hovered, setHovered] = useState(false);
  const statusColor = status === "active" ? "#00ff41" : status === "finished" ? "#4488ff" : status === "abandoned" ? "#883300" : "#555";
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ border: `1px solid ${hovered ? "#00ff41" : "#003300"}`, background: hovered ? "rgba(0,255,65,0.04)" : "rgba(0,8,0,0.85)", borderRadius: 4, padding: "16px 18px", transition: "all 0.25s ease", boxShadow: hovered ? "0 0 20px rgba(0,255,65,0.1)" : "none", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {hovered && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,#00ff41,transparent)", animation: "scanline 1.5s linear infinite" }} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 8 }}>
        <span style={{ color: "#00ff41", fontWeight: 700, fontSize: "clamp(12px,3vw,14px)", letterSpacing: 1, wordBreak: "break-word" }}>{name}</span>
        <span style={{ fontSize: 9, padding: "2px 6px", border: `1px solid ${statusColor}`, color: statusColor, borderRadius: 2, letterSpacing: 1, flexShrink: 0, whiteSpace: "nowrap" }}>{status.toUpperCase()}</span>
      </div>
      <p style={{ color: "#88aa88", fontSize: "clamp(11px,2.5vw,12px)", lineHeight: 1.6, margin: "0 0 12px" }}>{desc}</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {tags.map(t => <span key={t} style={{ fontSize: 9, color: "#004400", background: "#001400", border: "1px solid #003300", padding: "2px 5px", borderRadius: 2, letterSpacing: 1 }}>{t}</span>)}
      </div>
      <div style={{ marginTop: "auto", paddingTop: 8, borderTop: "1px solid #001a00" }}>
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#00ff41", textDecoration: "none", fontFamily: "monospace", fontSize: 11, letterSpacing: 1 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00ff41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M6 9v6M18 9a9 9 0 0 1-9 9"/></svg>
            view repo
          </a>
        ) : (
          <span style={{ fontFamily: "monospace", fontSize: 10, color: "#003300", letterSpacing: 1 }}>// repo not yet public</span>
        )}
      </div>
    </div>
  );
}

// ─── Timeline Entry ───────────────────────────────────────────────────────────
function TimelineEntry({ entry, index }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const typeColor = entry.type === "education" ? "#4488ff" : entry.type === "milestone" ? "#00ff41" : "#aa44ff";
  const typeLabel = entry.type === "education" ? "EDU" : entry.type === "milestone" ? "MILESTONE" : "PROJECT";
  return (
    <div ref={ref} style={{ display: "flex", gap: 16, alignItems: "flex-start", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s` }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 80 }}>
        <span style={{ fontFamily: "monospace", fontSize: 10, color: "#336633", letterSpacing: 1, textAlign: "right", width: "100%", whiteSpace: "nowrap" }}>{entry.date}</span>
        <div style={{ width: 1, flex: 1, minHeight: 40, background: "linear-gradient(180deg,#003300,transparent)", marginTop: 8 }} />
      </div>
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: typeColor, boxShadow: `0 0 8px ${typeColor}`, border: "2px solid #000400" }} />
      </div>
      <div style={{ flex: 1, background: "rgba(0,8,0,0.85)", border: "1px solid #002200", borderRadius: 4, padding: "12px 16px", marginBottom: 20, fontFamily: "monospace" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{ color: "#00ff41", fontSize: "clamp(12px,2.5vw,14px)", fontWeight: 700, letterSpacing: 1 }}>{entry.title}</span>
          <span style={{ fontSize: 9, padding: "2px 6px", border: `1px solid ${typeColor}`, color: typeColor, borderRadius: 2, letterSpacing: 2, flexShrink: 0 }}>{typeLabel}</span>
        </div>
        <p style={{ color: "#88aa88", fontSize: "clamp(11px,2vw,12px)", lineHeight: 1.6, margin: "0 0 10px" }}>{entry.desc}</p>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {entry.tags.map(t => <span key={t} style={{ fontSize: 9, color: "#004400", background: "#001400", border: "1px solid #002800", padding: "2px 5px", borderRadius: 2, letterSpacing: 1 }}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ cmd }) {
  const { displayed } = useTypewriter(cmd, 18, 50);
  return (
    <div style={{ marginBottom: 28, fontFamily: "monospace", fontSize: "clamp(10px,2.5vw,13px)", overflowX: "auto", whiteSpace: "nowrap" }}>
      <span style={{ color: "#00ff41" }}>{PROMPT}</span>{" "}
      <span style={{ color: "#88cc88" }}>{displayed}</span>
      <span style={{ animation: "blink 1s infinite", color: "#00ff41" }}>▋</span>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ active, onNav }) {
  const links = ["whoami", "cv", "skills", "projects", "timeline", "infra", "contact"];
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNav = (l) => { onNav(l); setMenuOpen(false); };

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(0,4,0,0.97)", borderBottom: "1px solid #001a00", backdropFilter: "blur(10px)" }}>
      <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: "#00ff41", fontFamily: "monospace", fontSize: "clamp(10px,2.5vw,13px)", letterSpacing: 2 }}>
          <span style={{ color: "#005500" }}>root@</span><GlitchText text={CONFIG.domain} />
        </div>
        <div className="desktop-nav" style={{ display: "flex", gap: 2 }}>
          {links.map(l => (
            <button key={l} onClick={() => handleNav(l)} style={{ background: active === l ? "rgba(0,255,65,0.1)" : "transparent", border: active === l ? "1px solid #00ff41" : "1px solid transparent", color: active === l ? "#00ff41" : "#336633", fontFamily: "monospace", fontSize: "clamp(9px,1.5vw,11px)", letterSpacing: 1, padding: "4px 8px", cursor: "pointer", borderRadius: 2, transition: "all 0.2s ease" }}>
              {active === l && "["}{l}{active === l && "]"}
            </button>
          ))}
        </div>
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(o => !o)} style={{ background: "transparent", border: "1px solid #003300", color: "#00ff41", fontFamily: "monospace", fontSize: 16, padding: "4px 10px", cursor: "pointer", borderRadius: 2 }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
      {menuOpen && (
        <div className="mobile-nav" style={{ borderTop: "1px solid #001a00", padding: "8px 16px 12px" }}>
          {links.map(l => (
            <button key={l} onClick={() => handleNav(l)} style={{ display: "block", width: "100%", textAlign: "left", background: active === l ? "rgba(0,255,65,0.08)" : "transparent", border: "none", borderLeft: active === l ? "2px solid #00ff41" : "2px solid transparent", color: active === l ? "#00ff41" : "#336633", fontFamily: "monospace", fontSize: 13, letterSpacing: 2, padding: "8px 12px", cursor: "pointer", marginBottom: 2 }}>
              {active === l && "> "}{l}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── 3D Name ──────────────────────────────────────────────────────────────────
function Name3D() {
  const ref = useRef(null);
  const rotRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(null);
  const activeRef = useRef(false);
  const runningRef = useRef(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const tick = () => {
      rotRef.current.x += (targetRef.current.x - rotRef.current.x) * 0.07;
      rotRef.current.y += (targetRef.current.y - rotRef.current.y) * 0.07;
      const { x, y } = rotRef.current;
      if (Math.abs(x) > 0.01 || Math.abs(y) > 0.01) {
        el.style.transform = `perspective(800px) rotateX(${x}deg) rotateY(${y}deg)`;
        frameRef.current = requestAnimationFrame(tick);
      } else {
        el.style.transform = ""; runningRef.current = false;
      }
    };
    const startTick = () => { if (!runningRef.current) { runningRef.current = true; tick(); } };
    const onMove = (e) => {
      if (!activeRef.current) return;
      const rect = el.getBoundingClientRect();
      targetRef.current = { x: ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * -18, y: ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 18 };
      startTick();
    };
    const onEnter = () => { activeRef.current = true; };
    const onLeave = () => { activeRef.current = false; targetRef.current = { x: 0, y: 0 }; startTick(); };
    el.addEventListener("mouseenter", onEnter); el.addEventListener("mouseleave", onLeave); el.addEventListener("mousemove", onMove);
    return () => { el.removeEventListener("mouseenter", onEnter); el.removeEventListener("mouseleave", onLeave); el.removeEventListener("mousemove", onMove); cancelAnimationFrame(frameRef.current); };
  }, []);

  return (
    <div ref={ref} style={{ display: "inline-block", cursor: "default", willChange: "transform" }}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "clamp(28px,9vw,72px)", fontWeight: 900, color: "#00ff41", letterSpacing: -2, lineHeight: 1, margin: "0 0 4px", textShadow: "0 0 40px rgba(0,255,65,0.4)" }}>
        <GlitchText text={CONFIG.firstName.toUpperCase()} />
      </div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "clamp(28px,9vw,72px)", fontWeight: 900, color: "#003300", letterSpacing: -2, lineHeight: 1 }}>
        {CONFIG.lastName.toUpperCase()}
      </div>
    </div>
  );
}

// ─── Quick Link Pill ──────────────────────────────────────────────────────────
function QuickLink({ href, icon, children, sub }) {
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
      style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "monospace", fontSize: "clamp(10px,2.5vw,12px)", color: "#00ff41", textDecoration: "none", border: "1px solid #00ff41", borderRadius: 3, padding: "6px 14px", background: "rgba(0,255,65,0.05)", letterSpacing: 1, boxShadow: "0 0 10px rgba(0,255,65,0.12)", transition: "all 0.2s ease" }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,65,0.12)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,65,0.25)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,255,65,0.05)"; e.currentTarget.style.boxShadow = "0 0 10px rgba(0,255,65,0.12)"; }}
    >
      {icon}
      {children}
      {sub && <span style={{ color: "#336633", fontSize: "clamp(9px,2vw,10px)" }}>{sub}</span>}
    </a>
  );
}

// ─── Section: whoami ──────────────────────────────────────────────────────────
function WhoAmI() {
  const [copied, setCopied] = useState(false);
  const copyEmail = () => {
    navigator.clipboard?.writeText(CONFIG.contact.email).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <div style={{ fontFamily: "monospace", color: "#003300", fontSize: 11, marginBottom: 16, letterSpacing: 4 }}>INITIALIZING PROFILE...</div>
        <Name3D />
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", margin: "24px 0 20px", padding: "0 8px" }}>
          {[CONFIG.role, CONFIG.location].map(tag => (
            <span key={tag} style={{ fontFamily: "monospace", fontSize: "clamp(9px,2.5vw,12px)", color: "#005500", letterSpacing: 2 }}>// {tag}</span>
          ))}
        </div>

        <div style={{ maxWidth: 600, margin: "0 auto 24px", fontFamily: "monospace", fontSize: "clamp(11px,2.5vw,13px)", color: "#88cc88", lineHeight: 1.8 }}>
          {CONFIG.bio.map((line, i) => <div key={i}>{line}</div>)}
        </div>

        <div style={{ display: "inline-block", background: "#000400", border: "1px solid #002200", borderRadius: 3, padding: "3px 14px", marginBottom: 20 }}>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "#00aa41", letterSpacing: 2 }}>● SYSTEM ONLINE</span>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <QuickLink
            href="#"
            icon={
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00ff41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            }
          >
            <span onClick={(e) => { e.preventDefault(); copyEmail(); }} style={{ cursor: "pointer" }}>
              {copied ? "✓ copied!" : CONFIG.contact.email}
            </span>
          </QuickLink>

          <QuickLink
            href={`https://${CONFIG.contact.github}`}
            icon={
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00ff41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>
              </svg>
            }
          >
            {CONFIG.contact.github}
          </QuickLink>

          <QuickLink
            href={CONFIG.portfolioRepo}
            icon={
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00ff41" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/>
                <path d="M6 9v6M18 9a9 9 0 0 1-9 9"/>
              </svg>
            }
            sub="// infra source"
          >
            Portfolio
          </QuickLink>
        </div>
      </div>

      <HeroTerminal3D title={`${CONFIG.handle}@${CONFIG.hostname} — bash`}>
        <Prompt cmd="cat /etc/profile.d/me.conf" delay={150} output={
          <div style={{ fontSize: "clamp(10px,2.5vw,12px)" }}>
            <div><span style={{ color: "#005500" }}>NAME</span>=<span style={{ color: "#00cc41" }}>"{CONFIG.firstName} {CONFIG.lastName}"</span></div>
            <div><span style={{ color: "#005500" }}>LOCATION</span>=<span style={{ color: "#00cc41" }}>"{CONFIG.location}"</span></div>
            <div><span style={{ color: "#005500" }}>ROLE</span>=<span style={{ color: "#00cc41" }}>"{CONFIG.role}"</span></div>
            <div><span style={{ color: "#005500" }}>DOMAIN</span>=<span style={{ color: "#00cc41" }}>"{CONFIG.domain}"</span></div>
          </div>
        } />
        <Prompt cmd="uptime --devops" delay={900} output={
          <span style={{ color: "#00ff41", fontWeight: "bold" }}>{calcUptime()} and counting</span>
        } />
        <Prompt cmd="echo $READY_TO_BUILD" delay={1500} output={
          <span style={{ color: "#00ff41", fontWeight: "bold" }}>true</span>
        } />
      </HeroTerminal3D>
    </div>
  );
}

// ─── Section: cv ──────────────────────────────────────────────────────────────
function CV() {
  const [lang, setLang] = useState("en");
  const files = {
    en: { path: "/assets/arkadz_en.pdf", label: "arkadz_en.pdf" },
    ru: { path: "/assets/arkadz_ru.pdf", label: "arkadz_ru.pdf" },
  };
  const current = files[lang];
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <SectionHeader cmd="cat ~/cv/arkadz.pdf" />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div style={{ display: "flex", border: "1px solid #003300", borderRadius: 3, overflow: "hidden" }}>
          {["en", "ru"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ background: lang === l ? "rgba(0,255,65,0.12)" : "transparent", border: "none", borderRight: l === "en" ? "1px solid #003300" : "none", color: lang === l ? "#00ff41" : "#336633", fontFamily: "monospace", fontSize: 11, letterSpacing: 2, padding: "6px 20px", cursor: "pointer", transition: "all 0.2s ease" }}>
              {l === "en" ? "[ EN ]" : "[ RU ]"}
            </button>
          ))}
        </div>
        <a href={current.path} download={current.label}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "monospace", fontSize: 11, letterSpacing: 1, color: "#00ff41", textDecoration: "none", border: "1px solid #00ff41", borderRadius: 3, padding: "6px 16px", background: "rgba(0,255,65,0.05)", boxShadow: "0 0 10px rgba(0,255,65,0.12)", transition: "all 0.2s ease" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,65,0.12)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(0,255,65,0.25)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,255,65,0.05)"; e.currentTarget.style.boxShadow = "0 0 10px rgba(0,255,65,0.12)"; }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00ff41" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          wget {current.label}
        </a>
      </div>
      <div style={{ background: "rgba(0,8,0,0.92)", border: "1px solid #00ff41", borderRadius: 4, overflow: "hidden", boxShadow: "0 0 30px rgba(0,255,65,0.12), inset 0 0 30px rgba(0,0,0,0.5)" }}>
        <div style={{ background: "#001400", borderBottom: "1px solid #00ff41", padding: "6px 12px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
          <span style={{ color: "#00aa2a", fontSize: 11, marginLeft: 8, letterSpacing: 2 }}>{current.label}</span>
          <span style={{ marginLeft: "auto", fontSize: 9, color: "#003300", letterSpacing: 2 }}>{lang === "en" ? "ENGLISH" : "RUSSIAN"}</span>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ height: 2, background: "linear-gradient(90deg,transparent,rgba(0,255,65,0.3),transparent)" }} />
          <iframe key={lang} src={`${current.path}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
            style={{ width: "100%", height: "80vh", minHeight: 600, border: "none", display: "block", background: "#fff" }}
            title={`CV — ${lang.toUpperCase()}`}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
        {Object.entries(files).map(([l, f]) => (
          <a key={l} href={f.path} download={f.label}
            style={{ fontFamily: "monospace", fontSize: 10, color: "#336633", textDecoration: "none", border: "1px solid #002200", borderRadius: 2, padding: "4px 12px", letterSpacing: 1, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#00ff41"; e.currentTarget.style.borderColor = "#00ff41"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#336633"; e.currentTarget.style.borderColor = "#002200"; }}
          >↓ {f.label}</a>
        ))}
        <span style={{ fontFamily: "monospace", fontSize: 10, color: "#003300", alignSelf: "center", letterSpacing: 1 }}># pdf's to download</span>
      </div>
    </div>
  );
}

// ─── Section: skills ──────────────────────────────────────────────────────────--
function Skills() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <SectionHeader cmd="ls -la ~/skills/" />
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24, fontFamily: "monospace", fontSize: 10, letterSpacing: 1 }}>
        {Object.entries(SKILL_LEVELS).map(([key, meta]) => (
          <span key={key} style={{ color: meta.color, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: meta.color, display: "inline-block", boxShadow: `0 0 6px ${meta.color}` }} />
            {meta.label}
          </span>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,340px), 1fr))", gap: 20 }}>
        {CONFIG.skills.map(group => (
          <Terminal key={group.group} title={group.group}>
            {group.items.map(s => <SkillBadge key={s.name} {...s} />)}
          </Terminal>
        ))}
      </div>
    </div>
  );
}

// ─── Section: projects ────────────────────────────────────────────────────────
function Projects() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <SectionHeader cmd="find ~/projects -maxdepth 1 -type d | sort" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%,340px), 1fr))", gap: 16 }}>
        {CONFIG.projects.map(p => <ProjectCard key={p.name} {...p} />)}
      </div>
    </div>
  );
}

// ─── Section: timeline ────────────────────────────────────────────────────────
function Timeline() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <SectionHeader cmd="git log --oneline --graph" />
      <div style={{ paddingLeft: 4 }}>
        {CONFIG.timeline.map((entry, i) => <TimelineEntry key={i} entry={entry} index={i} />)}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 80, flexShrink: 0 }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#003300", border: "2px solid #005500", flexShrink: 0 }} />
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "#003300", letterSpacing: 2 }}>// initial commit</span>
        </div>
      </div>
    </div>
  );
}

// ─── Pipeline Diagram ─────────────────────────────────────────────────────────
function PipelineDiagram() {
  const [activeStep, setActiveStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [packets, setPackets] = useState([]);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  const packetId = useRef(0);
  const timeoutIds = useRef([]);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const steps = [
    { id: "push",  label: "git push",     icon: "⬆",  sub: "origin main",        color: "#00ff41" },
    { id: "build", label: "docker build", icon: "🔨", sub: "npm ci + vite build", color: "#44aaff" },
    { id: "push2", label: "docker push",  icon: "📦", sub: "→ ghcr.io",           color: "#aa44ff" },
    { id: "ssh",   label: "ssh deploy",   icon: "🔑", sub: "appleboy/ssh-action", color: "#ffaa00" },
    { id: "pull",  label: "docker pull",  icon: "⬇",  sub: "from ghcr.io",        color: "#44aaff" },
    { id: "up",    label: "compose up",   icon: "🚀", sub: "--no-build -d",        color: "#00ff41" },
    { id: "live",  label: "live",         icon: "✓",  sub: "chibixar.com",         color: "#00ff41" },
  ];

  useEffect(() => () => timeoutIds.current.forEach(clearTimeout), []);

  const run = useCallback(() => {
    if (running) return;
    setRunning(true); setActiveStep(-1); setPackets([]);
    steps.forEach((_, i) => {
      const id = setTimeout(() => {
        setActiveStep(i);
        if (i < steps.length - 1) {
          const pid = packetId.current++;
          setPackets(prev => [...prev, { id: pid, from: i, progress: 0 }]);
          const dur = 600; const start = Date.now();
          const animate = () => {
            const t = Math.min((Date.now() - start) / dur, 1);
            setPackets(prev => prev.map(p => p.id === pid ? { ...p, progress: t } : p));
            if (t < 1) requestAnimationFrame(animate);
            else setPackets(prev => prev.filter(p => p.id !== pid));
          };
          requestAnimationFrame(animate);
        }
        if (i === steps.length - 1) setTimeout(() => setRunning(false), 800);
      }, i * 900);
      timeoutIds.current.push(id);
    });
  }, [running]);

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ fontFamily: "monospace", fontSize: 11, color: "#003300", letterSpacing: 3, marginBottom: 16 }}>// deployment pipeline</div>
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: 0, overflowX: isMobile ? "visible" : "auto", paddingBottom: 8 }}>
        {steps.map((step, i) => (
          <div key={step.id} style={{ display: "flex", flexDirection: isMobile ? "row" : "column", alignItems: "center", position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: isMobile ? "auto" : 90, minWidth: isMobile ? 0 : 90, padding: isMobile ? "8px 12px" : "10px 8px", background: activeStep >= i ? "rgba(0,255,65,0.08)" : "rgba(0,8,0,0.8)", border: `1px solid ${activeStep >= i ? step.color : "#002200"}`, borderRadius: 4, transition: "all 0.3s ease", boxShadow: activeStep === i ? `0 0 16px ${step.color}44` : "none", flexShrink: 0 }}>
              <span style={{ fontSize: isMobile ? 16 : 20, marginBottom: isMobile ? 0 : 4, marginRight: isMobile ? 8 : 0 }}>{step.icon}</span>
              <span style={{ fontFamily: "monospace", fontSize: 10, color: activeStep >= i ? step.color : "#336633", letterSpacing: 1, textAlign: "center", whiteSpace: "nowrap" }}>{step.label}</span>
              <span style={{ fontFamily: "monospace", fontSize: 8, color: "#003300", textAlign: "center", marginTop: 2, whiteSpace: "nowrap" }}>{step.sub}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: isMobile ? 2 : 32, height: isMobile ? 24 : 2, margin: isMobile ? "0 0 0 20px" : "0", flexShrink: 0 }}>
                <div style={{ position: "absolute", background: activeStep > i ? "#003300" : "#001a00", width: isMobile ? 2 : "100%", height: isMobile ? "100%" : 2, transition: "background 0.3s ease" }} />
                {packets.filter(p => p.from === i).map(p => (
                  <div key={p.id} style={{ position: "absolute", width: 6, height: 6, borderRadius: "50%", background: step.color, boxShadow: `0 0 8px ${step.color}`, left: isMobile ? "50%" : `${p.progress * 100}%`, top: isMobile ? `${p.progress * 100}%` : "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={run} disabled={running} style={{ background: "transparent", border: `1px solid ${running ? "#003300" : "#00ff41"}`, color: running ? "#003300" : "#00ff41", fontFamily: "monospace", fontSize: 12, letterSpacing: 2, padding: "6px 20px", cursor: running ? "default" : "pointer", borderRadius: 2, transition: "all 0.2s ease" }}>
          {running ? "▶ running..." : "▶ run pipeline"}
        </button>
        {activeStep === steps.length - 1 && !running && (
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "#00ff41", letterSpacing: 2, animation: "blink 1s infinite" }}>✓ deployed successfully</span>
        )}
      </div>
    </div>
  );
}

// ─── Section: infra ───────────────────────────────────────────────────────────
function Infra() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <SectionHeader cmd="cat ~/infra/stack.yml" />
      <Terminal title="stack overview — top to bottom">
        <div style={{ fontFamily: "monospace", fontSize: "clamp(11px,2.5vw,12px)" }}>
          {CONFIG.infraStack.map(s => (
            <div key={s.layer} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "1px solid #001400", flexWrap: "wrap" }}>
              <span style={{ color: "#005500", width: 20, flexShrink: 0, textAlign: "center" }}>{s.icon}</span>
              <span style={{ color: "#336633", minWidth: 160, flexShrink: 0 }}>{s.layer}</span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {s.tools.map(t => <span key={t} style={{ color: "#00ff41", background: "rgba(0,255,65,0.05)", border: "1px solid #002200", padding: "1px 8px", borderRadius: 2 }}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, color: "#003300", fontSize: "clamp(10px,2.5vw,11px)", lineHeight: 1.8 }}>
          <div># This portfolio runs on the exact same stack.</div>
          <div># Terraform provisions → Ansible configures → GitHub Actions deploys.</div>
          <div># Nginx terminates TLS; Docker runs the app; Cloudflare handles DNS.</div>
          <div style={{ color: "#00ff41", marginTop: 4 }}>$ terraform apply <span style={{ color: "#004400" }}># idempotent, always</span></div>
        </div>
        <PipelineDiagram />
      </Terminal>
    </div>
  );
}

// ─── Section: contact ─────────────────────────────────────────────────────────
function Contact() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const persistedLog = useRef([{ type: "sys", text: `Connection established. Type "help" for commands.` }]);
  const [log, setLog] = useState(persistedLog.current);

  const appendLog = useCallback((entries) => {
    persistedLog.current = [...persistedLog.current, ...entries];
    setLog([...persistedLog.current]);
  }, []);

  const contactCmds = Object.entries(CONFIG.contact)
    .filter(([, v]) => v !== null)
    .reduce((acc, [key, value]) => {
      let href;
      if (key === "email") href = `mailto:${value}`;
      else href = `https://${value}`;
      acc[key] = () => [{ type: "link", text: href, label: `→ ${value}` }];
      return acc;
    }, {});

  const getCommands = useCallback(() => ({
    help: () => [
      { type: "out", text: "Available commands:" },
      ...Object.keys(contactCmds).map(k => ({ type: "out", text: `  ${k.padEnd(10)}— open link` })),
      { type: "out", text: "  copy       — copy email to clipboard" },
      { type: "out", text: "  uptime     — time in DevOps" },
      { type: "out", text: "  location   — current coordinates" },
      { type: "out", text: "  clear      — clear terminal" },
    ],
    location: () => [
      { type: "out", text: `📍 ${CONFIG.location}  [${CONFIG.locationCoords}]` },
      { type: "out", text: `Timezone: ${CONFIG.timezone}` },
    ],
    uptime: () => [
      { type: "out", text: `uptime: ${calcUptime()}  // since March 2025` },
      { type: "out", text: `status: actively building infrastructure` },
    ],
    copy: () => {
      navigator.clipboard?.writeText(CONFIG.contact.email).catch(() => {});
      setCopied(true); setTimeout(() => setCopied(false), 2000);
      return [{ type: "out", text: `✓ copied ${CONFIG.contact.email} to clipboard` }];
    },
    ...contactCmds,
  }), [contactCmds]);

  const handleCmd = useCallback(() => {
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === "clear") {
      persistedLog.current = [{ type: "sys", text: "Terminal cleared." }];
      setLog([...persistedLog.current]); setInput(""); return;
    }
    const commands = getCommands();
    const result = commands[cmd] ? commands[cmd]() : [{ type: "err", text: `command not found: ${cmd}. Type "help".` }];
    appendLog([{ type: "cmd", text: cmd }, ...(result || [])]);
    setInput("");
  }, [input, getCommands, appendLog]);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);

  const quickCmds = ["help", ...Object.keys(contactCmds), "copy", "uptime", "location"];

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <SectionHeader cmd="nc -l 4444  # listening for connections" />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <a href={`mailto:${CONFIG.contact.email}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "monospace", fontSize: 11, color: "#00aa41", textDecoration: "none", border: "1px solid #002200", borderRadius: 3, padding: "6px 14px", background: "rgba(0,255,65,0.04)", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#00ff41"; e.currentTarget.style.color = "#00ff41"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#002200"; e.currentTarget.style.color = "#00aa41"; }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          {CONFIG.contact.email}
        </a>
        <button onClick={() => { navigator.clipboard?.writeText(CONFIG.contact.email).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "monospace", fontSize: 11, cursor: "pointer", color: copied ? "#00ff41" : "#336633", border: `1px solid ${copied ? "#00ff41" : "#003300"}`, borderRadius: 3, padding: "6px 14px", background: copied ? "rgba(0,255,65,0.1)" : "transparent", transition: "all 0.2s", letterSpacing: 1 }}>
          {copied ? "✓ copied" : "copy email"}
        </button>
      </div>

      <Terminal title="contact — interactive shell">
        <div className="quick-cmds" style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {quickCmds.map(cmd => (
            <button key={cmd} onClick={() => { const commands = getCommands(); const result = commands[cmd] ? commands[cmd]() : []; appendLog([{ type: "cmd", text: cmd }, ...(result || [])]); }}
              style={{ background: "transparent", border: "1px solid #003300", color: "#336633", fontFamily: "monospace", fontSize: 11, padding: "3px 10px", cursor: "pointer", borderRadius: 2, letterSpacing: 1 }}>
              {cmd}
            </button>
          ))}
        </div>
        <div ref={logRef} style={{ height: 240, overflowY: "auto", marginBottom: 12, scrollbarWidth: "thin", scrollbarColor: "#003300 transparent" }}>
          {log.map((entry, i) => (
            <div key={i} style={{ marginBottom: 4, fontFamily: "monospace", fontSize: "clamp(10px,2.5vw,12px)", wordBreak: "break-word" }}>
              {entry.type === "cmd"  && <div><span style={{ color: "#00ff41" }}>{PROMPT}</span> <span style={{ color: "#e0ffe0" }}>{entry.text}</span></div>}
              {entry.type === "out"  && <div style={{ color: "#88aa88", paddingLeft: 2 }}>{entry.text}</div>}
              {entry.type === "sys"  && <div style={{ color: "#004400" }}>[SYS] {entry.text}</div>}
              {entry.type === "err"  && <div style={{ color: "#ff4444" }}>bash: {entry.text}</div>}
              {entry.type === "link" && <a href={entry.text} target="_blank" rel="noreferrer" style={{ color: "#00ff41", textDecoration: "none", display: "block", paddingLeft: 2 }}>{entry.label}</a>}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid #001400", paddingTop: 10 }}>
          <span style={{ color: "#00ff41", fontFamily: "monospace", fontSize: "clamp(10px,2.5vw,12px)", flexShrink: 0 }}>{PROMPT}</span>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleCmd(); }}
            style={{ background: "transparent", border: "none", outline: "none", color: "#e0ffe0", fontFamily: "monospace", fontSize: "clamp(10px,2.5vw,12px)", flex: 1, caretColor: "#00ff41", minWidth: 0 }}
            placeholder="type a command..."
          />
          <button onClick={handleCmd} style={{ background: "transparent", border: "1px solid #003300", color: "#00ff41", fontFamily: "monospace", fontSize: 11, padding: "3px 8px", cursor: "pointer", borderRadius: 2, flexShrink: 0 }}>↵</button>
        </div>
      </Terminal>
    </div>
  );
}

// ─── Section map ──────────────────────────────────────────────────────────────
const SECTION_MAP = { whoami: WhoAmI, cv: CV, skills: Skills, projects: Projects, timeline: Timeline, infra: Infra, contact: Contact };

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [section, setSection] = useState("whoami");
  const [clock, setClock] = useState(() => new Date().toLocaleTimeString("en-US", { hour12: false }));

  useEffect(() => {
    const id = setInterval(() => setClock(new Date().toLocaleTimeString("en-US", { hour12: false })), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const tags = [
      { property: "og:title",        content: `${CONFIG.firstName} ${CONFIG.lastName} — ${CONFIG.role}` },
      { property: "og:description",  content: CONFIG.bio[0] },
      { property: "og:url",          content: `https://${CONFIG.domain}` },
      { property: "og:type",         content: "website" },
      { name: "twitter:card",        content: "summary" },
      { name: "twitter:title",       content: `${CONFIG.firstName} ${CONFIG.lastName} — ${CONFIG.role}` },
      { name: "twitter:description", content: CONFIG.bio[0] },
      { name: "description",         content: CONFIG.bio[0] },
    ];
    const els = tags.map(attrs => {
      const el = document.createElement("meta");
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      document.head.appendChild(el);
      return el;
    });
    const prevTitle = document.title;
    document.title = `${CONFIG.firstName} ${CONFIG.lastName} — ${CONFIG.role}`;
    return () => { els.forEach(el => el.remove()); document.title = prevTitle; };
  }, []);

  const ActiveSection = SECTION_MAP[section];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #000400; color: #00cc41; font-family: 'JetBrains Mono', monospace; overflow-x: hidden; }
        ::selection { background: #00ff41; color: #000; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #000; } ::-webkit-scrollbar-thumb { background: #003300; }
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scanline { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes glitch-anim  { 0%,100%{clip-path:inset(0 0 98% 0);transform:translate(-2px,0)} 20%{clip-path:inset(40% 0 50% 0);transform:translate(2px,0)} 40%{clip-path:inset(80% 0 5% 0);transform:translate(-2px,0)} 60%{clip-path:inset(10% 0 80% 0);transform:translate(2px,0)} 80%{clip-path:inset(60% 0 30% 0);transform:translate(-2px,0)} }
        @keyframes glitch-anim2 { 0%,100%{clip-path:inset(50% 0 30% 0);transform:translate(2px,0);color:#0ff} 30%{clip-path:inset(5% 0 90% 0);transform:translate(-2px,0);color:#f0f} 60%{clip-path:inset(70% 0 10% 0);transform:translate(2px,0);color:#0ff} }
        .glitch::before, .glitch::after { content: attr(data-text); position: absolute; top:0; left:0; width:100%; }
        .glitch::before { animation: glitch-anim  4s infinite;      color: #0ff; left:  2px; }
        .glitch::after  { animation: glitch-anim2 4s infinite 0.1s; color: #f0f; left: -2px; }
        .glitch:hover::before, .glitch:hover::after { animation-duration: 0.3s; }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .section-enter { animation: fadeSlideUp 0.5s ease forwards; }
        body::before { content:''; position:fixed; top:0;left:0;right:0;bottom:0; pointer-events:none; z-index:9999; background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px); }
        .desktop-nav { display: flex; }
        .mobile-menu-btn { display: none; }
        .mobile-nav { display: none; }
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-nav { display: block !important; }
          .quick-cmds { display: flex !important; }
        }
        @media (min-width: 641px) { .quick-cmds { display: none !important; } }
      `}</style>

      <NetworkBackground />
      <Nav active={section} onNav={setSection} />

      <main style={{ minHeight: "100vh", paddingTop: 60, paddingBottom: 50, position: "relative", zIndex: 1 }}>
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.75) 100%)", pointerEvents: "none", zIndex: 2 }} />
        <div key={section} className="section-enter" style={{ padding: "24px 16px", position: "relative", zIndex: 3 }}>
          <ActiveSection />
        </div>
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "rgba(0,8,0,0.98)", borderTop: "1px solid #001a00", padding: "4px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: "#003300", letterSpacing: 1 }}>INSERT — {section.toUpperCase()} — UTF-8</span>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: "#003300", letterSpacing: 1 }}>{clock} {CONFIG.timezone} · {CONFIG.timezoneLabel}</span>
        </div>
      </main>
    </>
  );
}