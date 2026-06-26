import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface ImageLightboxProps {
  images: string[];
  index: number;
  open: boolean;
  alt?: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

/**
 * Fullscreen image viewer. Opens from the product image's "view full image"
 * button. Shows the selected image at full size with optional prev/next, a
 * close button, a counter, click-backdrop-to-close, and Escape/arrow keys.
 */
export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  index,
  open,
  alt = "",
  onClose,
  onIndexChange,
}) => {
  const count = images.length;
  const hasMany = count > 1;

  const go = (delta: number) => onIndexChange((index + delta + count) % count);

  // Keyboard controls + body scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && hasMany) go(1);
      else if (e.key === "ArrowLeft" && hasMany) go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, count]);

  if (!open || typeof document === "undefined") return null;

  // Portal to <body> so the fixed overlay escapes any transformed/clipped
  // ancestor (e.g. the scaled AnimaScaler container on the Konstructz page).
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image viewer"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center bg-white/10 text-white transition hover:bg-[#d8c79a] hover:text-[#153d28]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {/* Counter */}
      {hasMany && (
        <span className="absolute left-1/2 top-5 z-10 -translate-x-1/2 bg-black/50 px-3 py-1 font-googleSans text-sm font-medium text-white">
          {index + 1} / {count}
        </span>
      )}

      {/* Prev / Next */}
      {hasMany && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/10 text-white transition hover:bg-[#d8c79a] hover:text-[#153d28] sm:left-6"
          >
            <svg width="13" height="22" viewBox="0 0 11 18" fill="none" aria-hidden="true">
              <path d="M10 1L2 9l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); go(1); }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/10 text-white transition hover:bg-[#d8c79a] hover:text-[#153d28] sm:right-6"
          >
            <svg width="13" height="22" viewBox="0 0 11 18" fill="none" aria-hidden="true">
              <path d="M1 1l8 8-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {/* Full image — stop propagation so clicking it doesn't close */}
      <img
        src={images[index]}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-full max-w-full select-none object-contain"
      />
    </div>,
    document.body
  );
};

export default ImageLightbox;
