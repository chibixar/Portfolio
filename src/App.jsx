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
  bio: [
    "Engineer at the intersection of infrastructure, automation, and reliability.",
    "I turn manual toil into deterministic pipelines — if it's not in code, it doesn't exist.",
  ],
  contact: {
    email: null,
    github: "github.com/chibixar",
    linkedin: null,
    telegram: null,
  },
  skills: [
    {
      group: "infrastructure/",
      items: [
        { name: "Terraform",  level: 92 },
        { name: "Ansible",    level: 88 },
        { name: "Docker",     level: 90 },
        { name: "Linux/Bash", level: 95 },
      ],
    },
    {
      group: "delivery/",
      items: [
        { name: "GitHub Actions", level: 88 },
        { name: "Nginx",          level: 82 },
        { name: "Cloudflare DNS", level: 98 },
        { name: "Git",            level: 90 },
      ],
    },
  ],
  projects: [
    {
      name: "do-vpn-infra",
      desc: "Production-ready WireGuard VPN on a DigitalOcean VPC. Nginx reverse proxy handles traffic routing; provisioned with Terraform, configured with Ansible.",
      tags: ["digitalocean", "wireguard", "nginx", "terraform", "ansible"],
      status: "active",
    },
    {
      name: "pi-hole-server",
      desc: "Self-hosted Pi-hole DNS sinkhole on Ubuntu for network-wide ad and tracker blocking. Configured as the primary DNS resolver for the local network.",
      tags: ["pi-hole", "dns", "ubuntu", "self-hosted"],
      status: "active",
    },
    {
      name: "portfolio-infra",
      desc: "This very site — infrastructure fully defined as code. Terraform provisions the cloud resources, Ansible configures the server, GitHub Actions deploys on every push to main.",
      tags: ["terraform", "ansible", "github-actions", "nginx", "docker"],
      status: "active",
    },
    {
      name: "innowise-devops-course",
      desc: "Completed the Innowise DevOps Practice Course. Hands-on modules covering Linux administration, Git workflows, Docker, and Ansible automation.",
      tags: ["linux", "git", "docker", "ansible"],
      status: "finished",
    },
    {
      name: "docker-lab",
      desc: "Ongoing practice Dockerizing diverse applications — multi-stage builds, compose stacks, networking, volumes — to build production-grade containerisation muscle.",
      tags: ["docker", "bash", "linux"],
      status: "active",
    },
    {
      name: "dell-homelab",
      desc: "First homelab experiments on a Dell Inspiron 15. Where the infrastructure obsession started — self-hosted services, bare-metal Linux, local networking.",
      tags: ["homelab", "linux", "bare-metal"],
      status: "abandoned",
    },
  ],
  infraStack: [
    { layer: "DNS / CDN",              tools: ["Cloudflare"],       icon: "🌐" },
    { layer: "Web Server / Proxy",     tools: ["Nginx"],            icon: "🔀" },
    { layer: "CI / CD",                tools: ["GitHub Actions"],   icon: "⚙️" },
    { layer: "Infrastructure as Code", tools: ["Terraform"],        icon: "🏗️" },
    { layer: "Configuration Mgmt",     tools: ["Ansible"],          icon: "🔧" },
    { layer: "Containers",             tools: ["Docker"],           icon: "🐳" },
    { layer: "OS / Shell",             tools: ["Linux", "Bash"],    icon: "🖥️" },
  ],
};
// ══════════════════════════════════════════════════════════════════════

const PROMPT = `${CONFIG.handle}@${CONFIG.hostname}:~$`;

// ─── Typewriter Hook ───────────────────────────────────────────────────────────
function useTypewriter(text, speed = 40, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(""); setDone(false);
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(interval); setDone(true); }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);
  return { displayed, done };
}

// ─── Matrix Rain ───────────────────────────────────────────────────────────────
function MatrixRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\;:".split("");
    const fontSize = 13;
    let cols = Math.floor(canvas.width / fontSize);
    let drops = Array(cols).fill(1);
    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      cols = Math.floor(canvas.width / fontSize);
      if (drops.length !== cols) drops = Array(cols).fill(1);
      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const bright = Math.random() > 0.95;
        ctx.fillStyle = bright ? "#ffffff" : (Math.random() > 0.7 ? "#00ff41" : "#003b00");
        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 0, opacity: 0.18, pointerEvents: "none" }} />;
}

