// الفهرس — منقول عقدة-بعقدة من screens2.jsx (IndexView)
import { useState } from "react";
import { useI18n } from "../i18n/I18nContext.jsx";
import { useGo } from "../components/handoff/useGo.js";
import { Icon, PageHead, FilterChip } from "../components/handoff/primitives.jsx";
import { LABOR, toAr, isRecentlyAmended } from "../data/labor.js";

export default function IndexMap() {
  const { lang } = useI18n();
  const go = useGo();
  const [chap, setChap] = useState(0);
  const ready = LABOR.articles.filter((a) => !a.status).slice().sort((a, b) => a.order - b.order);
  const shown = chap ? ready.filter((a) => a.chapter.number === chap) : ready;
  return (
    <div className="wrap" style={{ paddingTop: 40 }}>
      <PageHead kicker={lang === "ar" ? "خريطة" : "Map"} title={lang === "ar" ? "الفهرس" : "Index"}
        sub={lang === "ar" ? "عرض شامل لكل مادة مُدخلة، قابل للتصفية حسب الباب." : "Every entered article, filterable by chapter."} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 26 }}>
        <FilterChip active={chap === 0} onClick={() => setChap(0)} label={lang === "ar" ? "الكل" : "All"} />
        {LABOR.chapters.filter((c) => ready.some((a) => a.chapter.number === c.n)).map((c) => (
          <FilterChip key={c.n} active={chap === c.n} onClick={() => setChap(c.n)} label={lang === "ar" ? `${toAr(c.n)}· ${c.title}` : c.en} />
        ))}
      </div>
      <div style={{ borderTop: "1px solid var(--hair)" }}>
        {shown.map((a) => (
          <button key={a.id} onClick={() => go({ name: "article", num: a.articleNumber })} className="row-cell" style={{
            width: "100%", display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto", gap: 22, alignItems: "center",
            textAlign: "start", background: "transparent", border: "none", borderBottom: "1px solid var(--hair)", padding: "20px 6px", cursor: "pointer",
          }}>
            <div className="num" style={{ fontSize: 36, fontWeight: 800, color: "var(--accent)", minWidth: 64 }}>{toAr(a.articleNumber)}</div>
            <div>
              <div style={{ font: "600 16px var(--text)", marginBottom: 2 }}>{a.simplifiedAr.split("،")[0].split(".")[0].slice(0, 64)}…</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", font: "500 12.5px var(--text)", color: "var(--ink-faint)" }}>
                <span>{lang === "ar" ? `الباب ${toAr(a.chapter.number)}` : `Ch.${a.chapter.number}`}</span>
                {a.isAmended && <span style={{ color: "var(--amber)" }}>· {lang === "ar" ? "مُعدَّلة" : "amended"}</span>}
                {isRecentlyAmended(a) && <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--accent)", fontWeight: 600 }}>· <span className="live-dot" style={{ width: 6, height: 6 }} />{lang === "ar" ? "آخر التحديثات" : "latest"}</span>}
                {a.calculator && <span style={{ color: "var(--accent)" }}>· {lang === "ar" ? "حاسبة" : "calc"}</span>}
              </div>
            </div>
            <Icon name={lang === "ar" ? "left" : "right"} size={20} style={{ color: "var(--ink-faint)" }} />
          </button>
        ))}
      </div>
    </div>
  );
}
