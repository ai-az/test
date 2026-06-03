/* ============================================================
   APP — share card, router, mount
   ============================================================ */
const { useState, useEffect, useCallback } = React;

/* expressive tweak presets */
const ACCENTS = {
  olive: { name: "زيتي", swatch: "#1a5c43", light: ["#1a5c43", "#124231"], dark: ["#5fb893", "#8fd3b3"] },
  brick: { name: "طوبي", swatch: "#9a3b2e", light: ["#9a3b2e", "#6f2820"], dark: ["#e08a78", "#f0a695"] },
  navy:  { name: "كحلي", swatch: "#1f3a5f", light: ["#1f3a5f", "#142a47"], dark: ["#6f9bd1", "#9bbce0"] },
  gold:  { name: "ذهبي", swatch: "#9a7b1e", light: ["#9a7b1e", "#6f5712"], dark: ["#d2a45a", "#e2bd80"] },
};
const KASHIDA = {
  هادئة:  { body: '"dlig" 1, "calt" 1, "liga" 1', display: '"dlig" 1, "calt" 1, "rlig" 1', kashida: '"dlig" 1, "calt" 1, "rlig" 1' },
  متوسطة: { body: '"swsh" 1, "dlig" 1, "calt" 1, "rlig" 1, "liga" 1', display: '"swsh" 1, "dlig" 1, "calt" 1, "rlig" 1', kashida: '"swsh" 1, "dlig" 1, "calt" 1, "rlig" 1' },
  مبالِغة:{ body: '"swsh" 1, "ss05" 1, "dlig" 1, "calt" 1, "rlig" 1, "liga" 1', display: '"swsh" 1, "ss05" 1, "dlig" 1, "calt" 1, "rlig" 1', kashida: '"swsh" 1, "ss05" 1, "dlig" 1, "calt" 1, "rlig" 1' },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "olive",
  "numScale": 1,
  "kashida": "متوسطة"
}/*EDITMODE-END*/;

