import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center">
      <span className="font-display text-[var(--text-display)] font-black leading-none text-[var(--color-ink-faint)]">
        ٤٠٤
      </span>
      <p className="mt-4 text-[var(--text-base)] text-[var(--color-ink-soft)]">
        الصفحة المطلوبة غير موجودة.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-[var(--color-ink)] px-6 py-3 text-[var(--text-sm)] text-[var(--color-paper)] transition-transform hover:-translate-y-0.5"
      >
        {t("nav_home")}
      </Link>
    </div>
  );
}
