// البحث — overlay ضبابي ملء الشاشة، منقول عقدة-بعقدة من screens2.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { useGo } from "../components/handoff/useGo.js";
import { Icon, Kicker } from "../components/handoff/primitives.jsx";
import { LABOR, toAr } from "../data/labor.js";

const stripTashkeel = (s) => (s || "").replace(/[ً-ْـ]/g, "");

export default function Search() {
  const { lang } = useI18n();
  const go = useGo();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);
  const onClose = () => navigate("/");

  const ready = LABOR.articles.filter((a) => !a.status);
  const nq = stripTashkeel(q.trim());
  const results = !nq ? [] : ready.map((a) => {
    const hay = stripTashkeel([a.articleNumber, a.officialText, a.simplifiedAr, (a.keywords || []).join(" "), a.chapter.title].join(" "));
    const score = hay.includes(nq) ? (String(a.articleNumber) === nq ? 100 : 1) : 0;
    return { a, score };
  }).filter((r) => r.score > 0).sort((x, y) => y.score - x.score);

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
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder={lang === "ar" ? "رقم المادة، أو كلمة: مكافأة، إجازة، إشعار…" : "Article number or keyword…"}
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", font: "500 18px var(--text)", color: "var(--ink)" }} />
          <button onClick={onClose} className="act" style={{ flexShrink: 0 }}><Icon name="x" /></button>
        </div>

        {!nq && (
          <div style={{ marginTop: 28 }}>
            <Kicker style={{ marginBottom: 14 }}>{lang === "ar" ? "بحث شائع" : "Popular"}</Kicker>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
              {["مكافأة", "إجازة", "إشعار", "استقالة", "أجر إضافي", "فصل تعسفي", "٨٤"].map((k) => (
                <button key={k} onClick={() => setQ(k)} style={{ background: "var(--paper-2)", border: "1px solid var(--hair)", borderRadius: 999, padding: "9px 16px", font: "500 14px var(--text)", color: "var(--ink-soft)", cursor: "pointer" }}>{k}</button>
              ))}
            </div>
          </div>
        )}

        {nq && (
          <div style={{ marginTop: 22 }}>
            <div style={{ font: "500 13px var(--text)", color: "var(--ink-faint)", marginBottom: 12 }}>{toAr(results.length)} {lang === "ar" ? "نتيجة" : "results"}</div>
            <div style={{ display: "grid", gap: 10 }}>
              {results.map(({ a }) => (
                <button key={a.id} onClick={() => { go({ name: "article", num: a.articleNumber }); }} style={{
                  display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: 18, alignItems: "center", textAlign: "start",
                  background: "var(--card)", border: "1px solid var(--hair)", borderRadius: 13, padding: "16px 20px", cursor: "pointer",
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
