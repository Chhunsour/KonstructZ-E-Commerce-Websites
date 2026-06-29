import React, { useState } from "react";
import { useI18n } from "../../context/I18nContext";
import { categoryNameKey } from "../../i18n/keys";

/**
 * Collapsible filter group — the Konstructz product-filter design.
 * Lifted out of the All Products page so the same look (green underline,
 * checkbox rows, accent highlight) can be reused on the Equipment catalog
 * without duplicating styling or touching the All Products page.
 */
export const FilterGroup: React.FC<{
  title: string;
  options: string[];
  defaultOpen?: boolean;
  translateOptions?: boolean;
  selectedOption?: string | null;
  onOptionSelect?: (option: string | null) => void;
  optionValueMapping?: { [key: string]: string };
  disabled?: boolean;
}> = ({
  title,
  options,
  defaultOpen = true,
  translateOptions = false,
  selectedOption,
  onOptionSelect,
  optionValueMapping,
  disabled = false,
}) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`bg-theme-sec text-theme-text p-4 border border-theme-border/10 rounded transition-all duration-200 ${disabled ? "opacity-50" : ""}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-between w-full font-clofieBold text-theme-text text-lg sm:text-xl pb-3 border-b-[3px] border-theme-border ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className="flex items-center gap-2">
          <span>{title}</span>
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 10 7"
          fill="none"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all ${
          open ? "max-h-[600px] opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1.5">
          {options.map((opt) => {
            const val = optionValueMapping ? optionValueMapping[opt] : opt;
            const isChecked = selectedOption === val;
            const labelText = translateOptions ? t(categoryNameKey(opt), { fallback: opt }) : opt;

            return (
              <li key={opt}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    if (!disabled && onOptionSelect) {
                      onOptionSelect(isChecked ? null : val);
                    }
                  }}
                  className={`flex items-center gap-3 w-full text-left py-2.5 px-3 rounded-md border transition-all ${
                    disabled
                      ? "bg-theme-card/10 border-theme-border/10 cursor-not-allowed opacity-70"
                      : isChecked
                        ? "bg-theme-accent/10 border-theme-accent/30 cursor-pointer animate-fade-in"
                        : "bg-theme-card/30 border-theme-border/20 hover:bg-brand-dark/40 hover:border-theme-accent/30 cursor-pointer"
                  }`}
                >
                  {/* Custom Checkbox */}
                  <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                    isChecked
                      ? "bg-theme-accent border-theme-accent text-brand-dark"
                      : "border-theme-border/40 text-transparent"
                  }`}>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className={`font-glonimove text-sm sm:text-base transition-colors ${
                    isChecked ? "text-theme-accent font-bold" : "text-theme-text"
                  }`}>
                    {labelText}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

/**
 * Price range slider — matches the Konstructz product filter. `max` is
 * configurable so the catalog can scale the slider to its real price range.
 */
export const PriceFilter: React.FC<{
  value: number;
  onChange: (val: number) => void;
  max?: number;
  disabled?: boolean;
}> = ({ value, onChange, max = 69999, disabled = false }) => {
  const { t } = useI18n();
  return (
    <div className={`bg-theme-sec text-theme-text p-4 border border-theme-border/10 rounded transition-all duration-200 ${disabled ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between pb-3 border-b-[3px] border-theme-border">
        <span className="font-clofieBold text-theme-text text-lg sm:text-xl flex items-center gap-2">
          <span>{t("equipment.price", { fallback: "Price" })}</span>
        </span>
      </div>
      <div className="mt-4">
        <input
          type="range"
          min={0}
          max={max}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full accent-theme-accent ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          aria-label={t("equipment.price", { fallback: "Price" })}
        />
        <div className="mt-2 flex items-center justify-between font-glonimove text-theme-text text-xs sm:text-sm">
          <span>0–${value.toLocaleString()}.00</span>
          <span>{t("equipment.max", { fallback: "Max" })}: ${max.toLocaleString()}.00</span>
        </div>
      </div>
    </div>
  );
};
