// تفصيل الباب — منقول عقدة-بعقدة من screens2.jsx
import { useParams } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { useGo } from "../components/handoff/useGo.js";
import { Icon, Kicker } from "../components/handoff/primitives.jsx";
import { LABOR, toAr } from "../data/labor.js";

export default function ChapterDetail() {
  const { num } = useParams();
  const n = Number(num);
  const { lang } = useI18n();
  const go = useGo();
  const c = LABOR.chapters.find((x) => x.n === n);
  if (!c) return null;
  const nums = [];
  for (let i = c.from; i <= c.to; i++) nums.push(i);
  const have = new Set(LABOR.articles.filter((a) => !a.status).map((a) => a.articleNumber));
  return (
    <div className="wrap" style={{ paddingTop: 38 }}>
      <button onClick={() => go({ name: "browse" })} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "var(--ink-faint)", font: "500 13.5px var(--text)", padding: 0, marginBottom: 26, cursor: "pointer" }}>
        <Icon name={lang === "ar" ? "right" : "left"} size={16} />{lang === "ar" ? "كل الأبواب" : "All chapters"}
      </button>
      <div style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: "clamp(20px,4vw,44px)", alignItems: "center", marginBottom: 16 }}>
        <div className="num" style={{ fontSize: "var(--t-mega)", fontWeight: 800, color: "var(--accent)", lineHeight: .85 }}>{toAr(n).padStart(2, "٠")}</div>
        <div>
          <Kicker style={{ marginBottom: 8 }}>{lang === "ar" ? `الباب ${toAr(n)}` : `Chapter ${n}`}</Kicker>
          <h1 className="display" style={{ fontSize: "clamp(26px,4vw,46px)", fontWeight: 800, margin: 0, lineHeight: 1.2 }}>{lang === "ar" ? c.title : c.en}</h1>
          <p style={{ color: "var(--ink-faint)", marginTop: 8, font: "500 14px var(--text)" }}>{lang === "ar" ? `المواد ${toAr(c.from)} – ${toAr(c.to)}` : `Articles ${c.from}–${c.to}`}</p>
        </div>
      </div>
      <hr className="hairline" style={{ marginBlock: 30 }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(96px,1fr))", gap: 12 }}>
        {nums.map((i) => {
          const ready = have.has(i);
          return (
            <button key={i} onClick={() => go({ name: "article", num: i })} title={ready ? "" : (lang === "ar" ? "قيد الإدخال" : "pending")} style={{
              aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
              background: ready ? "var(--card)" : "transparent", border: `1px solid ${ready ? "var(--hair-strong)" : "var(--hair)"}`,
              borderRadius: 12, color: ready ? "var(--ink)" : "var(--ink-faint)", opacity: ready ? 1 : .55, cursor: "pointer",
            }}>
              <span className="num" style={{ fontSize: 26, fontWeight: 800, color: ready ? "var(--accent)" : "var(--ink-faint)" }}>{toAr(i)}</span>
              {ready && <span style={{ width: 5, height: 5, borderRadius: 9, background: "var(--accent)" }} />}
            </button>
          );
        })}
      </div>
      <p style={{ color: "var(--ink-faint)", fontSize: 13, marginTop: 22, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 7, height: 7, borderRadius: 9, background: "var(--accent)", display: "inline-block" }} />
        {lang === "ar" ? "المواد المميّزة بنقطة جاهزة للقراءة، والبقية قيد الإدخال." : "Dotted articles are ready; others are pending."}
      </p>
    </div>
  );
}
