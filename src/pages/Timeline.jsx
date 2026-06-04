// خط التعديلات — منقول عقدة-بعقدة من screens2.jsx
import { useI18n } from "../i18n/I18nContext.jsx";
import { useGo } from "../components/handoff/useGo.js";
import { PageHead, Badge } from "../components/handoff/primitives.jsx";
import { LABOR, toAr } from "../data/labor.js";

export default function Timeline() {
  const { lang } = useI18n();
  const go = useGo();
  return (
    <div className="wrap" style={{ paddingTop: 40, maxWidth: 820 }}>
      <PageHead kicker={lang === "ar" ? "تطوّر النظام" : "Evolution"} title={lang === "ar" ? "خط التعديلات" : "Amendments"}
        sub={lang === "ar" ? "رحلة النظام من صدوره عام ١٤٢٦هـ حتى أحدث تعديلاته. الأرقام والتواريخ تُراجَع من المصدر الرسمي." : "From 1426 AH to the latest amendment."} />
      <div style={{ position: "relative", paddingInlineStart: 30 }}>
        <div style={{ position: "absolute", insetInlineStart: 7, top: 8, bottom: 8, width: 2, background: "var(--hair)" }} />
        {LABOR.amendments.map((m, i) => (
          <div key={m.decree} style={{ position: "relative", paddingBottom: i === LABOR.amendments.length - 1 ? 0 : 34 }}>
            <div style={{ position: "absolute", insetInlineStart: -30, top: 6, width: 16, height: 16, borderRadius: 9, background: i === LABOR.amendments.length - 1 ? "var(--accent)" : "var(--paper)", border: `2px solid ${i === LABOR.amendments.length - 1 ? "var(--accent)" : "var(--hair-strong)"}` }} />
            <div style={{ background: "var(--card)", border: "1px solid var(--hair)", borderRadius: 14, padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                <span className="display num" style={{ fontSize: 26, fontWeight: 800, color: "var(--accent)" }}>{m.decree}</span>
                <span style={{ font: "600 14px var(--text)", color: "var(--ink-faint)" }}>{m.year}</span>
                <Badge tone={i === LABOR.amendments.length - 1 ? "accent" : "amber"} style={{ marginInlineStart: "auto" }}>{m.label}</Badge>
              </div>
              <p style={{ margin: "0 0 8px", lineHeight: 1.85 }}>{m.note}</p>
              <div style={{ font: "500 13px var(--text)", color: "var(--ink-faint)" }}>{lang === "ar" ? "المواد المتأثرة: " : "Articles: "}{m.articles}</div>
              {(() => {
                const yr = (m.year || "").replace("هـ", "");
                const arts = LABOR.articles.filter((x) => !x.status && x.amendedYear === yr);
                if (!arts.length) return null;
                return (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 12 }}>
                    {arts.map((x) => (
                      <button key={x.id} onClick={() => go({ name: "article", num: x.articleNumber })}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--paper-2)", border: "1px solid var(--hair-strong)", borderRadius: 9, padding: "6px 11px", font: "600 13px var(--text)", color: "var(--ink)", cursor: "pointer" }}>
                        <span style={{ color: "var(--accent)" }}>{lang === "ar" ? "م" : "Art."}</span><span className="num">{toAr(x.articleNumber)}</span>
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
