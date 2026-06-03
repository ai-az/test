import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useI18n } from "../i18n/I18nContext.jsx";
import { getArticle, getAdjacentArticle, articles } from "../data/articles.js";
import { LAW_META } from "../data/chapters.js";
import { useBookmarks } from "../lib/storage.js";
import { displayArticleNumber, ordinalAr } from "../lib/format.js";
import { GLOSSARY_ARTICLE } from "../data/glossary.js";
import GlossaryText from "../components/GlossaryText.jsx";
import NotFound from "./NotFound.jsx";

export default function ArticleView() {
  const { num } = useParams();
  const { t, lang } = useI18n();
  const article = getArticle(num);
  const { has, toggle } = useBookmarks();
  const [showOriginal, setShowOriginal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!article) return <NotFound />;

  const id = article.id;
  const numLabel = displayArticleNumber(article, lang);
  const prev = getAdjacentArticle(id, "prev");
  const next = getAdjacentArticle(id, "next");
  const bookmarked = has(id);

  const copy = async () => {
    const ref = `${t("article_word")} ${numLabel} — ${LAW_META.titleAr} (${LAW_META.decree})`;
    try {
      await navigator.clipboard.writeText(`${article.officialText}\n\n${ref}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <article className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      {/* Breadcrumb: الباب ← الفصل ← المادة */}
      <nav className="flex flex-wrap items-center gap-2 text-[var(--text-xs)] text-[var(--color-ink-faint)]">
        <Link to="/chapters" className="hover:text-[var(--color-accent)]">
          {t("nav_chapters")}
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          to={`/chapter/${article.chapter.number}`}
          className="hover:text-[var(--color-accent)]"
        >
          {t("chapter_word")} {ordinalAr(article.chapter.number)} · {article.chapter.title}
        </Link>
        {article.section && (
          <>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--color-ink-soft)]">{article.section.title}</span>
          </>
        )}
      </nav>

      {/* Specimen header: huge numeral */}
      <header className="reveal mt-6 flex flex-wrap items-end justify-between gap-6 border-b border-[var(--color-rule)] pb-8">
        <div className="flex items-end gap-4">
          <span className="specimen-numeral">{numLabel}</span>
          <div className="pb-2">
            <p className="eyebrow">{t("article_word")}</p>
            {article.isAmended && (
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-amend-soft)] px-3 py-1 text-[var(--text-xs)] text-[var(--color-amend)]">
                <span className="size-1.5 rounded-full bg-[var(--color-amend)]" />
                {t("amended")}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggle(id)}
            aria-pressed={bookmarked}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[var(--text-xs)] transition-colors ${
              bookmarked
                ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                : "border-[var(--color-rule)] text-[var(--color-ink-soft)] hover:border-[var(--color-accent)] hover:text-[var(--color-ink)]"
            }`}
          >
            <BookmarkIcon filled={bookmarked} />
            {bookmarked ? t("bookmark_remove") : t("bookmark_add")}
          </button>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-rule)] px-3.5 py-2 text-[var(--text-xs)] text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-ink)]"
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
      </header>

      {/* Official text */}
      <section className="mt-9">
        <SectionLabel>{t("official_text")}</SectionLabel>
        <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6">
          <p className="text-[var(--text-lg)] leading-[var(--leading-prose)] text-[var(--color-ink)]">
            <GlossaryText
              text={article.officialText}
              enableTooltips={article.id !== GLOSSARY_ARTICLE}
            />
          </p>
        </div>

        {article.isAmended && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowOriginal((v) => !v)}
              className="text-[var(--text-xs)] text-[var(--color-ink-faint)] underline decoration-dashed underline-offset-4 transition-colors hover:text-[var(--color-accent)]"
            >
              {t("show_original")} {showOriginal ? "▲" : "▼"}
            </button>
            {showOriginal && (
              <div className="mt-2 rounded-[var(--radius-sm)] border border-dashed border-[var(--color-rule)] bg-[var(--color-paper)] p-4 text-[var(--text-sm)] leading-relaxed text-[var(--color-ink-soft)]">
                {article.originalText || (
                  <span className="italic text-[var(--color-ink-faint)]">
                    {t("original_pending")}
                  </span>
                )}
                {article.amendmentInfo && (
                  <p className="mt-3 border-t border-[var(--color-rule)] pt-3 text-[var(--text-xs)] text-[var(--color-ink-faint)]">
                    {article.amendmentInfo}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ببساطة — simplified (informal) */}
      {article.simplifiedAr && (
        <section className="mt-9">
          <div className="flex items-center justify-between gap-3">
            <SectionLabel accent>{t("simply")}</SectionLabel>
            <InformalBadge />
          </div>
          <p className="mt-3 border-e-2 border-[var(--color-accent)] bg-[var(--color-accent-soft)] py-3 pe-4 ps-5 text-[var(--text-base)] leading-[var(--leading-prose)] text-[var(--color-ink)]">
            {article.simplifiedAr}
          </p>
        </section>
      )}

      {/* مثال عملي — the heart of the idea */}
      {article.example && (
        <section className="mt-9">
          <div className="flex items-center justify-between gap-3">
            <SectionLabel>{t("example")}</SectionLabel>
            <InformalBadge />
          </div>
          <div className="mt-3 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-rule)]">
            <div className="border-b border-[var(--color-rule)] bg-[var(--color-paper)] p-5">
              <p className="eyebrow mb-1.5">{t("scenario")}</p>
              <p className="text-[var(--text-base)] leading-relaxed text-[var(--color-ink)]">
                {article.example.scenario}
              </p>
            </div>
            <div className="bg-[var(--color-paper-2)] p-5">
              <p className="eyebrow mb-1.5 text-[var(--color-accent)]">{t("outcome")}</p>
              <p className="text-[var(--text-base)] leading-relaxed text-[var(--color-ink)]">
                {article.example.outcome}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Keywords */}
      {article.keywords?.length > 0 && (
        <section className="mt-9">
          <SectionLabel>{t("keywords")}</SectionLabel>
          <div className="mt-3 flex flex-wrap gap-2">
            {article.keywords.map((k) => (
              <span
                key={k}
                className="rounded-full border border-[var(--color-rule)] px-3 py-1 text-[var(--text-xs)] text-[var(--color-ink-soft)]"
              >
                {k}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Related */}
      {article.relatedArticles?.length > 0 && (
        <section className="mt-9">
          <SectionLabel>{t("related")}</SectionLabel>
          <div className="mt-3 flex flex-wrap gap-2">
            {article.relatedArticles
              .filter((r) => articles[r])
              .map((r) => (
                <Link
                  key={r}
                  to={`/article/${r}`}
                  className="font-display rounded-[var(--radius-sm)] border border-[var(--color-rule)] px-3 py-1.5 text-[var(--text-sm)] text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-ink)]"
                >
                  {t("article_word")} {displayArticleNumber(articles[r], lang)}
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* Prev / next */}
      <nav className="mt-12 flex items-stretch justify-between gap-3 border-t border-[var(--color-rule)] pt-6">
        <AdjacentLink to={prev} dir="prev" label={t("prev")} />
        <AdjacentLink to={next} dir="next" label={t("next")} />
      </nav>
    </article>
  );
}

function SectionLabel({ children, accent }) {
  return (
    <h2
      className={`font-display flex items-center gap-2 text-[var(--text-sm)] font-bold ${
        accent ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"
      }`}
    >
      <span
        className={`h-3 w-1 rounded-full ${
          accent ? "bg-[var(--color-accent)]" : "bg-[var(--color-ink-faint)]"
        }`}
      />
      {children}
    </h2>
  );
}

function InformalBadge() {
  const { t } = useI18n();
  return (
    <span className="rounded-full bg-[var(--color-paper-3)] px-2.5 py-0.5 text-[var(--text-xs)] text-[var(--color-ink-faint)]">
      {t("informal_badge")}
    </span>
  );
}

function BookmarkIcon({ filled }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 3h12v18l-6-4-6 4V3Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AdjacentLink({ to, dir, label }) {
  const { lang } = useI18n();
  const target = to ? getArticle(to) : null;
  if (!target) return <span className="flex-1" aria-hidden="true" />;
  const arrow = dir === "next" ? "←" : "→";
  return (
    <Link
      to={`/article/${target.id}`}
      className={`group flex flex-1 flex-col gap-1 rounded-[var(--radius-md)] border border-[var(--color-rule)] p-4 transition-colors hover:border-[var(--color-accent)] ${
        dir === "next" ? "items-start text-start" : "items-end text-end"
      }`}
    >
      <span className="text-[var(--text-xs)] text-[var(--color-ink-faint)]">
        {arrow} {label}
      </span>
      <span className="font-display text-[var(--text-lg)] font-bold text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
        {displayArticleNumber(target, lang)}
      </span>
    </Link>
  );
}
