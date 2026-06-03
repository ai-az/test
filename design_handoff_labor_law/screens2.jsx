/* ============================================================
   SCREENS · part 2 — browse, index, scenarios, calculators,
   glossary, amendments timeline, bookmarks, search
   ============================================================ */

const stripTashkeel = (s) => (s || "").replace(/[\u064B-\u0652\u0640]/g, "");
const { useState, useEffect, useRef } = React;

/* ---------------- BROWSE (chapters) ---------------- */
function Browse({ go, lang }) {
  return (
    <div className="wrap" style={{ paddingTop: 40 }}>
      <PageHead lang={lang} kicker={lang === "ar" ? "تصفّح" : "Browse"} title={lang === "ar" ? "الأبواب" : "Chapters"}
        sub={lang === "ar" ? "النظام موزّع على ١٦ باباً و٢٤٥ مادة. اختر باباً لعرض فصوله ومواده." : "16 chapters, 245 articles."} />
      <div style={{ borderTop: "1px solid var(--hair)" }}>
        {LABOR.chapters.map(c => (
          <button key={c.n} onClick={() => go({ name: "chapter", n: c.n })} className="row-cell" style={{
            width: "100%", display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto", gap: "clamp(16px,3vw,36px)",
            alignItems: "center", textAlign: "start", background: "transparent", border: "none",
            borderBottom: "1px solid var(--hair)", padding: "26px 8px",
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

/* ---------------- CHAPTER DETAIL ---------------- */
function ChapterDetail({ n, go, lang }) {
  const c = LABOR.chapters.find(x => x.n === n);
  if (!c) return null;
  const nums = [];
  for (let i = c.from; i <= c.to; i++) nums.push(i);
  const have = new Set(LABOR.articles.filter(a => !a.status).map(a => a.articleNumber));
  return (
    <div className="wrap" style={{ paddingTop: 38 }}>
      <button onClick={() => go({ name: "browse" })} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "var(--ink-faint)", font: "500 13.5px var(--text)", padding: 0, marginBottom: 26 }}>
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
        {nums.map(i => {
          const ready = have.has(i);
          return (
            <button key={i} onClick={() => go({ name: "article", num: i })} title={ready ? "" : (lang === "ar" ? "قيد الإدخال" : "pending")} style={{
              aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
              background: ready ? "var(--card)" : "transparent", border: `1px solid ${ready ? "var(--hair-strong)" : "var(--hair)"}`,
              borderRadius: 12, color: ready ? "var(--ink)" : "var(--ink-faint)", opacity: ready ? 1 : .55,
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

/* ---------------- INDEX (all articles, filterable) ---------------- */
function IndexView({ go, lang }) {
  const [chap, setChap] = useState(0);
  const ready = LABOR.articles.filter(a => !a.status).sort((a, b) => a.articleNumber - b.articleNumber);
  const shown = chap ? ready.filter(a => a.chapter.number === chap) : ready;
  return (
    <div className="wrap" style={{ paddingTop: 40 }}>
      <PageHead lang={lang} kicker={lang === "ar" ? "خريطة" : "Map"} title={lang === "ar" ? "الفهرس" : "Index"}
        sub={lang === "ar" ? "عرض شامل لكل مادة مُدخلة، قابل للتصفية حسب الباب." : "Every entered article, filterable by chapter."} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 26 }}>
        <FilterChip active={chap === 0} onClick={() => setChap(0)} label={lang === "ar" ? "الكل" : "All"} />
        {LABOR.chapters.filter(c => ready.some(a => a.chapter.number === c.n)).map(c => (
          <FilterChip key={c.n} active={chap === c.n} onClick={() => setChap(c.n)} label={lang === "ar" ? `${toAr(c.n)}· ${c.title}` : c.en} />
        ))}
      </div>
      <div style={{ borderTop: "1px solid var(--hair)" }}>
        {shown.map(a => (
          <button key={a.articleNumber} onClick={() => go({ name: "article", num: a.articleNumber })} className="row-cell" style={{
            width: "100%", display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto", gap: 22, alignItems: "center",
            textAlign: "start", background: "transparent", border: "none", borderBottom: "1px solid var(--hair)", padding: "20px 6px",
          }}>
            <div className="num" style={{ fontSize: 36, fontWeight: 800, color: "var(--accent)", minWidth: 64 }}>{toAr(a.articleNumber)}</div>
            <div>
              <div style={{ font: "600 16px var(--text)", marginBottom: 2 }}>{a.simplifiedAr.split("،")[0].split(".")[0].slice(0, 64)}…</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", font: "500 12.5px var(--text)", color: "var(--ink-faint)" }}>
                <span>{lang === "ar" ? `الباب ${toAr(a.chapter.number)}` : `Ch.${a.chapter.number}`}</span>
                {a.isAmended && <span style={{ color: "var(--amber)" }}>· {lang === "ar" ? "مُعدَّلة" : "amended"}</span>}
                {window.isRecentlyAmended(a) && <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--accent)", fontWeight: 600 }}>· <span className="live-dot" style={{ width: 6, height: 6 }} />{lang === "ar" ? "آخر التحديثات" : "latest"}</span>}
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

/* ---------------- SCENARIOS ---------------- */
function Scenarios({ go, lang }) {
  return (
    <div className="wrap" style={{ paddingTop: 40 }}>
      <PageHead lang={lang} kicker={lang === "ar" ? "ابدأ من حالتك" : "Start here"} title={lang === "ar" ? "حسب الموقف" : "By situation"}
        sub={lang === "ar" ? "لا تبدأ من رقم الباب — ابدأ من موقفك، ودعنا نقودك إلى المواد والحاسبة المناسبة." : "Start from your situation, not a chapter number."} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {LABOR.scenarios.map(s => (
          <button key={s.id} onClick={() => go({ name: "scenario", id: s.id })} style={{
            textAlign: "start", background: "var(--card)", border: "1px solid var(--hair-strong)", borderRadius: 16,
            padding: 26, display: "flex", flexDirection: "column", gap: 14, minHeight: 180, boxShadow: "var(--shadow)",
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 13, background: "var(--accent-tint)", display: "grid", placeItems: "center", color: "var(--accent)" }}><Icon name={s.icon} size={24} /></div>
            <div className="display" style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{s.title}</div>
            <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: 14.5, lineHeight: 1.8 }}>{s.desc}</p>
            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 8, color: "var(--accent)", font: "600 13.5px var(--text)" }}>
              {lang === "ar" ? `${toAr(s.articles.length)} مواد مرتبطة` : `${s.articles.length} articles`}<Icon name={lang === "ar" ? "left" : "right"} size={16} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
function ScenarioDetail({ id, go, lang }) {
  const s = LABOR.scenarios.find(x => x.id === id);
  if (!s) return null;
  const have = new Map(LABOR.articles.filter(a => !a.status).map(a => [a.articleNumber, a]));
  const calcArt = s.articles.map(n => have.get(n)).find(a => a && a.calculator);
  return (
    <div className="wrap" style={{ paddingTop: 38, maxWidth: 880 }}>
      <button onClick={() => go({ name: "scenarios" })} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "var(--ink-faint)", font: "500 13.5px var(--text)", padding: 0, marginBottom: 26 }}>
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
        {s.articles.map(n => {
          const a = have.get(n);
          return (
            <button key={n} onClick={() => go({ name: "article", num: n })} style={{
              display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto", gap: 18, alignItems: "center", textAlign: "start",
              background: a ? "var(--card)" : "var(--paper-2)", border: "1px solid var(--hair)", borderRadius: 13, padding: "16px 20px", opacity: a ? 1 : .6,
            }}>
              <span className="num" style={{ fontSize: 32, fontWeight: 800, color: "var(--accent)", minWidth: 52 }}>{toAr(n)}</span>
              <span style={{ font: "500 15px var(--text)", color: "var(--ink-soft)", lineHeight: 1.7 }}>{a ? a.simplifiedAr.slice(0, 80) + "…" : (lang === "ar" ? "قيد الإدخال" : "pending")}</span>
              {a && <Icon name={lang === "ar" ? "left" : "right"} size={20} style={{ color: "var(--ink-faint)" }} />}
            </button>
          );
        })}
      </div>
      {calcArt && (
        <button onClick={() => go({ name: "calc", tool: calcArt.calculator })} style={{ marginTop: 22, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--accent)", color: "var(--paper)", border: "none", borderRadius: 14, padding: "18px 24px", font: "700 16px var(--text)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><Icon name="calc" size={22} />{lang === "ar" ? "احسب تقديرك بالحاسبة المناسبة" : "Open the calculator"}</span>
          <Icon name={lang === "ar" ? "left" : "right"} size={22} />
        </button>
      )}
    </div>
  );
}

/* ---------------- CALCULATORS ---------------- */
function Calculators({ tool, go, lang }) {
  const [active, setActive] = useState(tool || "eos");
  useEffect(() => { if (tool) setActive(tool); }, [tool]);
  const tools = [
    { id: "eos", label: lang === "ar" ? "مكافأة نهاية الخدمة" : "End of service", art: 84 },
    { id: "ot",  label: lang === "ar" ? "الأجر الإضافي" : "Overtime", art: 107 },
    { id: "leave", label: lang === "ar" ? "مدة الإشعار" : "Notice period", art: 75 },
  ];
  return (
    <div className="wrap" style={{ paddingTop: 40, maxWidth: 880 }}>
      <PageHead lang={lang} kicker={lang === "ar" ? "أدوات" : "Tools"} title={lang === "ar" ? "الحاسبات" : "Calculators"}
        sub={lang === "ar" ? "كل حاسبة مرتبطة بمادتها. النتائج تقديرية غير ملزمة." : "Each calculator links to its article. Results are estimates."} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 30 }}>
        {tools.map(t => <FilterChip key={t.id} active={active === t.id} onClick={() => setActive(t.id)} label={t.label} />)}
      </div>
      {active === "eos" && <EosCalc go={go} lang={lang} />}
      {active === "ot" && <OtCalc go={go} lang={lang} />}
      {active === "leave" && <NoticeCalc go={go} lang={lang} />}
    </div>
  );
}

function CalcShell({ children, result, art, go, lang }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, alignItems: "start" }}>
      <div style={{ background: "var(--card)", border: "1px solid var(--hair-strong)", borderRadius: 16, padding: 26, display: "flex", flexDirection: "column", gap: 18, boxShadow: "var(--shadow)" }}>{children}</div>
      <div style={{ position: "sticky", top: 86 }}>
        <div style={{ background: "var(--accent)", color: "var(--paper)", borderRadius: 16, padding: 28, textAlign: "center" }}>
          <div style={{ font: "600 12px var(--text)", letterSpacing: ".18em", opacity: .8 }}>{lang === "ar" ? "التقدير" : "ESTIMATE"}</div>
          <div className="num" style={{ fontSize: "clamp(40px,7vw,64px)", fontWeight: 800, marginBlock: 6 }}>{result.value}</div>
          <div style={{ fontSize: 14, opacity: .9 }}>{result.unit}</div>
          {result.detail && <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,.2)", fontSize: 13.5, lineHeight: 1.7, opacity: .92 }}>{result.detail}</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
          <button onClick={() => go({ name: "article", num: art })} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "1px solid var(--hair-strong)", borderRadius: 11, padding: "13px 16px", font: "600 14px var(--text)", color: "var(--ink)" }}>
            {lang === "ar" ? `المادة المرجعية ${toAr(art)}` : `Reference article ${art}`}<Icon name={lang === "ar" ? "left" : "right"} size={18} style={{ color: "var(--accent)" }} />
          </button>
          <div style={{ display: "flex", gap: 9, alignItems: "flex-start", color: "var(--ink-faint)", fontSize: 12.5, lineHeight: 1.6, padding: "0 4px" }}>
            <Icon name="shield" size={15} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>{lang === "ar" ? "حساب تقديري غير مُلزم، يُرجى الرجوع للمصدر الرسمي والمختصين." : "Non-binding estimate."}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
function Field({ label, children }) {
  return <label style={{ display: "flex", flexDirection: "column", gap: 8 }}><span style={{ font: "600 13.5px var(--text)", color: "var(--ink-soft)" }}>{label}</span>{children}</label>;
}
const inputStyle = { font: "600 17px var(--text)", padding: "12px 14px", borderRadius: 11, border: "1px solid var(--hair-strong)", background: "var(--paper)", color: "var(--ink)", width: "100%" };

function EosCalc({ go, lang }) {
  const [wage, setWage] = useState(8000);
  const [years, setYears] = useState(8);
  const [reason, setReason] = useState("end");
  const y = Math.max(0, +years || 0);
  const w = Math.max(0, +wage || 0);
  const first = Math.min(y, 5) * 0.5;
  const beyond = Math.max(0, y - 5) * 1;
  let months = first + beyond;
  let frac = 1, fracNote = "";
  if (reason === "resign") {
    if (y < 2) { frac = 0; fracNote = lang === "ar" ? "أقل من سنتين: لا مكافأة عند الاستقالة" : "<2y: none"; }
    else if (y < 5) { frac = 1 / 3; fracNote = lang === "ar" ? "٢–٥ سنوات: ثلث المكافأة" : "1/3"; }
    else if (y < 10) { frac = 2 / 3; fracNote = lang === "ar" ? "٥–١٠ سنوات: ثلثا المكافأة" : "2/3"; }
    else { frac = 1; fracNote = lang === "ar" ? "١٠ سنوات فأكثر: المكافأة كاملة" : "full"; }
  }
  const total = Math.round(months * frac * w);
  return (
    <CalcShell go={go} lang={lang} art={84} result={{
      value: toAr(total.toLocaleString("en-US")), unit: lang === "ar" ? "ريال (تقريباً)" : "SAR (approx.)",
      detail: `${lang === "ar" ? "أشهر المكافأة" : "Months"}: ${toAr(months.toFixed(1))}${reason === "resign" ? " · " + fracNote : ""}`,
    }}>
      <Field label={lang === "ar" ? "الأجر الأخير (شهري)" : "Last monthly wage"}>
        <input type="number" value={wage} onChange={e => setWage(e.target.value)} style={inputStyle} />
      </Field>
      <Field label={lang === "ar" ? "سنوات الخدمة" : "Years of service"}>
        <input type="number" step="0.5" value={years} onChange={e => setYears(e.target.value)} style={inputStyle} />
      </Field>
      <Field label={lang === "ar" ? "سبب انتهاء العقد" : "Reason"}>
        <div style={{ display: "flex", gap: 8 }}>
          {[["end", lang === "ar" ? "انتهاء/إنهاء" : "Termination"], ["resign", lang === "ar" ? "استقالة" : "Resignation"]].map(([v, l]) => (
            <button key={v} onClick={() => setReason(v)} style={{ flex: 1, padding: "12px", borderRadius: 11, border: `1px solid ${reason === v ? "var(--accent)" : "var(--hair-strong)"}`, background: reason === v ? "var(--accent-tint)" : "transparent", color: reason === v ? "var(--accent)" : "var(--ink-soft)", font: "600 14px var(--text)" }}>{l}</button>
          ))}
        </div>
      </Field>
      <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-faint)", lineHeight: 1.7 }}>{lang === "ar" ? "وفق المادتين ٨٤ و٨٧: نصف شهر عن كل سنة من أول خمس سنوات، وشهر عن كل سنة تالية، مع تعديل نسبة الاستقالة." : "Per Art. 84 & 87."}</p>
    </CalcShell>
  );
}
function OtCalc({ go, lang }) {
  const [hourly, setHourly] = useState(40);
  const [hours, setHours] = useState(10);
  const total = Math.round(Math.max(0, +hourly || 0) * 1.5 * Math.max(0, +hours || 0));
  return (
    <CalcShell go={go} lang={lang} art={107} result={{
      value: toAr(total.toLocaleString("en-US")), unit: lang === "ar" ? "ريال (تقريباً)" : "SAR (approx.)",
      detail: lang === "ar" ? `أجر الساعة الإضافية = ${toAr(Math.round((+hourly || 0) * 1.5))} ريال` : `${Math.round((+hourly || 0) * 1.5)} / hr`,
    }}>
      <Field label={lang === "ar" ? "أجر الساعة العادية" : "Regular hourly wage"}>
        <input type="number" value={hourly} onChange={e => setHourly(e.target.value)} style={inputStyle} />
      </Field>
      <Field label={lang === "ar" ? "عدد الساعات الإضافية" : "Overtime hours"}>
        <input type="number" value={hours} onChange={e => setHours(e.target.value)} style={inputStyle} />
      </Field>
      <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-faint)", lineHeight: 1.7 }}>{lang === "ar" ? "وفق المادة ١٠٧: أجر الساعة الإضافية = أجر الساعة + ٥٠٪ (أي ١٫٥ ضعف)." : "Per Art. 107: ×1.5."}</p>
    </CalcShell>
  );
}
function NoticeCalc({ go, lang }) {
  const [paid, setPaid] = useState("monthly");
  const days = paid === "monthly" ? 60 : 30;
  return (
    <CalcShell go={go} lang={lang} art={75} result={{
      value: toAr(days), unit: lang === "ar" ? "يوماً (مدة الإشعار)" : "days notice",
      detail: lang === "ar" ? (paid === "monthly" ? "الأجر شهري ← ٦٠ يوماً" : "غير شهري ← ٣٠ يوماً") : "",
    }}>
      <Field label={lang === "ar" ? "طريقة دفع الأجر" : "Wage payment"}>
        <div style={{ display: "flex", gap: 8 }}>
          {[["monthly", lang === "ar" ? "شهري" : "Monthly"], ["other", lang === "ar" ? "غير شهري" : "Other"]].map(([v, l]) => (
            <button key={v} onClick={() => setPaid(v)} style={{ flex: 1, padding: "12px", borderRadius: 11, border: `1px solid ${paid === v ? "var(--accent)" : "var(--hair-strong)"}`, background: paid === v ? "var(--accent-tint)" : "transparent", color: paid === v ? "var(--accent)" : "var(--ink-soft)", font: "600 14px var(--text)" }}>{l}</button>
          ))}
        </div>
      </Field>
      <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-faint)", lineHeight: 1.7 }}>{lang === "ar" ? "وفق المادة ٧٥ للعقود غير محددة المدة: إشعار كتابي قبل ٦٠ يوماً (الأجر الشهري) أو ٣٠ يوماً لغيره." : "Per Art. 75."}</p>
    </CalcShell>
  );
}

/* ---------------- GLOSSARY ---------------- */
function Glossary({ lang }) {
  return (
    <div className="wrap" style={{ paddingTop: 40, maxWidth: 880 }}>
      <PageHead lang={lang} kicker={lang === "ar" ? "الباب الأول" : "Chapter 1"} title={lang === "ar" ? "مسرد المصطلحات" : "Glossary"}
        sub={lang === "ar" ? "تعريفات النظام الأساسية. تظهر هذه التعريفات أيضاً كتلميحات داخل نصوص المواد." : "Core definitions, also shown as tooltips inside articles."} />
      <div style={{ borderTop: "1px solid var(--hair)" }}>
        {LABOR.glossary.map((g, i) => (
          <div key={g.term} style={{ display: "grid", gridTemplateColumns: "minmax(120px,200px) 1fr", gap: "clamp(16px,4vw,40px)", padding: "26px 6px", borderBottom: "1px solid var(--hair)", alignItems: "baseline" }}>
            <div className="display" style={{ fontSize: "clamp(20px,2.6vw,26px)", fontWeight: 800, color: "var(--accent)" }}>{g.term}</div>
            <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.9, color: "var(--ink-soft)" }}>{g.def}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- AMENDMENTS TIMELINE ---------------- */
function Timeline({ go, lang }) {
  return (
    <div className="wrap" style={{ paddingTop: 40, maxWidth: 820 }}>
      <PageHead lang={lang} kicker={lang === "ar" ? "تطوّر النظام" : "Evolution"} title={lang === "ar" ? "خط التعديلات" : "Amendments"}
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
                const arts = LABOR.articles.filter(x => !x.status && x.amendedYear === yr);
                if (!arts.length) return null;
                return (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 12 }}>
                    {arts.map(x => (
                      <button key={x.articleNumber} onClick={() => go({ name: "article", num: x.articleNumber })}
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

/* ---------------- BOOKMARKS ---------------- */
function Bookmarks({ go, lang, bookmarks, toggleBookmark }) {
  const items = bookmarks.map(n => LABOR.articles.find(a => a.articleNumber === n && !a.status)).filter(Boolean);
  return (
    <div className="wrap" style={{ paddingTop: 40, maxWidth: 880 }}>
      <PageHead lang={lang} kicker={lang === "ar" ? "محلي على جهازك" : "Local"} title={lang === "ar" ? "المواد المحفوظة" : "Saved articles"}
        sub={lang === "ar" ? "تُحفظ محلياً في متصفّحك فقط، دون أي تسجيل." : "Stored locally in your browser only."} />
      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "70px 20px", border: "1px dashed var(--hair-strong)", borderRadius: 16 }}>
          <Icon name="bookmark" size={40} style={{ color: "var(--ink-faint)" }} />
          <p style={{ color: "var(--ink-soft)", marginTop: 14 }}>{lang === "ar" ? "لا توجد مواد محفوظة بعد. استخدم زر «حفظ» في صفحة أي مادة." : "No saved articles yet."}</p>
          <Btn variant="ghost" onClick={() => go({ name: "browse" })} icon={lang === "ar" ? "left" : "right"} style={{ marginTop: 8 }}>{lang === "ar" ? "تصفّح الأبواب" : "Browse"}</Btn>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map(a => (
            <div key={a.articleNumber} style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr) auto", gap: 18, alignItems: "center", background: "var(--card)", border: "1px solid var(--hair)", borderRadius: 13, padding: "16px 20px" }}>
              <button onClick={() => go({ name: "article", num: a.articleNumber })} style={{ background: "none", border: "none" }}><span className="num" style={{ fontSize: 34, fontWeight: 800, color: "var(--accent)" }}>{toAr(a.articleNumber)}</span></button>
              <button onClick={() => go({ name: "article", num: a.articleNumber })} style={{ background: "none", border: "none", textAlign: "start" }}><span style={{ font: "500 15px var(--text)", color: "var(--ink-soft)", lineHeight: 1.7 }}>{a.simplifiedAr.slice(0, 80)}…</span></button>
              <button onClick={() => toggleBookmark(a.articleNumber)} className="act" title={lang === "ar" ? "إزالة" : "Remove"}><Icon name="x" size={18} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- SEARCH OVERLAY ---------------- */
function Search({ go, lang, initialQ, onClose }) {
  const [q, setQ] = useState(initialQ || "");
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);
  const ready = LABOR.articles.filter(a => !a.status);
  const nq = stripTashkeel(q.trim());
  const results = !nq ? [] : ready.map(a => {
    const hay = stripTashkeel([a.articleNumber, a.officialText, a.simplifiedAr, (a.keywords || []).join(" "), a.chapter.title].join(" "));
    const score = hay.includes(nq) ? (String(a.articleNumber) === nq ? 100 : 1) : 0;
    return { a, score };
  }).filter(r => r.score > 0).sort((x, y) => y.score - x.score);

  const hi = (text) => {
    if (!nq) return text;
    const raw = stripTashkeel(text);
    const i = raw.indexOf(nq);
    if (i === -1) return text.slice(0, 90);
    const start = Math.max(0, i - 30);
    return (start > 0 ? "…" : "") + text.slice(start, i) + "‹" + text.slice(i, i + nq.length) + "›" + text.slice(i + nq.length, i + nq.length + 50) + "…";
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "color-mix(in srgb,var(--paper) 80%,transparent)", backdropFilter: "blur(16px)", overflowY: "auto" }}>
      <div className="wrap" style={{ maxWidth: 760, paddingTop: "clamp(30px,8vh,90px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "var(--card)", border: "1px solid var(--hair-strong)", borderRadius: 16, padding: "8px 8px 8px 20px", boxShadow: "var(--shadow)" }}>
          <Icon name="search" size={24} style={{ color: "var(--accent)" }} />
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder={lang === "ar" ? "رقم المادة، أو كلمة: مكافأة، إجازة، إشعار…" : "Article number or keyword…"}
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", font: "500 18px var(--text)", color: "var(--ink)" }} />
          <button onClick={onClose} className="act" style={{ flexShrink: 0 }}><Icon name="x" /></button>
        </div>

        {!nq && (
          <div style={{ marginTop: 28 }}>
            <Kicker style={{ marginBottom: 14 }}>{lang === "ar" ? "بحث شائع" : "Popular"}</Kicker>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
              {["مكافأة", "إجازة", "إشعار", "استقالة", "أجر إضافي", "فصل تعسفي", "٨٤"].map(k => (
                <button key={k} onClick={() => setQ(k)} style={{ background: "var(--paper-2)", border: "1px solid var(--hair)", borderRadius: 999, padding: "9px 16px", font: "500 14px var(--text)", color: "var(--ink-soft)" }}>{k}</button>
              ))}
            </div>
          </div>
        )}

        {nq && (
          <div style={{ marginTop: 22 }}>
            <div style={{ font: "500 13px var(--text)", color: "var(--ink-faint)", marginBottom: 12 }}>{toAr(results.length)} {lang === "ar" ? "نتيجة" : "results"}</div>
            <div style={{ display: "grid", gap: 10 }}>
              {results.map(({ a }) => (
                <button key={a.articleNumber} onClick={() => { go({ name: "article", num: a.articleNumber }); onClose(); }} style={{
                  display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: 18, alignItems: "center", textAlign: "start",
                  background: "var(--card)", border: "1px solid var(--hair)", borderRadius: 13, padding: "16px 20px",
                }}>
                  <span className="num" style={{ fontSize: 36, fontWeight: 800, color: "var(--accent)", minWidth: 60 }}>{toAr(a.articleNumber)}</span>
                  <span>
                    <span style={{ display: "block", font: "600 15px var(--text)", marginBottom: 4 }}>{a.chapter.title}</span>
                    <span style={{ display: "block", font: "400 13.5px var(--text)", color: "var(--ink-faint)", lineHeight: 1.7 }}>{hi(a.simplifiedAr)}</span>
                  </span>
                </button>
              ))}
              {results.length === 0 && <div style={{ textAlign: "center", padding: 50, color: "var(--ink-faint)" }}>{lang === "ar" ? "لا نتائج. جرّب كلمة أخرى." : "No results."}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* shared bits */
function PageHead({ kicker, title, sub, lang }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <Kicker style={{ marginBottom: 14 }}>{kicker}</Kicker>
      <h1 className="display" style={{ fontSize: "clamp(34px,6vw,64px)", fontWeight: 900, margin: "0 0 14px", letterSpacing: "-.02em" }}>{title}</h1>
      {sub && <p style={{ color: "var(--ink-soft)", fontSize: "clamp(16px,2vw,19px)", maxWidth: 640, margin: 0, lineHeight: 1.8 }}>{sub}</p>}
    </div>
  );
}
function FilterChip({ active, onClick, label }) {
  return <button onClick={onClick} style={{ background: active ? "var(--accent)" : "transparent", color: active ? "var(--paper)" : "var(--ink-soft)", border: `1px solid ${active ? "var(--accent)" : "var(--hair-strong)"}`, borderRadius: 999, padding: "9px 16px", font: "600 13.5px var(--text)", whiteSpace: "nowrap" }}>{label}</button>;
}

Object.assign(window, { Browse, ChapterDetail, IndexView, Scenarios, ScenarioDetail, Calculators, Glossary, Timeline, Bookmarks, Search, PageHead, FilterChip });
