import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { amendments } from "../data/amendments.js";
import { getArticle } from "../data/articles.js";
import { displayArticleNumber } from "../lib/format.js";

export default function Timeline() {
  const { t, lang } = useI18n();
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="reveal mb-10 border-b border-[var(--color-rule)] pb-8">
        <p className="eyebrow">{t("siteName")}</p>
        <h1 className="font-display mt-3 text-[var(--text-4xl)] font-black leading-none">
          {t("timeline_title")}
        </h1>
        <p className="mt-4 max-w-xl text-[var(--text-base)] text-[var(--color-ink-soft)]">
          {t("timeline_lead")}
        </p>
      </header>

      <ol className="relative ms-3 border-s border-[var(--color-rule)]">
        {amendments.map((a) => (
          <li key={a.decree} className="relative ms-8 pb-10 last:pb-0">
            <span
              className={`absolute -start-[41px] top-1 grid size-5 place-items-center rounded-full border-2 ${
                a.kind === "origin"
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                  : "border-[var(--color-accent)] bg-[var(--color-paper)]"
              }`}
            />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-[var(--text-2xl)] font-black text-[var(--color-accent)]">
                {a.decree}
              </span>
              <span className="text-[var(--text-sm)] text-[var(--color-ink-faint)]">{a.date}</span>
              {a.kind === "origin" && (
                <span className="rounded-full bg-[var(--color-accent-soft)] px-2.5 py-0.5 text-[var(--text-xs)] text-[var(--color-accent)]">
                  {t("timeline_origin")}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[var(--text-base)] leading-relaxed text-[var(--color-ink-soft)]">
              {a.note}
            </p>
            {a.articleIds.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {a.articleIds.map((aid) => {
                  const art = getArticle(aid);
                  return (
                    <Link
                      key={aid}
                      to={`/article/${aid}`}
                      className="font-display rounded-[var(--radius-sm)] border border-[var(--color-rule)] px-2.5 py-1 text-[var(--text-xs)] text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-ink)]"
                    >
                      {t("article_word")} {art ? displayArticleNumber(art, lang) : aid}
                    </Link>
                  );
                })}
              </div>
            )}
          </li>
        ))}
      </ol>

      <p className="mt-8 text-[var(--text-xs)] leading-relaxed text-[var(--color-ink-faint)]">
        {t("timeline_note")}
      </p>
    </div>
  );
}
