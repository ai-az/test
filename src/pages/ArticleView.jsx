import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useI18n } from "../i18n/I18nContext.jsx";
import { getArticle, getAdjacentArticle, articles } from "../data/articles.js";
import { getSlot } from "../data/articleIndex.js";
import { getChapter } from "../data/chapters.js";
import { LAW_META } from "../data/chapters.js";
import { useBookmarks } from "../lib/storage.js";
import { displayArticleNumber, ordinalAr, toArabicDigits } from "../lib/format.js";
import { GLOSSARY_ARTICLE } from "../data/glossary.js";
import GlossaryText from "../components/GlossaryText.jsx";
import { downloadArticleCard } from "../lib/shareCard.js";
import NotFound from "./NotFound.jsx";

export default function ArticleView() {
  const { num } = useParams();
  const { t, lang } = useI18n();
  const article = getArticle(num);
  const { has, toggle } = useBookmarks();
  const [showOriginal, setShowOriginal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!article) return <PendingArticle id={num} />;

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
      <nav className="flex flex-wrap items-center gap-2 text-[var(--fz-xs)] text-[var(--c-ink-faint)]">
        <Link to="/chapters" className="hover:text-[var(--c-accent)]">
          {t("nav_chapters")}
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          to={`/chapter/${article.chapter.number}`}
          className="hover:text-[var(--c-accent)]"
        >
          {t("chapter_word")} {ordinalAr(article.chapter.number)} · {article.chapter.title}
        </Link>
        {article.section && (
          <>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--c-ink-soft)]">{article.section.title}</span>
          </>
        )}
      </nav>

      {/* Specimen header: huge numeral */}
      <header className="reveal mt-6 flex flex-wrap items-end justify-between gap-6 border-b border-[var(--c-rule)] pb-8">
        <div className="flex items-end gap-4">
          <span className="specimen-numeral text-[var(--c-accent)]">{numLabel}</span>
          <div className="pb-2">
            <p className="eyebrow">{t("article_word")}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {article.isAmended && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--c-amend-soft)] px-3 py-1 text-[var(--fz-xs)] text-[var(--c-amend)]">
                  <span className="size-1.5 rounded-full bg-[var(--c-amend)]" />
                  {t("amended")}
                </span>
              )}
              {article.lastUpdated && (
                <Link to="/timeline" className="badge-live no-print" title={t("timeline_title")}>
                  <span className="live-dot" />
                  {t("last_updates")} · {toArabicDigits(article.lastUpdated)}هـ
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="no-print flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggle(id)}
            aria-pressed={bookmarked}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[var(--fz-xs)] transition-colors ${
              bookmarked
                ? "border-[var(--c-accent)] bg-[var(--c-accent-soft)] text-[var(--c-accent)]"
                : "border-[var(--c-rule)] text-[var(--c-ink-soft)] hover:border-[var(--c-accent)] hover:text-[var(--c-ink)]"
            }`}
          >
            <BookmarkIcon filled={bookmarked} />
            {bookmarked ? t("bookmark_remove") : t("bookmark_add")}
          </button>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--c-rule)] px-3.5 py-2 text-[var(--fz-xs)] text-[var(--c-ink-soft)] transition-colors hover:border-[var(--c-accent)] hover:text-[var(--c-ink)]"
          >
            {copied ? t("copied") : t("copy")}
          </button>
          <button
            type="button"
            onClick={() => downloadArticleCard(article, numLabel, lang)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--c-rule)] px-3.5 py-2 text-[var(--fz-xs)] text-[var(--c-ink-soft)] transition-colors hover:border-[var(--c-accent)] hover:text-[var(--c-ink)]"
          >
            {t("share")}
          </button>
        </div>
      </header>

      {/* Official text */}
      <section className="mt-9">
        <SectionLabel>{t("official_text")}</SectionLabel>
        <div className="mt-3 rounded-[var(--rad-md)] border border-[var(--c-rule)] bg-[var(--c-paper-2)] p-6">
          <p className="text-[var(--fz-lg)] leading-[var(--lh-prose)] text-[var(--c-ink)]">
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
              className="text-[var(--fz-xs)] text-[var(--c-ink-faint)] underline decoration-dashed underline-offset-4 transition-colors hover:text-[var(--c-accent)]"
            >
              {t("show_original")} {showOriginal ? "▲" : "▼"}
            </button>
            {showOriginal && (
              <div className="mt-2 rounded-[var(--rad-sm)] border border-dashed border-[var(--c-rule)] bg-[var(--c-paper)] p-4 text-[var(--fz-sm)] leading-relaxed text-[var(--c-ink-soft)]">
                {article.originalText || (
                  <span className="italic text-[var(--c-ink-faint)]">
                    {t("original_pending")}
                  </span>
                )}
                {article.amendmentInfo && (
                  <p className="mt-3 border-t border-[var(--c-rule)] pt-3 text-[var(--fz-xs)] text-[var(--c-ink-faint)]">
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
          <p className="mt-3 border-e-2 border-[var(--c-accent)] bg-[var(--c-accent-soft)] py-3 pe-4 ps-5 text-[var(--fz-base)] leading-[var(--lh-prose)] text-[var(--c-ink)]">
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
          <div className="mt-3 overflow-hidden rounded-[var(--rad-md)] border border-[var(--c-rule)]">
            <div className="border-b border-[var(--c-rule)] bg-[var(--c-paper)] p-5">
              <p className="eyebrow mb-1.5">{t("scenario")}</p>
              <p className="text-[var(--fz-base)] leading-relaxed text-[var(--c-ink)]">
                {article.example.scenario}
              </p>
            </div>
            <div className="bg-[var(--c-paper-2)] p-5">
              <p className="eyebrow mb-1.5 text-[var(--c-accent)]">{t("outcome")}</p>
              <p className="text-[var(--fz-base)] leading-relaxed text-[var(--c-ink)]">
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
                className="rounded-full border border-[var(--c-rule)] px-3 py-1 text-[var(--fz-xs)] text-[var(--c-ink-soft)]"
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
                  className="font-display rounded-[var(--rad-sm)] border border-[var(--c-rule)] px-3 py-1.5 text-[var(--fz-sm)] text-[var(--c-ink-soft)] transition-colors hover:border-[var(--c-accent)] hover:text-[var(--c-ink)]"
                >
                  {t("article_word")} {displayArticleNumber(articles[r], lang)}
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* أدوات الباحث: رابط مباشر · اقتباس نظامي · طباعة/PDF */}
      <section className="no-print mt-9">
        <SectionLabel>{t("tools")}</SectionLabel>
        <div className="mt-3 flex flex-wrap gap-2">
          <CopyButton label={t("copy_link")} getText={() => window.location.href} />
          <CopyButton
            label={t("copy_citation")}
            getText={() =>
              `${t("article_word")} (${numLabel}) من ${LAW_META.titleAr} الصادر بـ${LAW_META.decree} وتاريخ ${LAW_META.decreeDate}. ${window.location.href}`
            }
          />
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--c-rule)] px-3.5 py-2 text-[var(--fz-xs)] text-[var(--c-ink-soft)] transition-colors hover:border-[var(--c-accent)] hover:text-[var(--c-ink)]"
          >
            {t("print_pdf")}
          </button>
        </div>
      </section>

      {/* Prev / next */}
      <nav className="no-print mt-12 flex items-stretch justify-between gap-3 border-t border-[var(--c-rule)] pt-6">
        <AdjacentLink to={prev} dir="prev" label={t("prev")} />
        <AdjacentLink to={next} dir="next" label={t("next")} />
      </nav>
    </article>
  );
}

function CopyButton({ label, getText }) {
  const { t } = useI18n();
  const [done, setDone] = useState(false);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {
      /* ignore */
    }
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--c-rule)] px-3.5 py-2 text-[var(--fz-xs)] text-[var(--c-ink-soft)] transition-colors hover:border-[var(--c-accent)] hover:text-[var(--c-ink)]"
    >
      {done ? t("copied") : label}
    </button>
  );
}

// مادة موجودة في بنية النظام لكن نصّها قيد الإدخال.
function PendingArticle({ id }) {
  const { t, lang } = useI18n();
  const slot = getSlot(id);
  if (!slot) return <NotFound />;
  const chapter = getChapter(slot.chapter);
  const label = displayArticleNumber({ articleNumber: slot.n, mukarrar: slot.mukarrar }, lang);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <nav className="flex flex-wrap items-center gap-2 text-[var(--fz-xs)] text-[var(--c-ink-faint)]">
        <Link to="/chapters" className="hover:text-[var(--c-accent)]">
          {t("nav_chapters")}
        </Link>
        {chapter && (
          <>
            <span aria-hidden="true">/</span>
            <Link to={`/chapter/${chapter.number}`} className="hover:text-[var(--c-accent)]">
              {t("chapter_word")} {ordinalAr(chapter.number)} · {chapter.title}
            </Link>
          </>
        )}
      </nav>

      <div className="reveal mt-10 flex flex-col items-center rounded-[var(--rad-md)] border border-dashed border-[var(--c-rule)] bg-[var(--c-paper-2)] px-6 py-16 text-center">
        <span className="specimen-numeral text-[var(--c-ink-faint)]">{label}</span>
        <p className="eyebrow mt-2">{t("article_word")} {label}</p>
        <p className="mt-4 max-w-md text-[var(--fz-base)] text-[var(--c-ink-soft)]">
          {t("article_pending_full")}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {chapter && (
            <Link
              to={`/chapter/${chapter.number}`}
              className="rounded-full bg-[var(--c-ink)] px-5 py-2.5 text-[var(--fz-sm)] text-[var(--c-paper)] transition-transform hover:-translate-y-0.5"
            >
              {chapter.title}
            </Link>
          )}
          <Link
            to="/coverage"
            className="rounded-full border border-[var(--c-rule)] px-5 py-2.5 text-[var(--fz-sm)] text-[var(--c-ink-soft)] transition-colors hover:border-[var(--c-accent)] hover:text-[var(--c-ink)]"
          >
            {t("coverage_title")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children, accent }) {
  return (
    <h2
      className={`font-display flex items-center gap-2 text-[var(--fz-sm)] font-bold ${
        accent ? "text-[var(--c-accent)]" : "text-[var(--c-ink)]"
      }`}
    >
      <span
        className={`h-3 w-1 rounded-full ${
          accent ? "bg-[var(--c-accent)]" : "bg-[var(--c-ink-faint)]"
        }`}
      />
      {children}
    </h2>
  );
}

function InformalBadge() {
  const { t } = useI18n();
  return (
    <span className="rounded-full bg-[var(--c-paper-3)] px-2.5 py-0.5 text-[var(--fz-xs)] text-[var(--c-ink-faint)]">
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
      className={`group flex flex-1 flex-col gap-1 rounded-[var(--rad-md)] border border-[var(--c-rule)] p-4 transition-colors hover:border-[var(--c-accent)] ${
        dir === "next" ? "items-start text-start" : "items-end text-end"
      }`}
    >
      <span className="text-[var(--fz-xs)] text-[var(--c-ink-faint)]">
        {arrow} {label}
      </span>
      <span className="font-display text-[var(--fz-lg)] font-bold text-[var(--c-ink)] transition-colors group-hover:text-[var(--c-accent)]">
        {displayArticleNumber(target, lang)}
      </span>
    </Link>
  );
}
