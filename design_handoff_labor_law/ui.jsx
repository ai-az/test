/* ============================================================
   UI LAYER — primitives, icons, nav, footer
   ============================================================ */
const { useState, useEffect, useRef, useCallback, createContext, useContext } = React;

/* ---------- persistent state ---------- */
function useLocal(key, initial) {
  const [v, setV] = useState(() => {
    try {const s = localStorage.getItem(key);return s !== null ? JSON.parse(s) : initial;}
    catch {return initial;}
  });
  useEffect(() => {try {localStorage.setItem(key, JSON.stringify(v));} catch {}}, [key, v]);
  return [v, setV];
}

/* ---------- icons (line, 24x24, currentColor) ---------- */
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
  sun2: <g {...P}><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2" /></g>,
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
  linkedin: <g {...P}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7 10.5V17M7 7v.02M11.5 17v-3.6a2 2 0 014 0V17M11.5 10.5V17" /></g>,
  tune: <g {...P}><path d="M4 7h10M18 7h2M4 17h6M14 17h6" /><circle cx="16" cy="7" r="2" /><circle cx="12" cy="17" r="2" /></g>,
  whatsapp: <g {...P}><path d="M4 20l1.3-4A8 8 0 117.9 18.6z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.6 0 1-.4 1-.9 0-.4-1.4-1.1-1.8-1.1-.6 0-.7.8-1.1.8-.8 0-2.3-1.5-2.3-2.3 0-.4.8-.5.8-1.1 0-.4-.7-1.8-1.1-1.8-.5 0-.9.4-.9 1z" /></g>
};
function Icon({ name, size = 22, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">{ICONS[name] || null}</svg>;
}
window.Icon = Icon;
window.useLocal = useLocal;

/* ---------- small primitives ---------- */
function Kicker({ children, style }) {
  return <div className="kicker" style={style}>{children}</div>;
}
function Hair({ style }) {return <hr className="hairline" style={style} />;}

function Badge({ children, tone = "amber", style }) {
  const tones = {
    amber: { color: "var(--amber)", bg: "var(--amber-tint)", bd: "color-mix(in srgb, var(--amber) 35%, transparent)" },
    accent: { color: "var(--accent)", bg: "var(--accent-tint)", bd: "color-mix(in srgb, var(--accent) 35%, transparent)" }
  }[tone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      font: "600 12px var(--text)", letterSpacing: ".04em",
      color: tones.color, background: tones.bg,
      border: `1px solid ${tones.bd}`, borderRadius: 999,
      padding: "5px 12px", ...style
    }}>{children}</span>);

}

/* ghost / solid buttons */
function Btn({ children, onClick, variant = "ghost", icon, size = "md", style, title, active }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 9, justifyContent: "center",
    fontFamily: "var(--text)", fontWeight: 600, borderRadius: 10,
    transition: "all .2s ease", whiteSpace: "nowrap", lineHeight: 1
  };
  const sizes = { sm: { fontSize: 13, padding: "8px 12px" }, md: { fontSize: 14.5, padding: "11px 18px" }, lg: { fontSize: 16, padding: "15px 26px" } };
  const variants = {
    solid: { background: "var(--accent)", color: "var(--paper)", border: "1px solid var(--accent)" },
    ghost: { background: active ? "var(--accent-tint)" : "transparent", color: active ? "var(--accent)" : "var(--ink)", border: "1px solid var(--hair)" },
    plain: { background: "transparent", color: "var(--ink-soft)", border: "1px solid transparent", padding: 8 }
  };
  return (
    <button title={title} onClick={onClick} style={{ ...base, ...sizes[size], ...variants[variant], ...style }}>
      {icon && <Icon name={icon} size={size === "sm" ? 17 : 19} />}
      {children}
    </button>);

}
window.Kicker = Kicker;window.Hair = Hair;window.Badge = Badge;window.Btn = Btn;

