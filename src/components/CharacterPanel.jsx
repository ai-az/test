import { useEffect } from "react";
import { useI18n, ACCENTS } from "../i18n/I18nContext.jsx";
import { toArabicDigits } from "../lib/format.js";

const KASHIDA_OPTS = [
  { key: "هادئة", label: "char_quiet" },
  { key: "متوسطة", label: "char_medium" },
  { key: "مبالِغة", label: "char_dramatic" },
];

export default function CharacterPanel({ onClose }) {
  const { t, lang, character, setTweak, resetCharacter } = useI18n();

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div onClick={onClose} className="fixed inset-0 z-[150]">
      <div
        onClick={(e) => e.stopPropagation()}
        className="char-panel"
        role="dialog"
        aria-label={t("char_tune")}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="display text-[19px] font-extrabold">{t("char_tune")}</div>
            <div className="mt-0.5 text-[12px] text-[var(--c-ink-faint)]">{t("char_sub")}</div>
          </div>
          <button type="button" className="act" onClick={onClose} aria-label={t("close")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <hr className="hairline my-4" />

        <div className="char-sec">{t("char_accent")}</div>
        <div className="mb-6 flex gap-3">
          {Object.entries(ACCENTS).map(([key, p]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTweak("accent", key)}
              title={lang === "ar" ? p.name : p.nameEn}
              aria-label={lang === "ar" ? p.name : p.nameEn}
              aria-pressed={character.accent === key}
              className={"char-swatch" + (character.accent === key ? " is-on" : "")}
              style={{ background: p.swatch, "--sw": p.swatch }}
            />
          ))}
        </div>

        <div className="char-sec">{t("char_scale")}</div>
        <div className="mb-6 flex items-center gap-3">
          <input
            className="char-range"
            type="range"
            min="0.7"
            max="1.6"
            step="0.05"
            value={character.numScale}
            onChange={(e) => setTweak("numScale", parseFloat(e.target.value))}
          />
          <span className="num min-w-10 text-center text-[14px] font-bold text-[var(--c-accent)]">
            {toArabicDigits(Number(character.numScale).toFixed(2))}×
          </span>
        </div>

        <div className="char-sec">{t("char_kashida")}</div>
        <div className="char-seg">
          {KASHIDA_OPTS.map((o) => (
            <button
              key={o.key}
              type="button"
              aria-pressed={character.kashida === o.key}
              onClick={() => setTweak("kashida", o.key)}
            >
              {t(o.label)}
            </button>
          ))}
        </div>

        <hr className="hairline my-[18px]" />
        <button
          type="button"
          onClick={resetCharacter}
          className="w-full rounded-[11px] border border-[var(--hair-strong)] bg-transparent px-3 py-[11px] text-[13.5px] font-semibold text-[var(--c-ink-soft)]"
        >
          {t("char_reset")}
        </button>
      </div>
    </div>
  );
}