/* ---------------- SPECIMEN SHARE CARD ---------------- */
// Draw the share card to a high-res canvas (no external deps) → returns a Blob.
async function renderCardBlob(a, lang) {
  const S = 3;                      // 360×450 logical → 1080×1350 px
  const W = 360 * S, H = 450 * S, P = 30 * S;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const x = c.getContext("2d");
  const serif = '"Thmanyah Serif"', sans = '"Thmanyah Sans"';
  try {
    await Promise.all([
      document.fonts.load(`800 100px ${serif}`),
      document.fonts.load(`700 30px ${sans}`),
      document.fonts.load(`500 30px ${sans}`),
    ]);
    await document.fonts.ready;
  } catch (e) {}
  const num = toAr(a.articleNumber);

  // background
  x.fillStyle = "#1c1b18"; x.fillRect(0, 0, W, H);

  // ghost numeral
  x.save();
  x.fillStyle = "rgba(255,255,255,0.045)";
  x.textAlign = "left"; x.textBaseline = "top";
  x.font = `800 ${210 * S}px ${serif}`;
  x.fillText(num, -14 * S, -34 * S);
  x.restore();

  x.direction = "rtl";
  const right = W - P, left = P;

  // top row
  x.textBaseline = "top";
  x.textAlign = "right";
  x.fillStyle = "#f7f4ec";
  x.font = `700 ${13 * S}px ${sans}`;
  x.fillText(lang === "ar" ? "نظام العمل" : "Labor Law", right, P + 2 * S);
  if (a.isAmended) {
    const label = lang === "ar" ? "مُعدَّلة" : "Amended";
    x.font = `600 ${11 * S}px ${sans}`;
    const tw = x.measureText(label).width, pad = 9 * S, bh = 22 * S;
    const bx = left, by = P - 2 * S;
    x.strokeStyle = "rgba(210,164,90,0.5)"; x.lineWidth = 1 * S;
    roundRect(x, bx, by, tw + pad * 2, bh, 11 * S); x.stroke();
    x.fillStyle = "#d2a45a"; x.textAlign = "left"; x.textBaseline = "middle";
    x.fillText(label, bx + pad, by + bh / 2 + 1 * S);
    x.textAlign = "right"; x.textBaseline = "top";
  }

  // article label
  x.fillStyle = "rgba(247,244,236,0.6)";
  x.font = `600 ${12 * S}px ${sans}`;
  x.fillText(lang === "ar" ? "المادة" : "ARTICLE", right, 148 * S);

  // big number
  x.fillStyle = "#5fb893";
  x.font = `800 ${140 * S}px ${serif}`;
  x.fillText(num, right, 154 * S);

  // simplified text (wrapped)
  const text = a.simplifiedAr.length > 140 ? a.simplifiedAr.slice(0, 140) + "…" : a.simplifiedAr;
  x.fillStyle = "rgba(247,244,236,0.95)";
  x.font = `500 ${15 * S}px ${sans}`;
  const lines = wrapRTL(x, text, W - P * 2);
  let ty = 292 * S;
  const lh = 24 * S;
  for (const ln of lines.slice(0, 4)) { x.fillText(ln, right, ty); ty += lh; }

  // footer
  x.strokeStyle = "rgba(255,255,255,0.15)"; x.lineWidth = 1 * S;
  x.beginPath(); x.moveTo(left, H - P - 22 * S); x.lineTo(right, H - P - 22 * S); x.stroke();
  x.fillStyle = "rgba(247,244,236,0.7)";
  x.font = `500 ${11 * S}px ${sans}`;
  x.textAlign = "right";
  x.fillText(lang === "ar" ? "المرجع التفاعلي لنظام العمل" : "Interactive Labor Law Reference", right, H - P - 16 * S);
  x.textAlign = "left";
  x.fillText(lang === "ar" ? "شرح تبسيطي" : "simplified", left, H - P - 16 * S);

  return await new Promise((res) => c.toBlob(res, "image/png"));
}
function roundRect(x, rx, ry, w, h, r) {
  x.beginPath();
  x.moveTo(rx + r, ry);
  x.arcTo(rx + w, ry, rx + w, ry + h, r);
  x.arcTo(rx + w, ry + h, rx, ry + h, r);
  x.arcTo(rx, ry + h, rx, ry, r);
  x.arcTo(rx, ry, rx + w, ry, r);
  x.closePath();
}
function wrapRTL(x, text, maxW) {
  const words = text.split(" ");
  const lines = []; let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (x.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function SpecimenCard({ num, go, lang }) {
  const a = LABOR.articles.find(x => x.articleNumber === num);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  if (!a) return null;
  const copyLink = () => {
    try { navigator.clipboard.writeText(`${location.origin}${location.pathname}#/article/${num}`); } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 1600);
  };
  const downloadPng = async () => {
    setSaving(true);
    try {
      const blob = await renderCardBlob(a, lang);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = `نظام-العمل-المادة-${num}.png`;
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (e) { console.error(e); }
    setSaving(false);
  };
  return (
    <div className="wrap" style={{ paddingTop: 38, maxWidth: 880 }}>
      <button onClick={() => go({ name: "article", num })} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "var(--ink-faint)", font: "500 13.5px var(--text)", padding: 0, marginBottom: 26 }}>
        <Icon name={lang === "ar" ? "right" : "left"} size={16} />{lang === "ar" ? `العودة للمادة ${toAr(num)}` : `Back to article ${num}`}
      </button>
      <PageHead lang={lang} kicker={lang === "ar" ? "مشاركة" : "Share"} title={lang === "ar" ? "بطاقة المادة" : "Article card"}
        sub={lang === "ar" ? "بطاقة أنيقة بهوية الموقع، جاهزة للمشاركة في واتساب وتويتر." : "A shareable card in the site's identity."} />

      {/* the card */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "min(440px,100%)", aspectRatio: "4/5", background: "var(--ink)", color: "var(--paper)", borderRadius: 22, padding: "clamp(28px,5vw,40px)", display: "flex", flexDirection: "column", boxShadow: "0 30px 70px -30px rgba(0,0,0,.5)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", insetInlineEnd: -40, top: -30, fontSize: 320, fontWeight: 900, fontFamily: "var(--display)", color: "rgba(255,255,255,.04)", lineHeight: 1 }} className="num">{toAr(num)}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
            <span style={{ font: "700 13px var(--text)", letterSpacing: ".1em" }}>{lang === "ar" ? "نظام العمل" : "Labor Law"}</span>
            {a.isAmended && <span style={{ font: "600 11px var(--text)", color: "#d2a45a", border: "1px solid rgba(210,164,90,.4)", borderRadius: 99, padding: "4px 10px" }}>{lang === "ar" ? "مُعدَّلة" : "Amended"}</span>}
          </div>
          <div style={{ marginTop: "auto", position: "relative" }}>
            <div style={{ font: "600 12px var(--text)", letterSpacing: ".2em", opacity: .6 }}>{lang === "ar" ? "المادة" : "ARTICLE"}</div>
            <div className="num" style={{ fontSize: "clamp(110px,24vw,170px)", fontWeight: 800, lineHeight: .85, color: "#5fb893" }}>{toAr(num)}</div>
            <p style={{ margin: "16px 0 0", fontSize: "clamp(15px,2.4vw,17px)", lineHeight: 1.85, opacity: .95 }}>{a.simplifiedAr.slice(0, 130)}{a.simplifiedAr.length > 130 ? "…" : ""}</p>
          </div>
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,.15)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", fontSize: 11.5, opacity: .7 }}>
            <span>{lang === "ar" ? "المرجع التفاعلي لنظام العمل" : "Interactive Labor Law Reference"}</span>
            <span>{lang === "ar" ? "شرح تبسيطي" : "simplified"}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 26, flexWrap: "wrap" }}>
        <Btn variant="solid" icon={saving ? "spark" : "doc"} onClick={downloadPng}>{saving ? (lang === "ar" ? "جارٍ التجهيز…" : "Preparing…") : (lang === "ar" ? "تنزيل صورة PNG" : "Download PNG")}</Btn>
        <Btn variant="ghost" icon={copied ? "check" : "copy"} onClick={copyLink}>{copied ? (lang === "ar" ? "تم نسخ الرابط" : "Copied") : (lang === "ar" ? "نسخ رابط المادة" : "Copy link")}</Btn>
      </div>
      <p style={{ textAlign: "center", color: "var(--ink-faint)", fontSize: 12.5, marginTop: 16 }}>{lang === "ar" ? "تُحفظ البطاقة بدقة عالية (١٠٨٠×١٣٥٠) جاهزة للنشر في تويتر وواتساب." : "Saved at 1080×1350, ready for social."}</p>
    </div>
  );
}
window.SpecimenCard = SpecimenCard;

