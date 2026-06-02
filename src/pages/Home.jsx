import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { LAW_META, chapters } from "../data/chapters.js";
import { enteredCount } from "../data/articles.js";
import { displayNumber, ordinalAr } from "../lib/format.js";

export default function Home() {
  const { t, lang } = useI18n();

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      {/* ── Specimen cover ─────────────────────────────── */}
      <section className="reveal border-b border-[var(--color-rule)] py-14 sm:py-20">
        <p className="eyebrow">{t("cover_kicker")}</p>

        <h1 className="font-display mt-5 font-black leading-[0.92] text-[var(--color-ink)]">
          <span className="block text-[var(--text-display-xl)]">نظام</span>
          <span className="block text-[var(--text-display-xl)] text-[var(--color-accent)]">
            العمل
          </span>
        </h1>

        <p className="mt-7 max-w-xl text-[var(--text-lg)] leading-relaxed text-[var(--color-ink-soft)]">
          {t("cover_lead")}
        </p>

        <div className="mt-10 flex flex-wrap items-stretch gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-rule)]">
          <Stat value={displayNumber(LAW_META.chapterCount, lang)} label={t("stat_chapters")} />
          <Stat value={displayNumber(LAW_META.articleCount, lang)} label={t("stat_articles")} />
          <Stat
            value={displayNumber(enteredCount, lang)}
            label={t("articles_entered")}
            accent
          />
        </div>

        <div className="mt-9">
          <Link
            to="/chapters"
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-[var(--text-sm)] text-[var(--color-paper)] transition-transform duration-150 hover:-translate-y-0.5"
          >
            {t("cover_enter")}
            <span className="transition-transform duration-150 group-hover:-translate-x-1 rtl:rotate-180">
              →
            </span>
          </Link>
        </div>
      </section>

      {/* ── Chapter index, specimen-style ──────────────── */}
      <section className="py-12 sm:py-16">
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-[var(--text-2xl)] font-bold">
            {t("chapters_title")}
          </h2>
          <span className="text-[var(--text-xs)] text-[var(--color-ink-faint)]">
            {t("phase_note")}
          </span>
        </div>

        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-rule)] sm:grid-cols-2">
          {chapters.map((c) => (
            <li key={c.number}>
              <Link
                to={`/chapter/${c.number}`}
                className="group flex h-full items-start gap-4 bg-[var(--color-paper)] p-5 transition-colors duration-150 hover:bg-[var(--color-paper-2)]"
              >
                <span className="font-display min-w-10 text-[var(--text-2xl)] font-black leading-none text-[var(--color-ink-faint)] transition-colors group-hover:text-[var(--color-accent)]">
                  {displayNumber(c.number, lang)}
                </span>
                <span className="min-w-0">
                  <span className="eyebrow block">
                    {t("chapter_word")} {ordinalAr(c.number) || c.number}
                  </span>
                  <span className="mt-1 block text-[var(--text-base)] leading-snug text-[var(--color-ink)]">
                    {c.title}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ value, label, accent }) {
  return (
    <div className="flex min-w-[7rem] flex-1 flex-col gap-1 bg-[var(--color-paper)] px-5 py-4">
      <span
        className={`font-display text-[var(--text-4xl)] font-black leading-none ${
          accent ? "text-[var(--color-accent)]" : "text-[var(--color-ink)]"
        }`}
      >
        {value}
      </span>
      <span className="text-[var(--text-xs)] text-[var(--color-ink-faint)]">{label}</span>
    </div>
  );
}
