import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext.jsx";

const LINKS = [
  { to: "/start", key: "nav_start" },
  { to: "/chapters", key: "nav_chapters" },
  { to: "/calculators", key: "nav_calculators" },
  { to: "/index", key: "nav_index" },
  { to: "/glossary", key: "nav_glossary" },
  { to: "/timeline", key: "nav_timeline" },
  { to: "/bookmarks", key: "nav_bookmarks" },
];

function linkClass({ isActive }) {
  return [
    "relative py-1 text-[var(--text-sm)] transition-colors duration-150",
    isActive
      ? "text-[var(--color-ink)] after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-[var(--color-accent)]"
      : "text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]",
  ].join(" ");
}

export default function SiteHeader() {
  const { t, toggleLang, toggleTheme, theme } = useI18n();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-rule)] bg-[var(--color-paper)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-[var(--text-lg)] font-bold leading-none text-[var(--color-ink)]">
            {t("siteName")}
          </span>
          <span className="hidden text-[var(--text-xs)] text-[var(--color-ink-faint)] sm:inline">
            {t("siteTagline")}
          </span>
        </Link>

        {/* روابط سطح المكتب */}
        <nav className="hidden items-center gap-5 lg:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {t(l.key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NavLink
            to="/search"
            aria-label={t("nav_search")}
            className={({ isActive }) =>
              `grid size-8 place-items-center rounded-full transition-colors hover:bg-[var(--color-paper-3)] ${
                isActive ? "text-[var(--color-accent)]" : "text-[var(--color-ink-soft)]"
              }`
            }
          >
            <SearchIcon />
          </NavLink>

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

          {/* قائمة الجوال */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={t("menu")}
            aria-expanded={open}
            className="grid size-8 place-items-center rounded-full text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)] lg:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="reveal border-t border-[var(--color-rule)] bg-[var(--color-paper)] px-5 py-2 lg:hidden">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `block border-b border-[var(--color-rule)] py-3 text-[var(--text-base)] last:border-0 ${
                  isActive ? "text-[var(--color-accent)]" : "text-[var(--color-ink-soft)]"
                }`
              }
            >
              {t(l.key)}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
      <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
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
