import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { getCalculator } from "../data/calculators.js";
import { getArticle } from "../data/articles.js";
import { displayArticleNumber } from "../lib/format.js";
import NotFound from "./NotFound.jsx";

export default function CalculatorView() {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const calc = getCalculator(id);

  const [values, setValues] = useState(() =>
    calc
      ? Object.fromEntries(
          calc.inputs.map((i) => [i.name, i.type === "select" ? i.options[0].value : ""])
        )
      : {}
  );

  const result = useMemo(() => (calc ? calc.compute(values) : null), [calc, values]);
  if (!calc) return <NotFound />;

  const set = (name, v) => setValues((prev) => ({ ...prev, [name]: v }));

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
      <nav className="flex items-center gap-2 text-[var(--fz-xs)] text-[var(--c-ink-faint)]">
        <Link to="/calculators" className="hover:text-[var(--c-accent)]">
          {t("calculators_title")}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-[var(--c-ink-soft)]">{calc.title}</span>
      </nav>

      <header className="reveal mt-6 border-b border-[var(--c-rule)] pb-6">
        <h1 className="font-display text-[var(--fz-2xl)] font-bold leading-tight">{calc.title}</h1>
        <p className="mt-2 text-[var(--fz-base)] text-[var(--c-ink-soft)]">{calc.lead}</p>
      </header>

      {/* المدخلات */}
      <div className="mt-8 space-y-5">
        {calc.inputs.map((input) => (
          <label key={input.name} className="block">
            <span className="mb-2 block text-[var(--fz-sm)] text-[var(--c-ink-soft)]">
              {input.label}
            </span>
            {input.type === "select" ? (
              <select
                value={values[input.name]}
                onChange={(e) => set(input.name, e.target.value)}
                className="w-full rounded-[var(--rad-md)] border border-[var(--c-rule)] bg-[var(--c-paper-2)] px-4 py-3 text-[var(--fz-base)] text-[var(--c-ink)] outline-none transition-colors focus:border-[var(--c-accent)]"
              >
                {input.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                inputMode="decimal"
                min={input.min}
                max={input.max}
                step={input.step}
                value={values[input.name]}
                onChange={(e) => set(input.name, e.target.value)}
                placeholder="٠"
                className="w-full rounded-[var(--rad-md)] border border-[var(--c-rule)] bg-[var(--c-paper-2)] px-4 py-3 text-[var(--fz-lg)] text-[var(--c-ink)] outline-none transition-colors placeholder:text-[var(--c-ink-faint)] focus:border-[var(--c-accent)]"
              />
            )}
          </label>
        ))}
      </div>

      {/* النتيجة */}
      {result ? (
        <div className="reveal mt-8 overflow-hidden rounded-[var(--rad-md)] border border-[var(--c-accent)]">
          <div className="bg-[var(--c-accent-soft)] p-6 text-center">
            <p className="eyebrow text-[var(--c-accent)]">{t("calc_result")}</p>
            <p className="font-display mt-2 text-[var(--fz-4xl)] font-black leading-none text-[var(--c-accent)]">
              {result.amount.toLocaleString("en-US", { maximumFractionDigits: 2 }).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)])}
              <span className="ms-2 text-[var(--fz-lg)] font-bold">{result.unit}</span>
            </p>
          </div>
          <dl className="divide-y divide-[var(--c-rule)] bg-[var(--c-paper)]">
            {result.breakdown.map((b, i) => (
              <div key={i} className="flex flex-wrap justify-between gap-2 px-5 py-3">
                <dt className="text-[var(--fz-sm)] text-[var(--c-ink-faint)]">{b.label}</dt>
                <dd className="text-[var(--fz-sm)] font-medium text-[var(--c-ink)]">{b.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        <p className="mt-8 rounded-[var(--rad-md)] border border-dashed border-[var(--c-rule)] bg-[var(--c-paper-2)] px-5 py-6 text-center text-[var(--fz-sm)] text-[var(--c-ink-faint)]">
          {t("calc_enter_values")}
        </p>
      )}

      {/* تنبيه + مصادر */}
      <div className="mt-6 rounded-[var(--rad-md)] border border-[var(--c-amend-soft)] bg-[var(--c-amend-soft)] p-4">
        <p className="text-[var(--fz-sm)] leading-relaxed text-[var(--c-ink-soft)]">
          <span className="font-display font-bold text-[var(--c-amend)]">⚠ حساب تقديري غير ملزم — </span>
          {t("calc_disclaimer")}
        </p>
      </div>

      <div className="mt-6">
        <p className="eyebrow mb-2">{t("calc_sources")}</p>
        <div className="flex flex-wrap gap-2">
          {calc.articleIds.map((aid) => {
            const a = getArticle(aid);
            if (!a) return null;
            return (
              <Link
                key={aid}
                to={`/article/${aid}`}
                className="font-display rounded-[var(--rad-sm)] border border-[var(--c-rule)] px-3 py-1.5 text-[var(--fz-sm)] text-[var(--c-ink-soft)] transition-colors hover:border-[var(--c-accent)] hover:text-[var(--c-ink)]"
              >
                {t("article_word")} {displayArticleNumber(a, lang)}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
