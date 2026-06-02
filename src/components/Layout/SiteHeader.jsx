import { Link, NavLink } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext.jsx";

function navClass({ isActive }) {
  return [
    "relative py-1 text-[var(--text-sm)] transition-colors duration-150",
    isActive
      ? "text-[var(--color-ink)]"
      : "text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]",
    isActive
      ? "after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-[var(--color-accent)]"
      : "",
  ].join(" ");
}

export default function SiteHeader() {
  const { t, toggleLang, toggleTheme, theme } = useI18n();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-rule)] bg-[var(--color-paper)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <Link to="/" className="group flex items-baseline gap-2">
          <span className="font-display text-[var(--text-lg)] font-bold leading-none text-[var(--color-ink)]">
            {t("siteName")}
          </span>
          <span className="hidden text-[var(--text-xs)] text-[var(--color-ink-faint)] sm:inline">
            {t("siteTagline")}
          </span>
        </Link>

        <nav className="flex items-center gap-5">
          <NavLink to="/chapters" className={navClass}>
            {t("nav_chapters")}
          </NavLink>
          <NavLink to="/bookmarks" className={navClass}>
            {t("nav_bookmarks")}
          </NavLink>

          <span className="h-4 w-px bg-[var(--color-rule)]" aria-hidden="true" />

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t("toggle_theme")}
            className="grid size-8 place-items-center rounded-full text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)]"
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>

          <button
            type="button"
            onClick={toggleLang}
            className="rounded-full border border-[var(--color-rule)] px-3 py-1 text-[var(--text-xs)] text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-ink)]"
          >
            {t("toggle_lang")}
          </button>
        </nav>
      </div>
    </header>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