/* ---------------- APP ---------------- */
function App() {
  const [route, setRoute] = useState({ name: "home" });
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInit, setSearchInit] = useState("");
  const [lang, setLang] = useLocal("ll_lang", "ar");
  const [theme, setTheme] = useLocal("ll_theme", "light");
  const [bookmarks, setBookmarks] = useLocal("ll_bookmarks", []);
  const [t, setT] = useLocal("ll_character", TWEAK_DEFAULTS);
  const [charOpen, setCharOpen] = useState(false);
  const setTweak = useCallback((key, val) => setT(prev => ({ ...prev, [key]: val })), [setT]);

  // apply dir + theme
  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);

  // apply expressive tweaks → CSS variables
  useEffect(() => {
    const root = document.documentElement.style;
    const pal = ACCENTS[t.accent] || ACCENTS.olive;
    const [acc, deep] = theme === "dark" ? pal.dark : pal.light;
    root.setProperty("--accent", acc);
    root.setProperty("--accent-deep", deep);
    root.setProperty("--accent-tint", `color-mix(in srgb, ${acc} 8%, transparent)`);
    root.setProperty("--accent-tint-2", `color-mix(in srgb, ${acc} 14%, transparent)`);
    root.setProperty("--num-scale", String(t.numScale));
    const k = KASHIDA[t.kashida] || KASHIDA["متوسطة"];
    root.setProperty("--feat-body", k.body);
    root.setProperty("--feat-display", k.display);
    root.setProperty("--feat-kashida", k.kashida);
  }, [t.accent, t.numScale, t.kashida, theme]);

  const go = useCallback((r) => {
    if (r.name === "search") { setSearchInit(r.q || ""); setSearchOpen(true); return; }
    setRoute(r);
    try { history.replaceState(null, "", r.name === "article" ? `#/article/${r.num}` : `#/${r.name}`); } catch {}
    window.scrollTo({ top: 0 });
  }, []);

  // deep link on load
  useEffect(() => {
    const m = location.hash.match(/#\/article\/(\d+)/);
    if (m) setRoute({ name: "article", num: +m[1] });
  }, []);

  const toggleBookmark = useCallback((n) => {
    setBookmarks(b => b.includes(n) ? b.filter(x => x !== n) : [...b, n]);
  }, [setBookmarks]);

  let view;
  switch (route.name) {
    case "home": view = <Cover go={go} lang={lang} />; break;
    case "browse": view = <Browse go={go} lang={lang} />; break;
    case "chapter": view = <ChapterDetail n={route.n} go={go} lang={lang} />; break;
    case "article": view = <ArticleView num={route.num} go={go} lang={lang} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />; break;
    case "index": view = <IndexView go={go} lang={lang} />; break;
    case "scenarios": view = <Scenarios go={go} lang={lang} />; break;
    case "scenario": view = <ScenarioDetail id={route.id} go={go} lang={lang} />; break;
    case "calc": view = <Calculators tool={route.tool} go={go} lang={lang} />; break;
    case "glossary": view = <Glossary lang={lang} />; break;
    case "timeline": view = <Timeline go={go} lang={lang} />; break;
    case "saved": view = <Bookmarks go={go} lang={lang} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />; break;
    case "card": view = <SpecimenCard num={route.num} go={go} lang={lang} />; break;
    default: view = <Cover go={go} lang={lang} />;
  }

  return (
    <div>
      <TopBar go={go} route={route} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme}
        onSearch={() => { setSearchInit(""); setSearchOpen(true); }} onOpenCharacter={() => setCharOpen(true)} bookmarksCount={bookmarks.length} />
      <main key={route.name + (route.num || route.n || route.id || "")} className="reveal" style={{ minHeight: "70vh" }}>{view}</main>
      <Footer lang={lang} go={go} />
      {searchOpen && <Search go={go} lang={lang} initialQ={searchInit} onClose={() => setSearchOpen(false)} />}
      {charOpen && <CharacterPanel t={t} setTweak={setTweak} reset={() => setT(TWEAK_DEFAULTS)} lang={lang} onClose={() => setCharOpen(false)} />}
    </div>
  );
}

