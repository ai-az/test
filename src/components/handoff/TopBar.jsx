import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Icon } from "./primitives.jsx";
import { useGo } from "./useGo.js";
import { useI18n } from "../../i18n/I18nContext.jsx";
import { useBookmarks } from "../../lib/storage.js";
import { toAr } from "../../data/labor.js";
import CharacterPanel from "../CharacterPanel.jsx";

const PATH_KEY = {
  "/chapters": "browse",
  "/index": "index",
  "/start": "scenarios",
  "/calculators": "calc",
  "/timeline": "timeline",
  "/glossary": "glossary",
  "/bookmarks": "saved",
};

export default function TopBar() {
  const go = useGo();
  const { lang, theme, toggleLang, toggleTheme } = useI18n();
  const { ids } = useBookmarks();
  const bookmarksCount = ids.length;
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [charOpen, setCharOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", h);
    h();
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => setMenuOpen(false), [pathname]);

  const activeKey =
    PATH_KEY[pathname] ||
    (pathname.startsWith("/calculators") ? "calc" : pathname.startsWith("/start") ? "scenarios" : "");

  const T = lang === "ar"
    ? { browse: "الأبواب", index: "الفهرس", scenarios: "حسب الموقف", tools: "الحاسبات", timeline: "التعديلات", glossary: "المسرد", saved: "المحفوظة" }
    : { browse: "Chapters", index: "Index", scenarios: "By situation", tools: "Calculators", timeline: "Amendments", glossary: "Glossary", saved: "Saved" };
  const links = [["browse", T.browse], ["index", T.index], ["scenarios", T.scenarios], ["calc", T.tools], ["timeline", T.timeline], ["glossary", T.glossary]];

  return (
    <header className="no-print" style={{
      position: "sticky", top: 0, zIndex: 50,
      background: scrolled ? "color-mix(in srgb, var(--paper) 88%, transparent)" : "transparent",
      backdropFilter: scrolled ? "saturate(1.2) blur(14px)" : "none",
      borderBottom: scrolled ? "1px solid var(--hair)" : "1px solid transparent",
      transition: "all .3s ease",
    }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", gap: 18, height: 70 }}>
        <button onClick={() => go({ name: "home" })} style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", padding: 0, cursor: "pointer" }}>
          <div style={{ width: 34, height: 34, display: "grid", placeItems: "center", border: "1.5px solid var(--ink)", borderRadius: 8 }}>
            <span className="display" style={{ fontSize: 18, fontWeight: 900, lineHeight: 1, marginTop: 2 }}>ع</span>
          </div>
          <div style={{ textAlign: lang === "ar" ? "right" : "left", lineHeight: 1.15 }}>
            <div className="display" style={{ fontSize: 16.5, fontWeight: 800 }}>{lang === "ar" ? "نظام العمل" : "Labor Law"}</div>
            <div style={{ fontSize: 10.5, color: "var(--ink-faint)", letterSpacing: ".08em" }}>{lang === "ar" ? "المرجع التفاعلي" : "Interactive Reference"}</div>
          </div>
        </button>

        <nav className="nav-desktop" style={{ display: "flex", gap: 4, marginInlineStart: 14 }}>
          {links.map(([key, label]) => (
            <button key={key} onClick={() => go({ name: key })} style={{
              background: "none", border: "none", padding: "8px 12px", borderRadius: 8, cursor: "pointer",
              font: "600 14px var(--text)", color: activeKey === key ? "var(--accent)" : "var(--ink-soft)", position: "relative",
            }}>{label}</button>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button title={lang === "ar" ? "ضبط الطابع" : "Tune"} onClick={() => setCharOpen(true)} className="char-btn">
            <Icon name="tune" size={17} />
            <span>{lang === "ar" ? "ضبط الطابع" : "Tune"}</span>
          </button>
          <button title="بحث" onClick={() => go({ name: "search" })} className="act"><Icon name="search" size={20} /></button>
          <button title={lang === "ar" ? "حفظ" : "Saved"} onClick={() => go({ name: "saved" })} className="act" style={{ position: "relative" }}>
            <Icon name="bookmark" size={20} />
            {bookmarksCount > 0 && <span style={{ position: "absolute", top: 2, insetInlineEnd: 2, minWidth: 16, height: 16, padding: "0 4px", borderRadius: 8, background: "var(--accent)", color: "var(--paper)", font: "700 10px var(--text)", display: "grid", placeItems: "center" }}>{toAr(bookmarksCount)}</span>}
          </button>
          <button title="Language" onClick={toggleLang} className="act" style={{ gap: 6, width: "auto", padding: "0 11px", display: "flex" }}>
            <Icon name="globe" size={19} /><span style={{ font: "700 12.5px var(--text)" }}>{lang === "ar" ? "EN" : "ع"}</span>
          </button>
          <button title="Theme" onClick={toggleTheme} className="act"><Icon name={theme === "dark" ? "sun" : "moon"} size={20} /></button>
          <button className="act nav-mobile-btn" onClick={() => setMenuOpen(true)}><Icon name="menu" size={22} /></button>
        </div>
      </div>

      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,.4)" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", insetInlineStart: 0, top: 0, bottom: 0, width: "min(82vw, 340px)", background: "var(--paper)", borderInlineEnd: "1px solid var(--hair)", padding: 24, display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <span className="display" style={{ fontSize: 18, fontWeight: 800 }}>{lang === "ar" ? "القائمة" : "Menu"}</span>
              <button className="act" onClick={() => setMenuOpen(false)}><Icon name="x" /></button>
            </div>
            {links.concat([["saved", T.saved]]).map(([key, label]) => (
              <button key={key} onClick={() => { go({ name: key }); setMenuOpen(false); }} style={{ background: "none", border: "none", textAlign: lang === "ar" ? "right" : "left", padding: "14px 8px", font: "600 18px var(--text)", color: "var(--ink)", borderBottom: "1px solid var(--hair)", cursor: "pointer" }}>{label}</button>
            ))}
            <button onClick={() => { setCharOpen(true); setMenuOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", textAlign: lang === "ar" ? "right" : "left", padding: "14px 8px", font: "600 18px var(--text)", color: "var(--accent)", cursor: "pointer" }}>
              <Icon name="tune" size={20} />{lang === "ar" ? "ضبط الطابع" : "Tune the character"}
            </button>
          </div>
        </div>
      )}

      {charOpen && <CharacterPanel onClose={() => setCharOpen(false)} />}
    </header>
  );
}
