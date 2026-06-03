/* ============================================================
   SCREENS · part 1 — Cover & Article view (the heroes)
   ============================================================ */
const { useState, useEffect, useRef } = React;

/* render body text with inline glossary tooltips */
function GlossText({ text, lang }) {
  if (lang !== "ar") return <>{text}</>;
  const terms = LABOR.glossary;
  // build a regex of terms, longest first
  const sorted = [...terms].sort((a, b) => b.term.length - a.term.length);
  const parts = [];
  let rest = text,key = 0,guard = 0;
  outer:
  while (rest.length && guard++ < 400) {
    let best = -1,bestT = null;
    for (const t of sorted) {
      const i = rest.indexOf(t.term);
      if (i !== -1 && (best === -1 || i < best)) {best = i;bestT = t;}
    }
    if (best === -1) {parts.push(rest);break;}
    if (best > 0) parts.push(rest.slice(0, best));
    parts.push(
      <span key={"g" + key++} className="gloss" tabIndex={0}>
        {bestT.term}
        <span className="gloss-pop">{bestT.def}</span>
      </span>
    );
    rest = rest.slice(best + bestT.term.length);
  }
  return <>{parts}</>;
}
window.GlossText = GlossText;

/* ---------------- COVER ---------------- */
function Cover({ go, lang }) {
  const meta = LABOR.meta;
  const featured = LABOR.articles.find((a) => a.articleNumber === 84);
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
          {lang === "ar" ?
          "كل مادة، مشروحـــــةٌ ببساطـــة ومُسندةٌ بمثالٍ عملي. مرجــــعٌ يفهمــه غير المتخصّص." :
          "Every article, explained simply and grounded in a real example — a reference anyone can understand."}
        </p>

        {/* search */}
        <button onClick={() => go({ name: "search" })} className="reveal" style={{
          display: "flex", alignItems: "center", gap: 14, width: "100%", maxWidth: 640,
          background: "var(--card)", border: "1px solid var(--hair-strong)", borderRadius: 14,
          padding: "17px 22px", boxShadow: "var(--shadow)", animationDelay: ".1s"
        }}>
          <Icon name="search" size={22} style={{ color: "var(--ink-faint)" }} />
          <span style={{ font: "500 16.5px var(--text)", color: "var(--ink-faint)" }}>
            {lang === "ar" ? "ابحث برقم المادة، أو بكلمة مثل «مكافأة»، «إجازة»…" : "Search by article number or keyword…"}
          </span>
        </button>

        {/* scenario chips */}
        <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22, animationDelay: ".15s" }}>
          <span style={{ font: "600 13px var(--text)", color: "var(--ink-faint)", alignSelf: "center" }}>{lang === "ar" ? "أو ابدأ من موقفك:" : "Or start from your situation:"}</span>
          {LABOR.scenarios.slice(0, 4).map((s) =>
          <button key={s.id} onClick={() => go({ name: "scenario", id: s.id })} style={{
            display: "inline-flex", alignItems: "center", gap: 8, background: "transparent",
            border: "1px solid var(--hair-strong)", borderRadius: 999, padding: "8px 15px",
            font: "600 13.5px var(--text)", color: "var(--ink)"
          }}><Icon name={s.icon} size={16} style={{ color: "var(--accent)" }} />{s.title}</button>
          )}
        </div>
      </section>

      {/* stat band */}
      <section style={{ borderBlock: "1px solid var(--hair)", background: "var(--paper-2)" }}>
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))" }}>
          {[
          [meta.chapters, lang === "ar" ? "باباً" : "Chapters"],
          [meta.articles, lang === "ar" ? "مادة" : "Articles"],
          [5, lang === "ar" ? "تعديلات" : "Amendments"],
          [3, lang === "ar" ? "حاسبات" : "Calculators"]].
          map(([num, label], i) =>
          <div key={i} style={{ padding: "38px 10px", textAlign: "center", borderInlineStart: i === 0 ? "none" : "1px solid var(--hair)" }}>
              <div className="num" style={{ fontSize: "clamp(54px,8vw,84px)", fontWeight: 800, color: "var(--ink)" }}>{toAr(num)}</div>
              <div style={{ font: "600 13px var(--text)", letterSpacing: ".14em", color: "var(--ink-faint)", marginTop: 4 }}>{label}</div>
            </div>
          )}
        </div>
      </section>

      {/* chapters preview */}
      <section className="wrap" style={{ paddingTop: 70 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <h2 className="display" style={{ fontSize: "var(--t-xl)", fontWeight: 800, margin: 0 }}>{lang === "ar" ? "الأبواب الستة عشر" : "The Sixteen Chapters"}</h2>
          <Btn variant="plain" icon={lang === "ar" ? "left" : "right"} onClick={() => go({ name: "browse" })} style={{ color: "var(--accent)" }}>{lang === "ar" ? "تصفّح الكل" : "Browse all"}</Btn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 0, borderTop: "1px solid var(--hair)", borderInlineStart: "1px solid var(--hair)" }}>
          {LABOR.chapters.map((c) =>
          <button key={c.n} onClick={() => go({ name: "chapter", n: c.n })} className="chap-cell" style={{
            textAlign: "start", background: "transparent", border: "none",
            borderBottom: "1px solid var(--hair)", borderInlineEnd: "1px solid var(--hair)",
            padding: "22px 20px", display: "flex", flexDirection: "column", gap: 8, minHeight: 140
          }}>
              <div className="num" style={{ fontSize: 40, fontWeight: 800, color: "var(--accent)", lineHeight: 1 }}>{toAr(c.n).padStart(2, "٠")}</div>
              <div className="display" style={{ fontSize: 16.5, fontWeight: 700, lineHeight: 1.4, marginTop: "auto" }}>{lang === "ar" ? c.title : c.en}</div>
              <div style={{ font: "500 12px var(--text)", color: "var(--ink-faint)" }}>{lang === "ar" ? `${toAr(c.count)} مادة · ${toAr(c.from)}–${toAr(c.to)}` : `${c.count} articles`}</div>
            </button>
          )}
        </div>
      </section>

      {/* featured article specimen */}
      {featured &&
      <section className="wrap" style={{ paddingTop: 80 }}>
          <Kicker style={{ marginBottom: 20 }}>{lang === "ar" ? "نموذج صفحة المادة" : "Sample article"}</Kicker>
          <button onClick={() => go({ name: "article", num: 84 })} style={{
          width: "100%", textAlign: "start", background: "var(--card)", border: "1px solid var(--hair-strong)",
          borderRadius: 18, padding: "clamp(26px,4vw,48px)", display: "grid",
          gridTemplateColumns: "minmax(0,1fr) auto", gap: 30, alignItems: "center", boxShadow: "var(--shadow)"
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
      }
    </div>);

}
window.Cover = Cover;

