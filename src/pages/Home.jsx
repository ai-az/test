import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { LAW_META, chapters } from "../data/chapters.js";
import { getEnteredCount } from "../data/articles.js";
import { displayNumber, ordinalAr } from "../lib/format.js";

export default function Home() {
  const { t, lang } = useI18n();

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      {/* ── Specimen cover ─────────────────────────────── */}
      <section className="reveal border-b border-[var(--c-rule)] py-14 sm:py-20">
        <p className="eyebrow">{t("cover_kicker")}</p>

        <h1 className="font-display mt-5 font-black leading-[0.92] text-[var(--c-ink)]">
          <span className="block text-[var(--fz-display-xl)]">نظام</span>
          <span className="block text-[var(--fz-display-xl)] text-[var(--c-accent)]">
            العمل
          </span>
        </h1>

        <p className="mt-7 max-w-xl text-[var(--fz-lg)] leading-relaxed text-[var(--c-ink-soft)]">
          {t("cover_lead")}
        </p>

        <div className="mt-10 flex flex-wrap items-stretch gap-px overflow-hidden rounded-[var(--rad-md)] border border-[var(--c-rule)] bg-[var(--c-rule)]">
          <Stat value={displayNumber(LAW_META.chapterCount, lang)} label={t("stat_chapters")} />
          <Stat value={displayNumber(LAW_META.articleCount, lang)} label={t("stat_articles")} />
          <Stat
            value={displayNumber(getEnteredCount(), lang)}
            label={t("articles_entered")}
            accent
          />
        </div>

        <div className="mt-9">
          <Link
            to="/chapters"
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--c-ink)] px-6 py-3 text-[var(--fz-sm)] text-[var(--c-paper)] transition-transform duration-150 hover:-translate-y-0.5"
          >
            {t("cover_enter")}
            <span className="transition-transform duration-150 group-hover:-translate-x-1 rtl:rotate-180">
              →
            </span>
          </Link>
        </div>
      </section>

      {/* ── Quick entries ─────────────────────────────── */}
      <section className="grid grid-cols-1 gap-px overflow-hidden border-b border-[var(--c-rule)] bg-[var(--c-rule)] sm:grid-cols-2">
        <Link
          to="/start"
          className="group flex items-center justify-between gap-4 bg-[var(--c-paper)] p-6 transition-colors hover:bg-[var(--c-paper-2)]"
        >
          <span>
            <span className="font-display block text-[var(--fz-lg)] font-bold text-[var(--c-ink)] group-hover:text-[var(--c-accent)]">
              {t("scenarios_title")}
            </span>
            <span className="text-[var(--fz-sm)] text-[var(--c-ink-faint)]">
              «تم فصلي» · «استقالة» · «إجازات» · «ساعات إضافية»
            </span>
          </span>
          <span className="text-[var(--fz-xl)] text-[var(--c-accent)] rtl:rotate-180">→</span>
        </Link>
        <Link
          to="/calculators"
          className="group flex items-center justify-between gap-4 bg-[var(--c-paper)] p-6 transition-colors hover:bg-[var(--c-paper-2)]"
        >
          <span>
            <span className="font-display block text-[var(--fz-lg)] font-bold text-[var(--c-ink)] group-hover:text-[var(--c-accent)]">
              {t("calculators_title")}
            </span>
            <span className="text-[var(--fz-sm)] text-[var(--c-ink-faint)]">
              مكافأة نهاية الخدمة · الأجر الإضافي · رصيد الإجازة
            </span>
          </span>
          <span className="text-[var(--fz-xl)] text-[var(--c-accent)] rtl:rotate-180">→</span>
        </Link>
      </section>

      {/* ── Chapter index, specimen-style ──────────────── */}
      <section className="py-12 sm:py-16">
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <h2 className="font-display text-[var(--fz-2xl)] font-bold">
            {t("chapters_title")}
          </h2>
          <span className="text-[var(--fz-xs)] text-[var(--c-ink-faint)]">
            {t("phase_note")}
          </span>
        </div>

        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--rad-md)] border border-[var(--c-rule)] bg-[var(--c-rule)] sm:grid-cols-2">
          {chapters.map((c) => (
            <li key={c.number}>
              <Link
                to={`/chapter/${c.number}`}
                className="group flex h-full items-start gap-4 bg-[var(--c-paper)] p-5 transition-colors duration-150 hover:bg-[var(--c-paper-2)]"
              >
                <span className="font-display min-w-10 text-[var(--fz-2xl)] font-black leading-none text-[var(--c-ink-faint)] transition-colors group-hover:text-[var(--c-accent)]">
                  {displayNumber(c.number, lang)}
                </span>
                <span className="min-w-0">
                  <span className="eyebrow block">
                    {t("chapter_word")} {ordinalAr(c.number) || c.number}
                  </span>
                  <span className="mt-1 block text-[var(--fz-base)] leading-snug text-[var(--c-ink)]">
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
    <div className="flex min-w-[7rem] flex-1 flex-col gap-1 bg-[var(--c-paper)] px-5 py-4">
      <span
        className={`font-display text-[var(--fz-4xl)] font-black leading-none ${
          accent ? "text-[var(--c-accent)]" : "text-[var(--c-ink)]"
        }`}
      >
        {value}
      </span>
      <span className="text-[var(--fz-xs)] text-[var(--c-ink-faint)]">{label}</span>
    </div>
  );
}
