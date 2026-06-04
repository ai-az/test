// الغلاف — منقول عقدة-بعقدة من screens1.jsx (Cover) المرجعي.
import { useI18n } from "../i18n/I18nContext.jsx";
import { useGo } from "../components/handoff/useGo.js";
import { Icon, Kicker, Badge, Btn } from "../components/handoff/primitives.jsx";
import { LABOR, toAr, findArticle } from "../data/labor.js";

export default function Home() {
  const { lang } = useI18n();
  const go = useGo();
  const meta = LABOR.meta;
  const featured = findArticle(84);
  return (
    <div>
      {/* masthead */}
      <section className="wrap" style={{ paddingTop: "clamp(40px,7vw,90px)", paddingBottom: "clamp(40px,6vw,70px)" }}>
        <div className="reveal" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 30 }}>
          <Kicker>{lang === "ar" ? "المرجع التفاعلي" : "Interactive reference"}</Kicker>
          <div style={{ flex: 1, height: 1, background: "var(--hair)" }} />
          <span style={{ font: "500 12px var(--text)", color: "var(--ink-faint)", letterSpacing: ".1em" }}>{meta.decree}</span>
        </div>

        <h1 className="display kashida reveal" style={{ fontSize: "var(--t-4xl)", fontWeight: 900, margin: "0 0 8px", letterSpacing: "-.02em" }}>
          {lang === "ar" ? "نظامُ العمل" : "Saudi Labor Law"}
        </h1>
        <p className="reveal" style={{ fontSize: "clamp(18px,2.4vw,26px)", color: "var(--ink-soft)", maxWidth: 760, margin: "0 0 44px", lineHeight: 1.7, animationDelay: ".05s", fontWeight: "300" }}>
          {lang === "ar"
            ? "كل مادة، مشروحـــــةٌ ببساطـــة ومُسندةٌ بمثالٍ عملي. مرجــــعٌ يفهمــه غير المتخصّص."
            : "Every article, explained simply and grounded in a real example — a reference anyone can understand."}
        </p>

        {/* search */}
        <button onClick={() => go({ name: "search" })} className="reveal" style={{
          display: "flex", alignItems: "center", gap: 14, width: "100%", maxWidth: 640,
          background: "var(--card)", border: "1px solid var(--hair-strong)", borderRadius: 14,
          padding: "17px 22px", boxShadow: "var(--shadow)", animationDelay: ".1s", cursor: "pointer",
        }}>
          <Icon name="search" size={22} style={{ color: "var(--ink-faint)" }} />
          <span style={{ font: "500 16.5px var(--text)", color: "var(--ink-faint)" }}>
            {lang === "ar" ? "ابحث برقم المادة، أو بكلمة مثل «مكافأة»، «إجازة»…" : "Search by article number or keyword…"}
          </span>
        </button>

        {/* scenario chips */}
        <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22, animationDelay: ".15s" }}>
          <span style={{ font: "600 13px var(--text)", color: "var(--ink-faint)", alignSelf: "center" }}>{lang === "ar" ? "أو ابدأ من موقفك:" : "Or start from your situation:"}</span>
          {LABOR.scenarios.slice(0, 4).map((s) => (
            <button key={s.id} onClick={() => go({ name: "scenario", id: s.id })} style={{
              display: "inline-flex", alignItems: "center", gap: 8, background: "transparent",
              border: "1px solid var(--hair-strong)", borderRadius: 999, padding: "8px 15px",
              font: "600 13.5px var(--text)", color: "var(--ink)", cursor: "pointer",
            }}><Icon name={s.icon} size={16} style={{ color: "var(--accent)" }} />{s.title}</button>
          ))}
        </div>
      </section>

      {/* stat band */}
      <section style={{ borderBlock: "1px solid var(--hair)", background: "var(--paper-2)" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))" }}>
          {[
            [meta.chapters, lang === "ar" ? "باباً" : "Chapters"],
            [meta.articles, lang === "ar" ? "مادة" : "Articles"],
            [5, lang === "ar" ? "تعديلات" : "Amendments"],
            [3, lang === "ar" ? "حاسبات" : "Calculators"],
          ].map(([num, label], i) => (
            <div key={i} style={{ padding: "38px 10px", textAlign: "center", borderInlineStart: i === 0 ? "none" : "1px solid var(--hair)" }}>
              <div className="num" style={{ fontSize: "clamp(54px,8vw,84px)", fontWeight: 800, color: "var(--ink)" }}>{toAr(num)}</div>
              <div style={{ font: "600 13px var(--text)", letterSpacing: ".14em", color: "var(--ink-faint)", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* chapters preview */}
      <section className="wrap" style={{ paddingTop: 70 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <h2 className="display" style={{ fontSize: "var(--t-xl)", fontWeight: 800, margin: 0 }}>{lang === "ar" ? "الأبواب الستة عشر" : "The Sixteen Chapters"}</h2>
          <Btn variant="plain" icon={lang === "ar" ? "left" : "right"} onClick={() => go({ name: "browse" })} style={{ color: "var(--accent)" }}>{lang === "ar" ? "تصفّح الكل" : "Browse all"}</Btn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 0, borderTop: "1px solid var(--hair)", borderInlineStart: "1px solid var(--hair)" }}>
          {LABOR.chapters.map((c) => (
            <button key={c.n} onClick={() => go({ name: "chapter", n: c.n })} className="chap-cell" style={{
              textAlign: "start", background: "transparent", border: "none",
              borderBottom: "1px solid var(--hair)", borderInlineEnd: "1px solid var(--hair)",
              padding: "22px 20px", display: "flex", flexDirection: "column", gap: 8, minHeight: 140, cursor: "pointer",
            }}>
              <div className="num" style={{ fontSize: 40, fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>{toAr(c.n).padStart(2, "٠")}</div>
              <div className="display" style={{ fontSize: 16.5, fontWeight: 700, lineHeight: 1.4, marginTop: "auto" }}>{lang === "ar" ? c.title : c.en}</div>
              <div style={{ font: "500 12px var(--text)", color: "var(--ink-faint)" }}>{lang === "ar" ? `${toAr(c.count)} مادة · ${toAr(c.from)}–${toAr(c.to)}` : `${c.count} articles`}</div>
            </button>
          ))}
        </div>
      </section>

      {/* featured article specimen */}
      {featured && (
        <section className="wrap" style={{ paddingTop: 80 }}>
          <Kicker style={{ marginBottom: 20 }}>{lang === "ar" ? "نموذج صفحة المادة" : "Sample article"}</Kicker>
          <button onClick={() => go({ name: "article", num: 84 })} style={{
            width: "100%", textAlign: "start", background: "var(--card)", border: "1px solid var(--hair-strong)",
            borderRadius: 18, padding: "clamp(26px,4vw,48px)", display: "grid",
            gridTemplateColumns: "minmax(0,1fr) auto", gap: 30, alignItems: "center", boxShadow: "var(--shadow)", cursor: "pointer",
          }}>
            <div>
              <Badge tone="accent" style={{ marginBottom: 16 }}><Icon name="spark" size={14} />{lang === "ar" ? "حاسبة مرتبطة" : "Has calculator"}</Badge>
              <div className="display" style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, marginBottom: 12, lineHeight: 1.4 }}>{lang === "ar" ? "مكافأة نهاية الخدمة" : "End-of-service award"}</div>
              <p style={{ color: "var(--ink-soft)", margin: 0, maxWidth: 540, lineHeight: 1.85 }}>{featured.simplifiedAr}</p>
            </div>
            <div style={{ textAlign: "center", paddingInline: "clamp(0px,3vw,30px)" }}>
              <div style={{ font: "600 12px var(--text)", letterSpacing: ".18em", color: "var(--ink-faint)" }}>{lang === "ar" ? "المادة" : "ARTICLE"}</div>
              <div className="num" style={{ fontSize: "clamp(90px,16vw,150px)", fontWeight: 800, color: "var(--accent)" }}>{toAr(84)}</div>
            </div>
          </button>
        </section>
      )}
    </div>
  );
}