// ─── Glitch Text ───────────────────────────────────────────────────────────────
function GlitchText({ text }) {
  return (
    <span className="glitch" data-text={text} style={{ position: "relative", display: "inline-block" }}>
      {text}
    </span>
  );
}

// ─── Terminal Window ───────────────────────────────────────────────────────────
function Terminal({ title = "terminal", children, style = {} }) {
  return (
    <div style={{
      background: "rgba(0,8,0,0.88)", border: "1px solid #00ff41", borderRadius: 4,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace", overflow: "hidden",
      boxShadow: "0 0 30px rgba(0,255,65,0.15), inset 0 0 30px rgba(0,0,0,0.5)",
      ...style,
    }}>
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

// ─── Prompt Line ───────────────────────────────────────────────────────────────
function Prompt({ cmd, output, delay = 0 }) {
  const [showOutput, setShowOutput] = useState(false);
  const { displayed, done } = useTypewriter(cmd, 35, delay);
  useEffect(() => { if (done) { const t = setTimeout(() => setShowOutput(true), 200); return () => clearTimeout(t); } }, [done]);
  return (
    <div style={{ marginBottom: 12, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
        <span style={{ color: "#00ff41", flexShrink: 0, fontSize: "clamp(10px,2.5vw,13px)" }}>{PROMPT}</span>
        <span style={{ color: "#e0ffe0", wordBreak: "break-all", fontSize: "clamp(10px,2.5vw,13px)" }}>{displayed}{!done && <span style={{ animation: "blink 1s infinite" }}>▋</span>}</span>
      </div>
      {showOutput && <div style={{ color: "#88cc88", marginTop: 4, lineHeight: 1.7, fontSize: "clamp(10px,2.5vw,12px)" }}>{output}</div>}
    </div>
  );
}

// ─── Skill Badge ───────────────────────────────────────────────────────────────
function SkillBadge({ name, level }) {
  const bars = Math.round(level / 10);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
      <span style={{ color: "#00ff41", width: "clamp(100px,40%,160px)", fontSize: 12, letterSpacing: 1, flexShrink: 0 }}>{name}</span>
      <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
        {Array(10).fill(0).map((_, i) => (
          <div key={i} style={{
            width: 7, height: 13,
            background: i < bars ? "#00ff41" : "#001a00",
            border: `1px solid ${i < bars ? "#00ff41" : "#003300"}`,
            boxShadow: i < bars ? "0 0 4px #00ff41" : "none",
            transition: `all 0.3s ease ${i * 60}ms`,
          }} />
        ))}
      </div>
      <span style={{ color: "#005500", fontSize: 11 }}>{level}%</span>
    </div>
  );
}

// ─── Project Card ──────────────────────────────────────────────────────────────
function ProjectCard({ name, desc, tags, status }) {
  const [hovered, setHovered] = useState(false);
  const statusColor = status === "active" ? "#00ff41" : status === "finished" ? "#4488ff" : status === "abandoned" ? "#883300" : "#555";
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? "#00ff41" : "#003300"}`,
        background: hovered ? "rgba(0,255,65,0.04)" : "rgba(0,8,0,0.6)",
        borderRadius: 4, padding: "16px 18px",
        transition: "all 0.25s ease",
        boxShadow: hovered ? "0 0 20px rgba(0,255,65,0.1)" : "none",
        position: "relative", overflow: "hidden",
      }}
    >
      {hovered && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,#00ff41,transparent)", animation: "scanline 1.5s linear infinite" }} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 8 }}>
        <span style={{ color: "#00ff41", fontWeight: 700, fontSize: "clamp(12px,3vw,14px)", letterSpacing: 1, wordBreak: "break-word" }}>{name}</span>
        <span style={{ fontSize: 9, padding: "2px 6px", border: `1px solid ${statusColor}`, color: statusColor, borderRadius: 2, letterSpacing: 1, flexShrink: 0, whiteSpace: "nowrap" }}>{status.toUpperCase()}</span>
      </div>
      <p style={{ color: "#88aa88", fontSize: "clamp(11px,2.5vw,12px)", lineHeight: 1.6, margin: "0 0 12px" }}>{desc}</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {tags.map(t => <span key={t} style={{ fontSize: 9, color: "#004400", background: "#001400", border: "1px solid #003300", padding: "2px 5px", borderRadius: 2, letterSpacing: 1 }}>{t}</span>)}
      </div>
    </div>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ cmd }) {
  const { displayed } = useTypewriter(cmd, 30, 100);
  return (
    <div style={{ marginBottom: 28, fontFamily: "monospace", fontSize: "clamp(10px,2.5vw,13px)", overflowX: "auto", whiteSpace: "nowrap" }}>
      <span style={{ color: "#00ff41" }}>{PROMPT}</span>{" "}
      <span style={{ color: "#88cc88" }}>{displayed}</span>
      <span style={{ animation: "blink 1s infinite", color: "#00ff41" }}>▋</span>
    </div>
  );
}

// ─── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ active, onNav }) {
  const links = ["whoami", "skills", "projects", "infra", "contact"];
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(0,4,0,0.95)", borderBottom: "1px solid #001a00",
      backdropFilter: "blur(10px)",
    }}>
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: "#00ff41", fontFamily: "monospace", fontSize: "clamp(11px,3vw,13px)", letterSpacing: 2 }}>
          <span style={{ color: "#005500" }}>root@</span>
          <GlitchText text={CONFIG.domain} />
        </div>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: "flex", gap: 4 }}>
          {links.map(l => (
            <button key={l} onClick={() => onNav(l)} style={{
              background: active === l ? "rgba(0,255,65,0.1)" : "transparent",
              border: active === l ? "1px solid #00ff41" : "1px solid transparent",
              color: active === l ? "#00ff41" : "#336633",
              fontFamily: "monospace", fontSize: 11, letterSpacing: 2,
              padding: "5px 10px", cursor: "pointer", borderRadius: 2,
              transition: "all 0.2s ease",
            }}>
              {active === l && "["}{l}{active === l && "]"}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(o => !o)}
          style={{ background: "transparent", border: "1px solid #003300", color: "#00ff41", fontFamily: "monospace", fontSize: 16, padding: "4px 10px", cursor: "pointer", borderRadius: 2 }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-nav" style={{ borderTop: "1px solid #001a00", padding: "8px 16px 12px" }}>
          {links.map(l => (
            <button key={l} onClick={() => { onNav(l); setMenuOpen(false); }} style={{
              display: "block", width: "100%", textAlign: "left",
              background: active === l ? "rgba(0,255,65,0.08)" : "transparent",
              border: "none", borderLeft: active === l ? "2px solid #00ff41" : "2px solid transparent",
              color: active === l ? "#00ff41" : "#336633",
              fontFamily: "monospace", fontSize: 13, letterSpacing: 2,
              padding: "8px 12px", cursor: "pointer", marginBottom: 2,
            }}>
              {active === l && "> "}{l}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── Section: whoami ──────────────────────────────────────────────────────────
function WhoAmI() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <div style={{ fontFamily: "monospace", color: "#003300", fontSize: 11, marginBottom: 16, letterSpacing: 4 }}>INITIALIZING PROFILE...</div>
        <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(32px,10vw,72px)", fontWeight: 900, color: "#00ff41", letterSpacing: -2, lineHeight: 1, textShadow: "0 0 40px rgba(0,255,65,0.5)", margin: "0 0 4px" }}>
          <GlitchText text={CONFIG.firstName.toUpperCase()} />
        </h1>
        <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(32px,10vw,72px)", fontWeight: 900, color: "#003300", letterSpacing: -2, lineHeight: 1, margin: "0 0 24px" }}>
          {CONFIG.lastName.toUpperCase()}
        </h1>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 32, padding: "0 8px" }}>
          {[CONFIG.role, CONFIG.location].map(tag => (
            <span key={tag} style={{ fontFamily: "monospace", fontSize: "clamp(10px,2.5vw,12px)", color: "#005500", letterSpacing: 2 }}>// {tag}</span>
          ))}
        </div>
        <div style={{ display: "inline-block", background: "#000", border: "1px solid #002200", borderRadius: 3, padding: "3px 14px" }}>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "#00aa41", letterSpacing: 2 }}>● SYSTEM ONLINE</span>
        </div>
      </div>
      <Terminal title={`${CONFIG.handle}@${CONFIG.hostname} — bash`}>
        <Prompt cmd="cat /etc/profile.d/me.conf" delay={400} output={
          <div style={{ fontSize: "clamp(10px,2.5vw,12px)" }}>
            <div><span style={{ color: "#005500" }}>NAME</span>=<span style={{ color: "#00cc41" }}>"{CONFIG.firstName} {CONFIG.lastName}"</span></div>
            <div><span style={{ color: "#005500" }}>LOCATION</span>=<span style={{ color: "#00cc41" }}>"{CONFIG.location}"</span></div>
            <div><span style={{ color: "#005500" }}>ROLE</span>=<span style={{ color: "#00cc41" }}>"{CONFIG.role}"</span></div>
            <div><span style={{ color: "#005500" }}>DOMAIN</span>=<span style={{ color: "#00cc41" }}>"{CONFIG.domain}"</span></div>
          </div>
        } />
        <Prompt cmd="cat ~/bio.txt" delay={2000} output={
          <div style={{ fontSize: "clamp(10px,2.5vw,12px)" }}>{CONFIG.bio.map((line, i) => <div key={i}>{line}</div>)}</div>
        } />
        <Prompt cmd="echo $READY_TO_BUILD" delay={4200} output={
          <span style={{ color: "#00ff41", fontWeight: "bold" }}>true</span>
        } />
      </Terminal>
    </div>
  );
}

// ─── Section: skills ──────────────────────────────────────────────────────────
function Skills() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <SectionHeader cmd="ls -la ~/skills/" />
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
                {s.tools.map(t => (
                  <span key={t} style={{ color: "#00ff41", background: "rgba(0,255,65,0.05)", border: "1px solid #002200", padding: "1px 8px", borderRadius: 2 }}>{t}</span>
                ))}
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
      </Terminal>
    </div>
  );
}

// ─── Section: contact ─────────────────────────────────────────────────────────
function Contact() {
  const [input, setInput] = useState("");
  const logRef = useRef(null);
  const inputRef = useRef(null);

  const contactCmds = Object.entries(CONFIG.contact)
    .filter(([, v]) => v !== null)
    .reduce((acc, [key, value]) => {
      const href = key === "email" ? `mailto:${value}` : `https://${value}`;
      acc[key] = () => [{ type: "link", text: href, label: `→ ${value}` }];
      return acc;
    }, {});

  const [log, setLog] = useState([
    { type: "sys", text: `Connection established. Type "help" for commands.` },
  ]);

  const commands = {
    help: () => [
      { type: "out", text: "Available commands:" },
      ...Object.keys(contactCmds).map(k => ({ type: "out", text: `  ${k.padEnd(10)}— open link` })),
      { type: "out", text: "  location  — current coordinates" },
      { type: "out", text: "  clear     — clear terminal" },
    ],
    location: () => [
      { type: "out", text: `📍 ${CONFIG.location}  [${CONFIG.locationCoords}]` },
      { type: "out", text: `Timezone: ${CONFIG.timezone}` },
    ],
    ...contactCmds,
  };

  const handleCmd = useCallback(() => {
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === "clear") { setLog([{ type: "sys", text: "Terminal cleared." }]); setInput(""); return; }
    const result = commands[cmd]
      ? commands[cmd]()
      : [{ type: "err", text: `command not found: ${cmd}. Type "help".` }];
    setLog(prev => [...prev, { type: "cmd", text: cmd }, ...(result || [])]);
    setInput("");
  }, [input]);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);

  // quick-tap buttons for mobile
  const quickCmds = ["help", ...Object.keys(contactCmds), "location"];

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <SectionHeader cmd="nc -l 4444  # listening for connections" />
      <Terminal title="contact — interactive shell">
        {/* Quick tap buttons for mobile */}
        <div className="quick-cmds" style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {quickCmds.map(cmd => (
            <button key={cmd} onClick={() => {
              const result = commands[cmd] ? commands[cmd]() : [];
              setLog(prev => [...prev, { type: "cmd", text: cmd }, ...(result || [])]);
            }} style={{
              background: "transparent", border: "1px solid #003300", color: "#336633",
              fontFamily: "monospace", fontSize: 11, padding: "3px 10px",
              cursor: "pointer", borderRadius: 2, letterSpacing: 1,
            }}>
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
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleCmd(); }}
            style={{ background: "transparent", border: "none", outline: "none", color: "#e0ffe0", fontFamily: "monospace", fontSize: "clamp(10px,2.5vw,12px)", flex: 1, caretColor: "#00ff41", minWidth: 0 }}
            placeholder="type a command..."
          />
          {/* Send button for mobile keyboards */}
          <button onClick={handleCmd} style={{ background: "transparent", border: "1px solid #003300", color: "#00ff41", fontFamily: "monospace", fontSize: 11, padding: "3px 8px", cursor: "pointer", borderRadius: 2, flexShrink: 0 }}>↵</button>
        </div>
      </Terminal>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [section, setSection] = useState("whoami");
  const sections = {
    whoami:   <WhoAmI />,
    skills:   <Skills />,
    projects: <Projects />,
    infra:    <Infra />,
    contact:  <Contact />,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #000400; color: #00cc41; font-family: 'JetBrains Mono', monospace; overflow-x: hidden; }
        ::selection { background: #00ff41; color: #000; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #003300; }

        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scanline { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes glitch-anim {
          0%,100%{clip-path:inset(0 0 98% 0);transform:translate(-2px,0)}
          20%{clip-path:inset(40% 0 50% 0);transform:translate(2px,0)}
          40%{clip-path:inset(80% 0 5% 0);transform:translate(-2px,0)}
          60%{clip-path:inset(10% 0 80% 0);transform:translate(2px,0)}
          80%{clip-path:inset(60% 0 30% 0);transform:translate(-2px,0)}
        }
        @keyframes glitch-anim2 {
          0%,100%{clip-path:inset(50% 0 30% 0);transform:translate(2px,0);color:#0ff}
          30%{clip-path:inset(5% 0 90% 0);transform:translate(-2px,0);color:#f0f}
          60%{clip-path:inset(70% 0 10% 0);transform:translate(2px,0);color:#0ff}
        }
        .glitch::before, .glitch::after { content: attr(data-text); position: absolute; top:0; left:0; width:100%; }
        .glitch::before { animation: glitch-anim 4s infinite; color: #0ff; left: 2px; }
        .glitch::after  { animation: glitch-anim2 4s infinite 0.1s; color: #f0f; left: -2px; }
        .glitch:hover::before, .glitch:hover::after { animation-duration: 0.3s; }

        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .section-enter { animation: fadeSlideUp 0.5s ease forwards; }

        body::before {
          content:''; position:fixed; top:0;left:0;right:0;bottom:0; pointer-events:none; z-index:9999;
          background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px);
        }

        /* Desktop nav visible, mobile hidden by default */
        .desktop-nav { display: flex; }
        .mobile-menu-btn { display: none; }
        .mobile-nav { display: none; }

        @media (max-width: 600px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-nav { display: block !important; }
          .quick-cmds { display: flex !important; }
        }

        @media (min-width: 601px) {
          .quick-cmds { display: none !important; }
        }
      `}</style>

      <MatrixRain />
      <Nav active={section} onNav={setSection} />

      <main style={{ minHeight: "100vh", paddingTop: 70, paddingBottom: 40, position: "relative", zIndex: 1 }}>
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.7) 100%)", pointerEvents: "none", zIndex: 2 }} />

        <div key={section} className="section-enter" style={{ padding: "24px 16px", position: "relative", zIndex: 3 }}>
          {sections[section]}
        </div>

        {/* Vim-style status bar */}
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(0,20,0,0.95)", borderTop: "1px solid #001a00",
          padding: "4px 12px", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: "#003300", letterSpacing: 1 }}>
            INSERT — {section.toUpperCase()} — UTF-8
          </span>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: "#003300", letterSpacing: 1 }}>
            {new Date().toLocaleTimeString("en-US", { hour12: false })} {CONFIG.timezone} · {CONFIG.timezoneLabel}
          </span>
        </div>
      </main>
    </>
  );
}
