import { Kicker } from "./primitives.jsx";
import { useGo } from "./useGo.js";
import { useI18n } from "../../i18n/I18nContext.jsx";
import { toAr } from "../../data/labor.js";
import { BRAND_SVG } from "../../data/brandIcons.js";

function FootCol({ title, items, go }) {
  return (
    <div>
      <div className="kicker" style={{ marginBottom: 14 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map(([label, key]) => (
          <button key={key} onClick={() => go({ name: key })} style={{ background: "none", border: "none", textAlign: "start", padding: 0, font: "500 14.5px var(--text)", color: "var(--ink-soft)", cursor: "pointer" }}>{label}</button>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const go = useGo();
  const { lang } = useI18n();
  return (
    <footer className="no-print" style={{ marginTop: 110, borderTop: "1px solid var(--hair)", background: "var(--paper-2)" }}>
      <div className="wrap" style={{ paddingBlock: 56 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ maxWidth: 460 }}>
            <div className="display" style={{ fontSize: 30, fontWeight: 800, marginBottom: 12 }}>{lang === "ar" ? "نظام العمل" : "Labor Law"}</div>
            <p style={{ color: "var(--ink-soft)", fontSize: 14.5, margin: 0, lineHeight: 1.85 }}>
              {lang === "ar"
                ? "مرجع تفاعلي يبسّط مــــواد نظام العمل السعودي عبر شرح ومثال عملي لكل مادة. متاح للجميع دون تسجيل."
                : "An interactive reference that simplifies the Saudi Labor Law with a plain explanation and a real example for every article."}
            </p>
          </div>
          <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
            <FootCol title={lang === "ar" ? "تصفّح" : "Browse"} items={[[lang === "ar" ? "الأبواب" : "Chapters", "browse"], [lang === "ar" ? "الفهرس" : "Index", "index"], [lang === "ar" ? "حسب الموقف" : "By situation", "scenarios"]]} go={go} />
            <FootCol title={lang === "ar" ? "أدوات" : "Tools"} items={[[lang === "ar" ? "الحاسبات" : "Calculators", "calc"], [lang === "ar" ? "التعديلات" : "Amendments", "timeline"], [lang === "ar" ? "المسرد" : "Glossary", "glossary"]]} go={go} />
          </div>
        </div>
        <hr className="hairline" style={{ margin: "40px 0 22px" }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center", fontSize: 12.5, color: "var(--ink-faint)" }}>
          <p style={{ margin: 0, maxWidth: 720, lineHeight: 1.7, fontWeight: 400 }}>
            {lang === "ar"
              ? "تنبيه قانوني: هذا الموقع لأغراض تعريفية وتثقيفية فقط ولا يُعدّ استشارة قانونية. النص الرسمي الساري هو المنشور في المصدر الرسمي. الشروح والأمثلة تبسيطية غير رسمية."
              : "Disclaimer: This site is for informational purposes only and is not legal advice. The official binding text is the one published by the official source."}
          </p>
          <span style={{ fontWeight: 300, fontSize: "12px" }}>© {toAr(1447)}هـ</span>
        </div>

        <div style={{ marginTop: 30, paddingTop: 26, borderTop: "1px solid var(--hair)", textAlign: "center" }}>
          <div className="kicker" style={{ marginBottom: 8, fontWeight: 400, fontSize: "12px" }}>{lang === "ar" ? "صُنع بواسطة :" : "Designed & developed by"}</div>
          <div className="display" style={{ color: "var(--ink)", fontFamily: '"Thmanyah Sans"', fontWeight: 400, fontSize: "12px" }}>عبدالعزيز الدوسري</div>
          <div style={{ font: "500 11px var(--text)", letterSpacing: ".06em", marginTop: 1, color: "var(--ink)", fontWeight: 400, fontSize: "12px" }}>Abdulaziz Aldawsari</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginTop: 14 }}>
            <a className="social" href="https://abdulazizd.com" target="_blank" rel="noopener noreferrer" title="Abdulazizd.com" aria-label="Website">
              <span className="social-ico" dangerouslySetInnerHTML={{ __html: BRAND_SVG.website || "" }} />
            </a>
            <a className="social" href="https://www.linkedin.com/in/abdulaziiiz" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">
              <span className="social-ico" dangerouslySetInnerHTML={{ __html: BRAND_SVG.linkedin || "" }} />
            </a>
            <a className="social" href="https://wa.me/966567787030" target="_blank" rel="noopener noreferrer" title="WhatsApp" aria-label="WhatsApp">
              <span className="social-ico" dangerouslySetInnerHTML={{ __html: BRAND_SVG.whatsapp || "" }} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
