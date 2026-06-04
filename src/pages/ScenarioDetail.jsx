// تفصيل الموقف — منقول عقدة-بعقدة من screens2.jsx
import { useParams } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { useGo } from "../components/handoff/useGo.js";
import { Icon, Kicker } from "../components/handoff/primitives.jsx";
import { LABOR, toAr } from "../data/labor.js";

export default function ScenarioDetail() {
  const { id } = useParams();
  const { lang } = useI18n();
  const go = useGo();
  const s = LABOR.scenarios.find((x) => x.id === id);
  if (!s) return null;
  const have = new Map(LABOR.articles.filter((a) => !a.status).map((a) => [a.articleNumber, a]));
  const calcArt = s.articles.map((n) => have.get(n)).find((a) => a && a.calculator);
  return (
    <div className="wrap" style={{ paddingTop: 38, maxWidth: 880 }}>
      <button onClick={() => go({ name: "scenarios" })} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "var(--ink-faint)", font: "500 13.5px var(--text)", padding: 0, marginBottom: 26, cursor: "pointer" }}>
        <Icon name={lang === "ar" ? "right" : "left"} size={16} />{lang === "ar" ? "كل المواقف" : "All situations"}
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 14 }}>
        <div style={{ width: 60, height: 60, borderRadius: 16, background: "var(--accent-tint)", display: "grid", placeItems: "center", color: "var(--accent)" }}><Icon name={s.icon} size={30} /></div>
        <h1 className="display" style={{ fontSize: "clamp(28px,4.5vw,46px)", fontWeight: 800, margin: 0 }}>{s.title}</h1>
      </div>
      <p style={{ color: "var(--ink-soft)", fontSize: 18, lineHeight: 1.8, maxWidth: 620 }}>{s.desc}</p>
      <hr className="hairline" style={{ marginBlock: 30 }} />
      <Kicker style={{ marginBottom: 16 }}>{lang === "ar" ? "المواد التي تهمّك" : "Relevant articles"}</Kicker>
      <div style={{ display: "grid", gap: 12 }}>
        {s.articles.map((n) => {
          const a = have.get(n);
          return (
            <button key={n} onClick={() => go({ name: "article", num: n })} style={{
              display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto", gap: 18, alignItems: "center", textAlign: "start",
              background: a ? "var(--card)" : "var(--paper-2)", border: "1px solid var(--hair)", borderRadius: 13, padding: "16px 20px", opacity: a ? 1 : .6, cursor: "pointer",
            }}>
              <span className="num" style={{ fontSize: 32, fontWeight: 800, color: "var(--accent)", minWidth: 52 }}>{toAr(n)}</span>
              <span style={{ font: "500 15px var(--text)", color: "var(--ink-soft)", lineHeight: 1.7 }}>{a ? a.simplifiedAr.slice(0, 80) + "…" : (lang === "ar" ? "قيد الإدخال" : "pending")}</span>
              {a && <Icon name={lang === "ar" ? "left" : "right"} size={20} style={{ color: "var(--ink-faint)" }} />}
            </button>
          );
        })}
      </div>
      {calcArt && (
        <button onClick={() => go({ name: "calc", tool: calcArt.calculator })} style={{ marginTop: 22, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--accent)", color: "var(--paper)", border: "none", borderRadius: 14, padding: "18px 24px", font: "700 16px var(--text)", cursor: "pointer" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><Icon name="calc" size={22} />{lang === "ar" ? "احسب تقديرك بالحاسبة المناسبة" : "Open the calculator"}</span>
          <Icon name={lang === "ar" ? "left" : "right"} size={22} />
        </button>
      )}
    </div>
  );
}