/* ---------------- CHARACTER PANEL (visitor-facing) ---------------- */
function CharacterPanel({ t, setTweak, reset, lang, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const L = lang === "ar";
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 150 }}>
      <div onClick={(e) => e.stopPropagation()} className="char-panel" role="dialog" aria-label={L ? "ضبط الطابع" : "Tune character"}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div>
            <div className="display" style={{ fontSize: 19, fontWeight: 800 }}>{L ? "ضبط الطابع" : "Tune the character"}</div>
            <div style={{ font: "500 12px var(--text)", color: "var(--ink-faint)", marginTop: 2 }}>{L ? "اضبط شكل الموقع كما يناسبك" : "Reshape the look to your taste"}</div>
          </div>
          <button className="act" onClick={onClose} aria-label={L ? "إغلاق" : "Close"}><Icon name="x" /></button>
        </div>

        <hr className="hairline" style={{ marginBlock: 16 }} />

        <div className="char-sec">{L ? "اللون المميّز" : "Accent color"}</div>
        <div style={{ display: "flex", gap: 12, marginBottom: 22 }}>
          {Object.entries(ACCENTS).map(([key, p]) => (
            <button key={key} onClick={() => setTweak("accent", key)} title={p.name} aria-label={p.name}
              className={"char-swatch" + (t.accent === key ? " is-on" : "")}
              style={{ background: p.swatch, "--sw": p.swatch }} />
          ))}
        </div>

        <div className="char-sec">{L ? "حجم الأرقام البطلة" : "Hero numeral scale"}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <input className="char-range" type="range" min="0.7" max="1.6" step="0.05" value={t.numScale}
            onChange={(e) => setTweak("numScale", parseFloat(e.target.value))} />
          <span className="num" style={{ font: "700 14px var(--text)", color: "var(--accent)", minWidth: 40, textAlign: "center" }}>{toAr(Number(t.numScale).toFixed(2))}×</span>
        </div>

        <div className="char-sec">{L ? "حدّة الكشيدة" : "Kashida intensity"}</div>
        <div className="char-seg">
          {["هادئة", "متوسطة", "مبالِغة"].map((opt, i) => (
            <button key={opt} type="button" aria-pressed={t.kashida === opt} onClick={() => setTweak("kashida", opt)}>
              {L ? opt : ["Quiet", "Medium", "Dramatic"][i]}
            </button>
          ))}
        </div>

        <hr className="hairline" style={{ marginBlock: 18 }} />
        <button onClick={reset} style={{ width: "100%", background: "transparent", border: "1px solid var(--hair-strong)", borderRadius: 11, padding: "11px", font: "600 13.5px var(--text)", color: "var(--ink-soft)", cursor: "pointer" }}>
          {L ? "إعادة الضبط الافتراضي" : "Reset to default"}
        </button>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
