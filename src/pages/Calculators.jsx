// الحاسبات — منقول عقدة-بعقدة من screens2.jsx (Calculators + CalcShell + Eos/Ot/Notice)
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { useGo } from "../components/handoff/useGo.js";
import { Icon, PageHead, FilterChip } from "../components/handoff/primitives.jsx";
import { toAr } from "../data/labor.js";

const inputStyle = { font: "600 17px var(--text)", padding: "12px 14px", borderRadius: 11, border: "1px solid var(--hair-strong)", background: "var(--paper)", color: "var(--ink)", width: "100%" };

function Field({ label, children }) {
  return <label style={{ display: "flex", flexDirection: "column", gap: 8 }}><span style={{ font: "600 13.5px var(--text)", color: "var(--ink-soft)" }}>{label}</span>{children}</label>;
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
          <button onClick={() => go({ name: "article", num: art })} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "1px solid var(--hair-strong)", borderRadius: 11, padding: "13px 16px", font: "600 14px var(--text)", color: "var(--ink)", cursor: "pointer" }}>
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
        <input type="number" value={wage} onChange={(e) => setWage(e.target.value)} style={inputStyle} />
      </Field>
      <Field label={lang === "ar" ? "سنوات الخدمة" : "Years of service"}>
        <input type="number" step="0.5" value={years} onChange={(e) => setYears(e.target.value)} style={inputStyle} />
      </Field>
      <Field label={lang === "ar" ? "سبب انتهاء العقد" : "Reason"}>
        <div style={{ display: "flex", gap: 8 }}>
          {[["end", lang === "ar" ? "انتهاء/إنهاء" : "Termination"], ["resign", lang === "ar" ? "استقالة" : "Resignation"]].map(([v, l]) => (
            <button key={v} onClick={() => setReason(v)} style={{ flex: 1, padding: "12px", borderRadius: 11, border: `1px solid ${reason === v ? "var(--accent)" : "var(--hair-strong)"}`, background: reason === v ? "var(--accent-tint)" : "transparent", color: reason === v ? "var(--accent)" : "var(--ink-soft)", font: "600 14px var(--text)", cursor: "pointer" }}>{l}</button>
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
        <input type="number" value={hourly} onChange={(e) => setHourly(e.target.value)} style={inputStyle} />
      </Field>
      <Field label={lang === "ar" ? "عدد الساعات الإضافية" : "Overtime hours"}>
        <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} style={inputStyle} />
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
            <button key={v} onClick={() => setPaid(v)} style={{ flex: 1, padding: "12px", borderRadius: 11, border: `1px solid ${paid === v ? "var(--accent)" : "var(--hair-strong)"}`, background: paid === v ? "var(--accent-tint)" : "transparent", color: paid === v ? "var(--accent)" : "var(--ink-soft)", font: "600 14px var(--text)", cursor: "pointer" }}>{l}</button>
          ))}
        </div>
      </Field>
      <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-faint)", lineHeight: 1.7 }}>{lang === "ar" ? "وفق المادة ٧٥ للعقود غير محددة المدة: إشعار كتابي قبل ٦٠ يوماً (الأجر الشهري) أو ٣٠ يوماً لغيره." : "Per Art. 75."}</p>
    </CalcShell>
  );
}

export default function Calculators() {
  const { id } = useParams();
  const { lang } = useI18n();
  const go = useGo();
  const [active, setActive] = useState(id || "eos");
  useEffect(() => { if (id) setActive(id); }, [id]);
  const tools = [
    { id: "eos", label: lang === "ar" ? "مكافأة نهاية الخدمة" : "End of service" },
    { id: "ot", label: lang === "ar" ? "الأجر الإضافي" : "Overtime" },
    { id: "leave", label: lang === "ar" ? "مدة الإشعار" : "Notice period" },
  ];
  return (
    <div className="wrap" style={{ paddingTop: 40, maxWidth: 880 }}>
      <PageHead kicker={lang === "ar" ? "أدوات" : "Tools"} title={lang === "ar" ? "الحاسبات" : "Calculators"}
        sub={lang === "ar" ? "كل حاسبة مرتبطة بمادتها. النتائج تقديرية غير ملزمة." : "Each calculator links to its article. Results are estimates."} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 30 }}>
        {tools.map((t) => <FilterChip key={t.id} active={active === t.id} onClick={() => setActive(t.id)} label={t.label} />)}
      </div>
      {active === "eos" && <EosCalc go={go} lang={lang} />}
      {active === "ot" && <OtCalc go={go} lang={lang} />}
      {active === "leave" && <NoticeCalc go={go} lang={lang} />}
    </div>
  );
}
