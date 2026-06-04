// الأبواب (Browse) — منقول عقدة-بعقدة من screens2.jsx
import { useI18n } from "../i18n/I18nContext.jsx";
import { useGo } from "../components/handoff/useGo.js";
import { Icon, PageHead } from "../components/handoff/primitives.jsx";
import { LABOR, toAr } from "../data/labor.js";

export default function Chapters() {
  const { lang } = useI18n();
  const go = useGo();
  return (
    <div className="wrap" style={{ paddingTop: 40 }}>
      <PageHead kicker={lang === "ar" ? "تصفّح" : "Browse"} title={lang === "ar" ? "الأبواب" : "Chapters"}
        sub={lang === "ar" ? "النظام موزّع على ١٦ باباً و٢٤٥ مادة. اختر باباً لعرض فصوله ومواده." : "16 chapters, 245 articles."} />
      <div style={{ borderTop: "1px solid var(--hair)" }}>
        {LABOR.chapters.map((c) => (
          <button key={c.n} onClick={() => go({ name: "chapter", n: c.n })} className="row-cell" style={{
            width: "100%", display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto", gap: "clamp(16px,3vw,36px)",
            alignItems: "center", textAlign: "start", background: "transparent", border: "none",
            borderBottom: "1px solid var(--hair)", padding: "26px 8px", cursor: "pointer",
          }}>
            <div className="num" style={{ fontSize: "clamp(40px,6vw,68px)", fontWeight: 800, color: "var(--accent)", lineHeight: .9, minWidth: 90 }}>{toAr(c.n).padStart(2, "٠")}</div>
            <div>
              <div className="display" style={{ fontSize: "clamp(18px,2.4vw,24px)", fontWeight: 700, marginBottom: 4 }}>{lang === "ar" ? c.title : c.en}</div>
              <div style={{ font: "500 13.5px var(--text)", color: "var(--ink-faint)" }}>{lang === "ar" ? `${toAr(c.count)} مادة · المواد ${toAr(c.from)}–${toAr(c.to)}` : `${c.count} articles · ${c.from}–${c.to}`}</div>
            </div>
            <Icon name={lang === "ar" ? "left" : "right"} size={26} style={{ color: "var(--ink-faint)" }} />
          </button>
        ))}
      </div>
    </div>
  );
}