/* ---------------- ARTICLE VIEW ---------------- */
function ArticleView({ num, go, lang, bookmarks, toggleBookmark }) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [copied, setCopied] = useState(false);
  const a = LABOR.articles.find((x) => x.articleNumber === num);
  useEffect(() => {window.scrollTo({ top: 0 });setShowOriginal(false);}, [num]);

  // prev / next among known + chapter neighbours
  const all = LABOR.articles.filter((x) => !x.status).map((x) => x.articleNumber).sort((p, q) => p - q);
  const idx = all.indexOf(num);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  if (!a || a.status === "pending") {
    return (
      <div className="wrap" style={{ paddingTop: 90, minHeight: "60vh" }}>
        <div className="num display" style={{ fontSize: "var(--t-mega)", color: "var(--hair-strong)", fontWeight: 800 }}>{toAr(num)}</div>
        <h1 className="display" style={{ fontSize: "var(--t-xl)", marginTop: 10 }}>{lang === "ar" ? "هذه المادة قيد الإدخال" : "Article pending"}</h1>
        <p style={{ color: "var(--ink-soft)", maxWidth: 480 }}>{lang === "ar" ? "لم يُدخَل بعد النص الرسمي لهذه المادة. سيظهر هنا فور إضافته من المصدر الرسمي." : "The official text for this article has not been entered yet."}</p>
        <Btn variant="ghost" icon={lang === "ar" ? "right" : "left"} onClick={() => go({ name: "browse" })} style={{ marginTop: 18 }}>{lang === "ar" ? "العودة للأبواب" : "Back to chapters"}</Btn>
      </div>);

  }

  const saved = bookmarks.includes(num);
  const copyLink = () => {
    try {navigator.clipboard.writeText(`${location.origin}${location.pathname}#/article/${num}`);} catch {}
    setCopied(true);setTimeout(() => setCopied(false), 1600);
  };

  return (
    <article className="wrap" style={{ paddingTop: 34, maxWidth: 980 }}>
      {/* breadcrumb */}
      <nav style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", font: "500 13.5px var(--text)", color: "var(--ink-faint)", marginBottom: 30 }}>
        <button onClick={() => go({ name: "chapter", n: a.chapter.number })} style={{ background: "none", border: "none", color: "var(--ink-soft)", padding: 0, font: "inherit" }}>{lang === "ar" ? `الباب ${toAr(a.chapter.number)} · ${a.chapter.title}` : `Chapter ${a.chapter.number}`}</button>
        <Icon name={lang === "ar" ? "left" : "right"} size={14} />
        <span>{a.section ? a.section.title : ""}</span>
      </nav>

      {/* hero number row */}
      <header style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: "clamp(20px,4vw,48px)", alignItems: "center", marginBottom: 30 }}>
        <div style={{ lineHeight: 1 }}>
          <div style={{ font: "600 13px var(--text)", letterSpacing: ".2em", color: "var(--ink-faint)", marginBottom: 4 }}>{lang === "ar" ? "المادة" : "ARTICLE"}</div>
          <div className="num" style={{ fontSize: "var(--t-mega)", fontWeight: 800, color: "var(--accent)", letterSpacing: "-.02em" }}>{toAr(num)}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {a.isAmended && <Badge tone="amber"><Icon name="spark" size={14} />{lang === "ar" ? "مادة مُعدَّلة" : "Amended"}</Badge>}
            {window.isRecentlyAmended(a) && (
              <button onClick={() => go({ name: "timeline" })} title={lang === "ar" ? "اعرض خط التعديلات" : "View amendments"} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                <span className="badge-live">
                  <span className="live-dot" />
                  {lang === "ar" ? `آخر التحديثات · ${a.amendedYear}هـ` : `Latest update · ${a.amendedYear}`}
                </span>
              </button>
            )}
          </div>
          {a.sample && <Badge tone="accent"><Icon name="doc" size={14} />{lang === "ar" ? "نص تمثيلي — بانتظار النص الرسمي" : "Sample text"}</Badge>}
          {/* action row */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
            <Btn size="sm" variant={saved ? "solid" : "ghost"} icon={saved ? "bookmarkF" : "bookmark"} onClick={() => toggleBookmark(num)}>{saved ? lang === "ar" ? "محفوظة" : "Saved" : lang === "ar" ? "حفظ" : "Save"}</Btn>
            <Btn size="sm" variant="ghost" icon={copied ? "check" : "copy"} onClick={copyLink}>{copied ? lang === "ar" ? "تم النسخ" : "Copied" : lang === "ar" ? "نسخ الرابط" : "Copy link"}</Btn>
            <Btn size="sm" variant="ghost" icon="share" onClick={() => go({ name: "card", num })}>{lang === "ar" ? "بطاقة" : "Card"}</Btn>
          </div>
        </div>
      </header>

      <hr className="hairline" style={{ marginBottom: 34 }} />

      {/* official text */}
      <section style={{ marginBottom: 40 }}>
        <Kicker style={{ marginBottom: 14 }}>{lang === "ar" ? "النص الرسمي" : "Official text"}</Kicker>
        <div style={{ background: "var(--paper-2)", border: "1px solid var(--hair)", borderRadius: 14, padding: "clamp(22px,3.5vw,34px)", borderInlineStart: "3px solid var(--ink)" }}>
          <p style={{ margin: 0, fontSize: "clamp(18px,2.3vw,22px)", lineHeight: 2, fontWeight: 400 }}><GlossText text={a.officialText} lang={lang} /></p>
        </div>
        {a.isAmended && a.originalText &&
        <div style={{ marginTop: 12 }}>
            <button onClick={() => setShowOriginal(!showOriginal)} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "var(--amber)", font: "600 13.5px var(--text)", padding: "6px 0" }}>
              <Icon name={showOriginal ? "x" : "doc"} size={16} />{showOriginal ? lang === "ar" ? "إخفاء النص الأصلي" : "Hide original" : lang === "ar" ? "عرض النص الأصلي قبل التعديل" : "Show original text"}
            </button>
            {showOriginal &&
          <div style={{ marginTop: 8, background: "var(--amber-tint)", border: "1px solid color-mix(in srgb,var(--amber) 25%,transparent)", borderRadius: 12, padding: "18px 22px" }}>
                <div style={{ font: "600 12px var(--text)", color: "var(--amber)", letterSpacing: ".1em", marginBottom: 8 }}>{a.amendmentInfo || (lang === "ar" ? "النص قبل التعديل" : "Pre-amendment")}</div>
                <p style={{ margin: 0, color: "var(--ink-soft)", lineHeight: 1.9 }}>{a.originalText}</p>
              </div>
          }
          </div>
        }
      </section>

      {/* simplified */}
      <section style={{ marginBottom: 36, display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: 18 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--accent-tint)", display: "grid", placeItems: "center", color: "var(--accent)" }}><Icon name="spark" size={22} /></div>
        <div>
          <h3 className="display" style={{ fontSize: 21, fontWeight: 800, margin: "6px 0 10px", color: "var(--accent)" }}>{lang === "ar" ? "ببساطة" : "In short"}</h3>
          <p style={{ margin: 0, fontSize: 17.5, lineHeight: 1.95, color: "var(--ink)" }}>{a.simplifiedAr}</p>
        </div>
      </section>

      {/* example — the centerpiece */}
      {a.example &&
      <section style={{ marginBottom: 44, background: "var(--card)", border: "1px solid var(--hair-strong)", borderRadius: 18, overflow: "hidden", boxShadow: "var(--shadow)" }}>
          <div style={{ padding: "20px clamp(22px,3.5vw,32px)", borderBottom: "1px solid var(--hair)", display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="layers" size={20} style={{ color: "var(--accent)" }} />
            <span className="display" style={{ fontSize: 18, fontWeight: 800 }}>{lang === "ar" ? "مثال عملي" : "Real example"}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))" }}>
            <div style={{ padding: "26px clamp(22px,3.5vw,32px)" }}>
              <div className="kicker" style={{ marginBottom: 10 }}>{lang === "ar" ? "الموقف" : "Scenario"}</div>
              <p style={{ margin: 0, lineHeight: 1.9, fontSize: 16 }}>{a.example.scenario}</p>
            </div>
            <div style={{ padding: "26px clamp(22px,3.5vw,32px)", background: "var(--accent-tint)", borderInlineStart: "1px solid var(--hair)" }}>
              <div className="kicker" style={{ marginBottom: 10, color: "var(--accent)" }}>{lang === "ar" ? "النتيجة وفق المادة" : "Outcome"}</div>
              <p style={{ margin: 0, lineHeight: 1.9, fontSize: 16, fontWeight: 500 }}>{a.example.outcome}</p>
            </div>
          </div>
          {a.calculator &&
        <button onClick={() => go({ name: "calc", tool: a.calculator })} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px clamp(22px,3.5vw,32px)", background: "var(--accent)", color: "var(--paper)", border: "none", font: "700 15px var(--text)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><Icon name="calc" size={20} />{lang === "ar" ? "جرّب الحاسبة المرتبطة بهذه المادة" : "Try the linked calculator"}</span>
              <Icon name={lang === "ar" ? "left" : "right"} size={20} />
            </button>
        }
        </section>
      }

      {/* keywords + related */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 30, marginBottom: 30 }}>
        <div>
          <Kicker style={{ marginBottom: 14 }}>{lang === "ar" ? "كلمات مفتاحية" : "Keywords"}</Kicker>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(a.keywords || []).map((k) =>
            <button key={k} onClick={() => go({ name: "search", q: k })} style={{ background: "var(--paper-2)", border: "1px solid var(--hair)", borderRadius: 999, padding: "7px 14px", font: "500 13.5px var(--text)", color: "var(--ink-soft)" }}>{k}</button>
            )}
          </div>
        </div>
        <div>
          <Kicker style={{ marginBottom: 14 }}>{lang === "ar" ? "مواد ذات صلة" : "Related"}</Kicker>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(a.relatedArticles || []).map((r) =>
            <button key={r} onClick={() => go({ name: "article", num: r })} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "transparent", border: "1px solid var(--hair-strong)", borderRadius: 10, padding: "8px 13px", font: "600 14px var(--text)", color: "var(--ink)" }}>
                <span style={{ color: "var(--accent)" }}>{lang === "ar" ? "م" : "Art."}</span><span className="num">{toAr(r)}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      <hr className="hairline" style={{ marginBlock: 28 }} />

      {/* prev / next */}
      <nav style={{ display: "flex", justifyContent: "space-between", gap: 14, marginBottom: 20 }}>
        {prev ? <PrevNext lang={lang} dir="prev" num={prev} go={go} /> : <span />}
        {next ? <PrevNext lang={lang} dir="next" num={next} go={go} /> : <span />}
      </nav>

      {/* disclaimer */}
      <div style={{ background: "var(--paper-2)", border: "1px dashed var(--hair-strong)", borderRadius: 12, padding: "16px 20px", display: "flex", gap: 12, alignItems: "flex-start", color: "var(--ink-faint)", fontSize: 13, lineHeight: 1.75 }}>
        <Icon name="shield" size={18} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>{lang === "ar" ? "الشرح والمثال تبسيطيان غير رسميين لأغراض تعريفية، ولا يُعدّان استشارة قانونية. النص الرسمي الساري هو المنشور في المصدر الرسمي." : "The explanation and example are unofficial and informational, not legal advice."}</span>
      </div>
    </article>);

}
function PrevNext({ dir, num, go, lang }) {
  const isPrev = dir === "prev";
  const arrow = lang === "ar" ? isPrev ? "right" : "left" : isPrev ? "left" : "right";
  return (
    <button onClick={() => go({ name: "article", num })} style={{ display: "flex", alignItems: "center", gap: 12, background: "transparent", border: "1px solid var(--hair)", borderRadius: 12, padding: "14px 18px", textAlign: isPrev ? "start" : "end", flex: "0 1 auto" }}>
      {isPrev && <Icon name={arrow} size={22} style={{ color: "var(--accent)" }} />}
      <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ font: "600 11.5px var(--text)", letterSpacing: ".1em", color: "var(--ink-faint)" }}>{isPrev ? lang === "ar" ? "السابقة" : "PREV" : lang === "ar" ? "التالية" : "NEXT"}</span>
        <span className="display" style={{ fontSize: 19, fontWeight: 800 }}>{lang === "ar" ? "المادة " : "Art. "}{toAr(num)}</span>
      </span>
      {!isPrev && <Icon name={arrow} size={22} style={{ color: "var(--accent)" }} />}
    </button>);

}
window.ArticleView = ArticleView;
Object.assign(window, { Cover, ArticleView, GlossText });