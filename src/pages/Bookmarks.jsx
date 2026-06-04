// المحفوظة — منقول عقدة-بعقدة من screens2.jsx (مربوط بتخزيننا المحلي)
import { useI18n } from "../i18n/I18nContext.jsx";
import { useGo } from "../components/handoff/useGo.js";
import { Icon, PageHead, Btn } from "../components/handoff/primitives.jsx";
import { findArticle, toAr } from "../data/labor.js";
import { useBookmarks } from "../lib/storage.js";

export default function Bookmarks() {
  const { lang } = useI18n();
  const go = useGo();
  const { ids, toggle } = useBookmarks();
  const items = ids.map((id) => findArticle(id)).filter((a) => a && !a.status);
  return (
    <div className="wrap" style={{ paddingTop: 40, maxWidth: 880 }}>
      <PageHead kicker={lang === "ar" ? "محلي على جهازك" : "Local"} title={lang === "ar" ? "المواد المحفوظة" : "Saved articles"}
        sub={lang === "ar" ? "تُحفظ محلياً في متصفّحك فقط، دون أي تسجيل." : "Stored locally in your browser only."} />
      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "70px 20px", border: "1px dashed var(--hair-strong)", borderRadius: 16 }}>
          <Icon name="bookmark" size={40} style={{ color: "var(--ink-faint)" }} />
          <p style={{ color: "var(--ink-soft)", marginTop: 14 }}>{lang === "ar" ? "لا توجد مواد محفوظة بعد. استخدم زر «حفظ» في صفحة أي مادة." : "No saved articles yet."}</p>
          <Btn variant="ghost" onClick={() => go({ name: "browse" })} icon={lang === "ar" ? "left" : "right"} style={{ marginTop: 8 }}>{lang === "ar" ? "تصفّح الأبواب" : "Browse"}</Btn>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((a) => (
            <div key={a.id} style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto", gap: 18, alignItems: "center", background: "var(--card)", border: "1px solid var(--hair)", borderRadius: 13, padding: "16px 20px" }}>
              <button onClick={() => go({ name: "article", num: a.articleNumber })} style={{ background: "none", border: "none", cursor: "pointer" }}><span className="num" style={{ fontSize: 34, fontWeight: 800, color: "var(--accent)" }}>{toAr(a.articleNumber)}</span></button>
              <button onClick={() => go({ name: "article", num: a.articleNumber })} style={{ background: "none", border: "none", textAlign: "start", cursor: "pointer" }}><span style={{ font: "500 15px var(--text)", color: "var(--ink-soft)", lineHeight: 1.7 }}>{a.simplifiedAr.slice(0, 80)}…</span></button>
              <button onClick={() => toggle(a.id)} className="act" title={lang === "ar" ? "إزالة" : "Remove"}><Icon name="x" size={18} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