/* ---------- TOP BAR ---------- */
function TopBar({ go, route, lang, setLang, theme, setTheme, onSearch, onOpenCharacter, bookmarksCount }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", h);h();
    return () => window.removeEventListener("scroll", h);
  }, []);
  const T = lang === "ar" ?
  { browse: "الأبواب", index: "الفهرس", scenarios: "حسب الموقف", tools: "الحاسبات", timeline: "التعديلات", glossary: "المسرد", saved: "المحفوظة" } :
  { browse: "Chapters", index: "Index", scenarios: "By situation", tools: "Calculators", timeline: "Amendments", glossary: "Glossary", saved: "Saved" };
  const links = [
  ["browse", T.browse], ["index", T.index], ["scenarios", T.scenarios],
  ["calc", T.tools], ["timeline", T.timeline], ["glossary", T.glossary]];

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: scrolled ? "color-mix(in srgb, var(--paper) 88%, transparent)" : "transparent",
      backdropFilter: scrolled ? "saturate(1.2) blur(14px)" : "none",
      borderBottom: scrolled ? "1px solid var(--hair)" : "1px solid transparent",
      transition: "all .3s ease"
    }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", gap: 18, height: 70 }}>
        {/* logo */}
        <button onClick={() => go({ name: "home" })} style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", padding: 0 }}>
          <div style={{ width: 34, height: 34, display: "grid", placeItems: "center", border: "1.5px solid var(--ink)", borderRadius: 8 }}>
            <span className="display" style={{ fontSize: 18, fontWeight: 900, lineHeight: 1, marginTop: 2 }}>ع</span>
          </div>
          <div style={{ textAlign: lang === "ar" ? "right" : "left", lineHeight: 1.15 }}>
            <div className="display" style={{ fontSize: 16.5, fontWeight: 800 }}>{lang === "ar" ? "نظام العمل" : "Labor Law"}</div>
            <div style={{ fontSize: 10.5, color: "var(--ink-faint)", letterSpacing: ".08em" }}>{lang === "ar" ? "المرجع التفاعلي" : "Interactive Reference"}</div>
          </div>
        </button>

        {/* desktop nav */}
        <nav className="nav-desktop" style={{ display: "flex", gap: 4, marginInlineStart: 14 }}>
          {links.map(([key, label]) =>
          <button key={key} onClick={() => go({ name: key })} style={{
            background: "none", border: "none", padding: "8px 12px", borderRadius: 8,
            font: "600 14px var(--text)", color: route.name === key ? "var(--accent)" : "var(--ink-soft)",
            position: "relative"
          }}>{label}</button>
          )}
        </nav>

        <div style={{ flex: 1 }} />

        {/* actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button title={lang === "ar" ? "ضبط الطابع" : "Tune"} onClick={onOpenCharacter} className="char-btn">
            <Icon name="tune" size={17} />
            <span>{lang === "ar" ? "ضبط الطابع" : "Tune"}</span>
          </button>
          <button title="بحث" onClick={onSearch} className="act"><Icon name="search" size={20} /></button>
          <button title={lang === "ar" ? "حفظ" : "Saved"} onClick={() => go({ name: "saved" })} className="act" style={{ position: "relative" }}>
            <Icon name="bookmark" size={20} />
            {bookmarksCount > 0 && <span style={{ position: "absolute", top: 2, insetInlineEnd: 2, minWidth: 16, height: 16, padding: "0 4px", borderRadius: 8, background: "var(--accent)", color: "var(--paper)", font: "700 10px var(--text)", display: "grid", placeItems: "center" }}>{toAr(bookmarksCount)}</span>}
          </button>
          <button title="Language" onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="act" style={{ gap: 6, width: "auto", padding: "0 11px", display: "flex" }}>
            <Icon name="globe" size={19} /><span style={{ font: "700 12.5px var(--text)" }}>{lang === "ar" ? "EN" : "ع"}</span>
          </button>
          <button title="Theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="act"><Icon name={theme === "dark" ? "sun" : "moon"} size={20} /></button>
          <button className="act nav-mobile-btn" onClick={() => setMenuOpen(true)}><Icon name="menu" size={22} /></button>
        </div>
      </div>

      {/* mobile drawer */}
      {menuOpen &&
      <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,.4)" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", insetInlineStart: 0, top: 0, bottom: 0, width: "min(82vw, 340px)", background: "var(--paper)", borderInlineEnd: "1px solid var(--hair)", padding: 24, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <span className="display" style={{ fontSize: 18, fontWeight: 800 }}>{lang === "ar" ? "القائمة" : "Menu"}</span>
              <button className="act" onClick={() => setMenuOpen(false)}><Icon name="x" /></button>
            </div>
            {links.concat([["saved", T.saved]]).map(([key, label]) =>
          <button key={key} onClick={() => {go({ name: key });setMenuOpen(false);}} style={{ background: "none", border: "none", textAlign: lang === "ar" ? "right" : "left", padding: "14px 8px", font: "600 18px var(--text)", color: "var(--ink)", borderBottom: "1px solid var(--hair)" }}>{label}</button>
          )}
          <button onClick={() => {onOpenCharacter();setMenuOpen(false);}} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", textAlign: lang === "ar" ? "right" : "left", padding: "14px 8px", font: "600 18px var(--text)", color: "var(--accent)" }}>
            <Icon name="tune" size={20} />{lang === "ar" ? "ضبط الطابع" : "Tune the character"}
          </button>
          </div>
        </div>
      }
    </header>);

}
window.TopBar = TopBar;

