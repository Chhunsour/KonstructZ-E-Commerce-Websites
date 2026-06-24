import React from "react";

/**
 * Stagger wraps a group of <Reveal> (or `[data-reveal]`) children and gives each
 * one a `--stagger-i` index so the CSS can offset their transition-delay.
 *
 * Pair with the CSS in home-reveal.css:
 *   [data-stagger] > [data-reveal] {
 *     transition-delay: calc(... + var(--stagger-step) * var(--stagger-i));
 *   }
 *
 *   base   — extra delay before the whole sequence starts (ms).
 *   step   — gap between siblings (ms). Default 110ms.
 */
interface StaggerProps {
  children: React.ReactNode;
  base?: number;
  step?: number;
  className?: string;
  as?: "div" | "section" | "ul" | "ol" | "header" | "article";
  style?: React.CSSProperties;
  ariaHidden?: boolean;
  ariaLabel?: string;
}

export const Stagger: React.FC<StaggerProps> = ({
  children,
  base = 0,
  step = 110,
  className = "",
  as = "div",
  style,
  ariaHidden,
  ariaLabel,
}) => {
  const Tag = as as React.ElementType;

  const childArray = React.Children.toArray(children);

  const computedStyle: React.CSSProperties = {
    ...({
      ["--stagger-base" as never]: `${base}ms`,
      ["--stagger-step" as never]: `${step}ms`,
    } as React.CSSProperties),
    ...style,
  };

  return (
    <Tag
      data-stagger=""
      className={className}
      style={computedStyle}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
    >
      {childArray.map((child, i) => {
        if (!React.isValidElement(child)) return child;
        const childStyle = (child.props as { style?: React.CSSProperties }).style || {};
        return React.cloneElement(child as React.ReactElement<{ style?: React.CSSProperties }>, {
          style: {
            ...({ ["--stagger-i" as never]: i } as React.CSSProperties),
            ...childStyle,
          },
        });
      })}
    </Tag>
  );
};
