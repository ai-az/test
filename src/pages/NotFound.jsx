import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center">
      <span className="font-display text-[var(--fz-display)] font-black leading-none text-[var(--c-ink-faint)]">
        ٤٠٤
      </span>
      <p className="mt-4 text-[var(--fz-base)] text-[var(--c-ink-soft)]">
        الصفحة المطلوبة غير موجودة.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-[var(--c-ink)] px-6 py-3 text-[var(--fz-sm)] text-[var(--c-paper)] transition-transform hover:-translate-y-0.5"
      >
        {t("nav_home")}
      </Link>
    </div>
  );
}
