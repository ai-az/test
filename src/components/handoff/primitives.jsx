// عناصر أساسية منقولة حرفياً من ui.jsx المرجعي (أيقونات خطّية + Btn/Badge/Kicker).
const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
const ICONS = {
  search: <g {...P}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></g>,
  sun: <g {...P}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></g>,
  moon: <g {...P}><path d="M20 14.5A8 8 0 119.5 4a6.5 6.5 0 0010.5 10.5z" /></g>,
  globe: <g {...P}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" /></g>,
  bookmark: <g {...P}><path d="M6 4h12v16l-6-4-6 4z" /></g>,
  bookmarkF: <g><path d="M6 4h12v16l-6-4-6 4z" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></g>,
  copy: <g {...P}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 012-2h8" /></g>,
  share: <g {...P}><circle cx="6" cy="12" r="2.4" /><circle cx="17" cy="6" r="2.4" /><circle cx="17" cy="18" r="2.4" /><path d="M8.2 11l6.6-3.6M8.2 13l6.6 3.6" /></g>,
  right: <g {...P}><path d="M14 6l-6 6 6 6" /></g>,
  left: <g {...P}><path d="M10 6l6 6-6 6" /></g>,
  gavel: <g {...P}><path d="M14 4l6 6-3 3-6-6zM11 7l-7 7 3 3 7-7M4 20h8" /></g>,
  exit: <g {...P}><path d="M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4M10 8l-4 4 4 4M6 12h11" /></g>,
  wallet: <g {...P}><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 10h18M17 14h.5" /></g>,
  shield: <g {...P}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M9 12l2 2 4-4" /></g>,
  clock: <g {...P}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></g>,
  calc: <g {...P}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 11h2M12 11h.5M15 11h1M8 15h2M12 15h.5M15 15h1" /></g>,
  book: <g {...P}><path d="M5 4h10a2 2 0 012 2v14H7a2 2 0 01-2-2z" /><path d="M17 4h2v16M9 8h5M9 11h5" /></g>,
  layers: <g {...P}><path d="M12 4l8 4-8 4-8-4zM4 12l8 4 8-4M4 16l8 4 8-4" /></g>,
  x: <g {...P}><path d="M6 6l12 12M18 6L6 18" /></g>,
  menu: <g {...P}><path d="M4 7h16M4 12h16M4 17h16" /></g>,
  check: <g {...P}><path d="M5 12l4 4 10-10" /></g>,
  arrow: <g {...P}><path d="M19 12H5M11 6l-6 6 6 6" /></g>,
  spark: <g {...P}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /></g>,
  doc: <g {...P}><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 13h6M10 17h6" /></g>,
  tune: <g {...P}><path d="M4 7h10M18 7h2M4 17h6M14 17h6" /><circle cx="16" cy="7" r="2" /><circle cx="12" cy="17" r="2" /></g>,
};

export function Icon({ name, size = 22, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      {ICONS[name] || null}
    </svg>
  );
}

export function Kicker({ children, style }) {
  return <div className="kicker" style={style}>{children}</div>;
}
export function Hair({ style }) {
  return <hr className="hairline" style={style} />;
}

export function Badge({ children, tone = "amber", style }) {
  const tones = {
    amber: { color: "var(--amber)", bg: "var(--amber-tint)", bd: "color-mix(in srgb, var(--amber) 35%, transparent)" },
    accent: { color: "var(--accent)", bg: "var(--accent-tint)", bd: "color-mix(in srgb, var(--accent) 35%, transparent)" },
  }[tone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      font: "600 12px var(--text)", letterSpacing: ".04em",
      color: tones.color, background: tones.bg,
      border: `1px solid ${tones.bd}`, borderRadius: 999,
      padding: "5px 12px", ...style,
    }}>{children}</span>
  );
}

export function Btn({ children, onClick, variant = "ghost", icon, size = "md", style, title, active }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 9, justifyContent: "center",
    fontFamily: "var(--text)", fontWeight: 600, borderRadius: 10,
    transition: "all .2s ease", whiteSpace: "nowrap", lineHeight: 1, cursor: "pointer",
  };
  const sizes = { sm: { fontSize: 13, padding: "8px 12px" }, md: { fontSize: 14.5, padding: "11px 18px" }, lg: { fontSize: 16, padding: "15px 26px" } };
  const variants = {
    solid: { background: "var(--accent)", color: "var(--paper)", border: "1px solid var(--accent)" },
    ghost: { background: active ? "var(--accent-tint)" : "transparent", color: active ? "var(--accent)" : "var(--ink)", border: "1px solid var(--hair)" },
    plain: { background: "transparent", color: "var(--ink-soft)", border: "1px solid transparent", padding: 8 },
  };
  return (
    <button title={title} onClick={onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {icon && <Icon name={icon} size={size === "sm" ? 17 : 19} />}
      {children}
    </button>
  );
}
