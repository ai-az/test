// شاشة بطاقة المشاركة — منقولة من SpecimenCard (app.jsx) المرجعي، مع توليد PNG عبر مولّدنا.
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { useGo } from "../components/handoff/useGo.js";
import { Icon, Kicker, Btn } from "../components/handoff/primitives.jsx";
import { toAr, findArticle } from "../data/labor.js";
import { downloadArticleCard } from "../lib/shareCard.js";

export default function CardView() {
  const { num } = useParams();
  const { lang } = useI18n();
  const go = useGo();
  const a = findArticle(num);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  if (!a || a.status === "pending") return null;

  const copyLink = () => {
    try { navigator.clipboard.writeText(`${location.origin}/article/${a.id}`); } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 1600);
  };
  const downloadPng = async () => {
    setSaving(true);
    await downloadArticleCard({ articleNumber: a.articleNumber, mukarrar: a.mukarrar, simplifiedAr: a.simplifiedAr, isAmended: a.isAmended }, toAr(num), lang);
    setSaving(false);
  };

  return (
    <div className="wrap" style={{ paddingTop: 38, maxWidth: 880 }}>
      <button onClick={() => go({ name: "article", num: a.id })} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "var(--ink-faint)", font: "500 13.5px var(--text)", padding: 0, marginBottom: 26, cursor: "pointer" }}>
        <Icon name={lang === "ar" ? "right" : "left"} size={16} />{lang === "ar" ? `العودة للمادة ${toAr(num)}` : `Back to article ${num}`}
      </button>
      <Kicker>{lang === "ar" ? "مشاركة" : "Share"}</Kicker>
      <h1 className="display" style={{ fontSize: "var(--t-xl)", fontWeight: 800, margin: "6px 0 6px" }}>{lang === "ar" ? "بطاقة المادة" : "Article card"}</h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: 28, maxWidth: 560, lineHeight: 1.8 }}>{lang === "ar" ? "بطاقة أنيقة بهوية الموقع، جاهزة للمشاركة في واتساب وتويتر." : "A shareable card in the site's identity."}</p>

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
            <p style={{ margin: "16px 0 0", fontSize: "clamp(15px,2.4vw,17px)", lineHeight: 1.85, opacity: .95 }}>{(a.simplifiedAr || "").slice(0, 130)}{(a.simplifiedAr || "").length > 130 ? "…" : ""}</p>
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
