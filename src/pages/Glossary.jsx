// المسرد — منقول عقدة-بعقدة من screens2.jsx
import { useI18n } from "../i18n/I18nContext.jsx";
import { PageHead } from "../components/handoff/primitives.jsx";
import { LABOR } from "../data/labor.js";

export default function Glossary() {
  const { lang } = useI18n();
  return (
    <div className="wrap" style={{ paddingTop: 40, maxWidth: 880 }}>
      <PageHead kicker={lang === "ar" ? "الباب الأول" : "Chapter 1"} title={lang === "ar" ? "مسرد المصطلحات" : "Glossary"}
        sub={lang === "ar" ? "تعريفات النظام الأساسية. تظهر هذه التعريفات أيضاً كتلميحات داخل نصوص المواد." : "Core definitions, also shown as tooltips inside articles."} />
      <div style={{ borderTop: "1px solid var(--hair)" }}>
        {LABOR.glossary.map((g) => (
          <div key={g.term} style={{ display: "grid", gridTemplateColumns: "minmax(120px,200px) 1fr", gap: "clamp(16px,4vw,40px)", padding: "26px 6px", borderBottom: "1px solid var(--hair)", alignItems: "baseline" }}>
            <div className="display" style={{ fontSize: "clamp(20px,2.6vw,26px)", fontWeight: 800, color: "var(--accent)" }}>{g.term}</div>
            <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.9, color: "var(--ink-soft)" }}>{g.def}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
