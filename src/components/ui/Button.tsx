import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "outline" | "sand";
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "filled",
  children,
  className = "",
  ...props
}) => {
  const baseStyle =
    "px-8 py-3.5 font-googleSans font-bold text-lg tracking-wider transition-all duration-300 shadow-md transform active:scale-95 border-4 focus:outline-none flex items-center justify-center gap-2 uppercase";

  const variants = {
    filled:
      "bg-brand-greenDark border-brand-greenDark text-white hover:bg-brand-green hover:border-brand-green shadow-[0px_4px_10px_rgba(21,61,40,0.3)]",
    outline:
      "bg-transparent border-brand-greenDark text-brand-dark hover:bg-brand-greenDark hover:text-white",
    sand:
      "bg-transparent border-brand-sandLight text-brand-sandLight hover:bg-brand-sandLight hover:text-brand-dark shadow-[0px_4px_10px_rgba(216,199,154,0.15)]",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