/* ---------- FOOTER ---------- */
function Footer({ lang, go }) {
  return (
    <footer style={{ marginTop: 110, borderTop: "1px solid var(--hair)", background: "var(--paper-2)" }}>
      <div className="wrap" style={{ paddingBlock: 56 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ maxWidth: 460, height: "1px" }}>
            <div className="display" style={{ fontSize: 30, fontWeight: 800, marginBottom: 12 }}>{lang === "ar" ? "نظام العمل" : "Labor Law"}</div>
            <p style={{ color: "var(--ink-soft)", fontSize: 14.5, margin: 0, lineHeight: 1.85, height: "54px" }}>
              {lang === "ar" ?
              "مرجع تفاعلي يبسّط مــــواد نظام العمل السعودي عبر شرح ومثال عملي لكل مادة. متاح للجميع دون تسجيل." :
              "An interactive reference that simplifies the Saudi Labor Law with a plain explanation and a real example for every article."}
            </p>
          </div>
          <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
            <FootCol title={lang === "ar" ? "تصفّح" : "Browse"} items={[
            [lang === "ar" ? "الأبواب" : "Chapters", "browse"], [lang === "ar" ? "الفهرس" : "Index", "index"], [lang === "ar" ? "حسب الموقف" : "By situation", "scenarios"]]
            } go={go} />
            <FootCol title={lang === "ar" ? "أدوات" : "Tools"} items={[
            [lang === "ar" ? "الحاسبات" : "Calculators", "calc"], [lang === "ar" ? "التعديلات" : "Amendments", "timeline"], [lang === "ar" ? "المسرد" : "Glossary", "glossary"]]
            } go={go} />
          </div>
        </div>
        <hr className="hairline" style={{ margin: "40px 0 22px" }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center", fontSize: 12.5, color: "var(--ink-faint)" }}>
          <p style={{ margin: 0, maxWidth: 720, lineHeight: 1.7, fontWeight: "400" }}>
            {lang === "ar" ?
            "تنبيه قانوني: هذا الموقع لأغراض تعريفية وتثقيفية فقط ولا يُعدّ استشارة قانونية. النص الرسمي الساري هو المنشور في المصدر الرسمي. الشروح والأمثلة تبسيطية غير رسمية." :
            "Disclaimer: This site is for informational purposes only and is not legal advice. The official binding text is the one published by the official source."}
          </p>
          <span style={{ fontWeight: "300", fontSize: "12px" }}>© {toAr(1447)}هـ</span>
        </div>

        <div style={{ marginTop: 34, paddingTop: 26, borderTop: "1px solid var(--hair)", textAlign: "center", margin: "30px 0px 0px" }}>
          <div className="kicker" style={{ marginBottom: 8, fontWeight: "400", fontSize: "12px" }}>{lang === "ar" ? "صُنع بواسطة :" : "Designed & developed by"}</div>
          <div className="display" style={{ color: "var(--ink)", fontFamily: "\"Thmanyah Sans\"", fontWeight: "400", fontSize: "12px" }}>عبدالعزيز الدوسري</div>
          <div style={{ font: "500 11px var(--text)", letterSpacing: ".06em", marginTop: 1, color: "rgb(28, 27, 24)", height: "12px", fontWeight: "400", fontSize: "12px" }}>Abdulaziz Aldawsari</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginTop: 14, fontSize: "16px", fontWeight: "400" }}>
            <a className="social" href="https://abdulazizd.com" target="_blank" rel="noopener noreferrer" title="Abdulazizd.com" aria-label="Website">
              <span className="social-ico" dangerouslySetInnerHTML={{ __html: (window.BRAND_SVG || {}).website || "" }} />
            </a>
            <a className="social" href="https://www.linkedin.com/in/abdulaziiiz" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">
              <span className="social-ico" dangerouslySetInnerHTML={{ __html: (window.BRAND_SVG || {}).linkedin || "" }} />
            </a>
            <a className="social" href="https://wa.me/966567787030" target="_blank" rel="noopener noreferrer" title="WhatsApp" aria-label="WhatsApp">
              <span className="social-ico" dangerouslySetInnerHTML={{ __html: (window.BRAND_SVG || {}).whatsapp || "" }} />
            </a>
          </div>
        </div>
      </div>
    </footer>);

}
function FootCol({ title, items, go }) {
  return (
    <div>
      <div className="kicker" style={{ marginBottom: 14 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map(([label, key]) =>
        <button key={key} onClick={() => go({ name: key })} style={{ background: "none", border: "none", textAlign: "start", padding: 0, font: "500 14.5px var(--text)", color: "var(--ink-soft)" }}>{label}</button>
        )}
      </div>
    </div>);

}
window.Footer = Footer;

/* expose helpers to other babel scripts */
Object.assign(window, { Kicker, Hair, Badge, Btn, Icon, TopBar, Footer, useLocal });