// حسب الموقف — منقول عقدة-بعقدة من screens2.jsx
import { useI18n } from "../i18n/I18nContext.jsx";
import { useGo } from "../components/handoff/useGo.js";
import { Icon, PageHead } from "../components/handoff/primitives.jsx";
import { LABOR, toAr } from "../data/labor.js";

export default function Scenarios() {
  const { lang } = useI18n();
  const go = useGo();
  return (
    <div className="wrap" style={{ paddingTop: 40 }}>
      <PageHead kicker={lang === "ar" ? "ابدأ من حالتك" : "Start here"} title={lang === "ar" ? "حسب الموقف" : "By situation"}
        sub={lang === "ar" ? "لا تبدأ من رقم الباب — ابدأ من موقفك، ودعنا نقودك إلى المواد والحاسبة المناسبة." : "Start from your situation, not a chapter number."} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {LABOR.scenarios.map((s) => (
          <button key={s.id} onClick={() => go({ name: "scenario", id: s.id })} style={{
            textAlign: "start", background: "var(--card)", border: "1px solid var(--hair-strong)", borderRadius: 16,
            padding: 26, display: "flex", flexDirection: "column", gap: 14, minHeight: 180, boxShadow: "var(--shadow)", cursor: "pointer",
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 13, background: "var(--accent-tint)", display: "grid", placeItems: "center", color: "var(--accent)" }}><Icon name={s.icon} size={24} /></div>
            <div className="display" style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{s.title}</div>
            <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: 14.5, lineHeight: 1.8 }}>{s.desc}</p>
            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 8, color: "var(--accent)", font: "600 13.5px var(--text)" }}>
              {lang === "ar" ? `${toAr(s.articles.length)} مواد مرتبطة` : `${s.articles.length} articles`}<Icon name={lang === "ar" ? "left" : "right"} size={16} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
