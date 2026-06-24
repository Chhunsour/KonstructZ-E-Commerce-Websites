import React from "react";

interface FlagProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

// English / USA Flag SVG
export const USFlag: React.FC<FlagProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 74 39"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    className={`w-full h-full ${className || ""}`}
    {...props}
  >
    <rect width="74" height="39" fill="#B22234" />
    <path d="M0 3h74M0 9h74M0 15h74M0 21h74M0 27h74M0 33h74" stroke="#ffffff" strokeWidth="3" />
    <rect width="29.6" height="21" fill="#3C3B6E" />
    <g fill="#ffffff">
      {/* 9 rows of alternating 6 and 5 stars */}
      <circle cx="2.5" cy="2.1" r="0.5" />
      <circle cx="7.4" cy="2.1" r="0.5" />
      <circle cx="12.3" cy="2.1" r="0.5" />
      <circle cx="17.2" cy="2.1" r="0.5" />
      <circle cx="22.1" cy="2.1" r="0.5" />
      <circle cx="27.0" cy="2.1" r="0.5" />

      <circle cx="4.95" cy="4.2" r="0.5" />
      <circle cx="9.85" cy="4.2" r="0.5" />
      <circle cx="14.75" cy="4.2" r="0.5" />
      <circle cx="19.65" cy="4.2" r="0.5" />
      <circle cx="24.55" cy="4.2" r="0.5" />

      <circle cx="2.5" cy="6.3" r="0.5" />
      <circle cx="7.4" cy="6.3" r="0.5" />
      <circle cx="12.3" cy="6.3" r="0.5" />
      <circle cx="17.2" cy="6.3" r="0.5" />
      <circle cx="22.1" cy="6.3" r="0.5" />
      <circle cx="27.0" cy="6.3" r="0.5" />

      <circle cx="4.95" cy="8.4" r="0.5" />
      <circle cx="9.85" cy="8.4" r="0.5" />
      <circle cx="14.75" cy="8.4" r="0.5" />
      <circle cx="19.65" cy="8.4" r="0.5" />
      <circle cx="24.55" cy="8.4" r="0.5" />

      <circle cx="2.5" cy="10.5" r="0.5" />
      <circle cx="7.4" cy="10.5" r="0.5" />
      <circle cx="12.3" cy="10.5" r="0.5" />
      <circle cx="17.2" cy="10.5" r="0.5" />
      <circle cx="22.1" cy="10.5" r="0.5" />
      <circle cx="27.0" cy="10.5" r="0.5" />

      <circle cx="4.95" cy="12.6" r="0.5" />
      <circle cx="9.85" cy="12.6" r="0.5" />
      <circle cx="14.75" cy="12.6" r="0.5" />
      <circle cx="19.65" cy="12.6" r="0.5" />
      <circle cx="24.55" cy="12.6" r="0.5" />

      <circle cx="2.5" cy="14.7" r="0.5" />
      <circle cx="7.4" cy="14.7" r="0.5" />
      <circle cx="12.3" cy="14.7" r="0.5" />
      <circle cx="17.2" cy="14.7" r="0.5" />
      <circle cx="22.1" cy="14.7" r="0.5" />
      <circle cx="27.0" cy="14.7" r="0.5" />

      <circle cx="4.95" cy="16.8" r="0.5" />
      <circle cx="9.85" cy="16.8" r="0.5" />
      <circle cx="14.75" cy="16.8" r="0.5" />
      <circle cx="19.65" cy="16.8" r="0.5" />
      <circle cx="24.55" cy="16.8" r="0.5" />

      <circle cx="2.5" cy="18.9" r="0.5" />
      <circle cx="7.4" cy="18.9" r="0.5" />
      <circle cx="12.3" cy="18.9" r="0.5" />
      <circle cx="17.2" cy="18.9" r="0.5" />
      <circle cx="22.1" cy="18.9" r="0.5" />
      <circle cx="27.0" cy="18.9" r="0.5" />
    </g>
  </svg>
);

// French Flag SVG
export const FRFlag: React.FC<FlagProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 3 2"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    className={`w-full h-full ${className || ""}`}
    {...props}
  >
    <rect width="1" height="2" fill="#00209F" />
    <rect x="1" width="1" height="2" fill="#FFFFFF" />
    <rect x="2" width="1" height="2" fill="#F42C3E" />
  </svg>
);

// Japanese Flag SVG
export const JPFlag: React.FC<FlagProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 3 2"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    className={`w-full h-full ${className || ""}`}
    {...props}
  >
    <rect width="3" height="2" fill="#FFFFFF" />
    <circle cx="1.5" cy="1" r="0.6" fill="#BC002D" />
  </svg>
);

// Korean Flag SVG
export const KRFlag: React.FC<FlagProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 3 2"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    className={`w-full h-full ${className || ""}`}
    {...props}
  >
    <rect width="3" height="2" fill="#FFFFFF" />
    {/* Taegeuk center */}
    <g transform="translate(1.5,1) rotate(-30)">
      <path d="M0 -0.5 A 0.5 0.5 0 0 0 0 0.5 A 0.25 0.25 0 0 0 0 0 A 0.25 0.25 0 0 1 0 -0.5 Z" fill="#CD2E3A" />
      <path d="M0 -0.5 A 0.5 0.5 0 0 1 0 0.5 A 0.25 0.25 0 0 0 0 0 A 0.25 0.25 0 0 1 0 -0.5 Z" fill="#0047A0" transform="rotate(180)" />
    </g>
    {/* Trigrams */}
    <g fill="#000000">
      {/* Top Left (Geon) */}
      <g transform="translate(0.65, 0.43) rotate(-33.69)">
        <rect x="-0.15" y="-0.09" width="0.3" height="0.03" />
        <rect x="-0.15" y="-0.03" width="0.3" height="0.03" />
        <rect x="-0.15" y="0.03" width="0.3" height="0.03" />
      </g>
      {/* Bottom Right (Gon) */}
      <g transform="translate(2.35, 1.57) rotate(-33.69)">
        <rect x="-0.15" y="-0.09" width="0.13" height="0.03" />
        <rect x="0.02" y="-0.09" width="0.13" height="0.03" />
        <rect x="-0.15" y="-0.03" width="0.13" height="0.03" />
        <rect x="0.02" y="-0.03" width="0.13" height="0.03" />
        <rect x="-0.15" y="0.03" width="0.13" height="0.03" />
        <rect x="0.02" y="0.03" width="0.13" height="0.03" />
      </g>
      {/* Top Right (Gam) */}
      <g transform="translate(2.35, 0.43) rotate(33.69)">
        <rect x="-0.15" y="-0.09" width="0.13" height="0.03" />
        <rect x="0.02" y="-0.09" width="0.13" height="0.03" />
        <rect x="-0.15" y="-0.03" width="0.3" height="0.03" />
        <rect x="-0.15" y="0.03" width="0.13" height="0.03" />
        <rect x="0.02" y="0.03" width="0.13" height="0.03" />
      </g>
      {/* Bottom Left (Ri) */}
      <g transform="translate(0.65, 1.57) rotate(33.69)">
        <rect x="-0.15" y="-0.09" width="0.3" height="0.03" />
        <rect x="-0.15" y="-0.03" width="0.13" height="0.03" />
        <rect x="0.02" y="-0.03" width="0.13" height="0.03" />
        <rect x="-0.15" y="0.03" width="0.3" height="0.03" />
      </g>
    </g>
  </svg>
);

// Spanish Flag SVG
export const ESFlag: React.FC<FlagProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 3 2"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    className={`w-full h-full ${className || ""}`}
    {...props}
  >
    <rect width="3" height="2" fill="#C60B1E" />
    <rect y="0.5" width="3" height="1" fill="#FFC400" />
    {/* Coat of arms simplified representation */}
    <g transform="translate(0.75, 1) scale(0.6)">
      <path d="M-0.1 -0.3 L0.1 -0.3 L0.15 -0.15 L-0.15 -0.15 Z" fill="#C60B1E" />
      <path d="M-0.15 -0.15 L0.15 -0.15 L0.15 0.1 C0.15 0.25 0 0.35 0 0.35 C0 0.35 -0.15 0.25 -0.15 0.1 Z" fill="#C60B1E" stroke="#FFC400" strokeWidth="0.05" />
      <rect x="-0.08" y="-0.08" width="0.16" height="0.16" fill="#FFC400" />
    </g>
  </svg>
);

// Chinese Flag SVG
export const CNFlag: React.FC<FlagProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 30 20"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    className={`w-full h-full ${className || ""}`}
    {...props}
  >
    <rect width="30" height="20" fill="#EE1C25" />
    {/* Big star at x=5, y=5 */}
    <g fill="#FFFF00" transform="translate(5, 5)">
      <polygon points="0,-3 0.88,-0.9 2.85,-0.9 1.26,0.35 1.86,2.4 0,1.15 -1.86,2.4 -1.26,0.35 -2.85,-0.9 -0.88,-0.9" />
    </g>
    {/* 4 small stars rotated pointing to the center of the big star */}
    <g fill="#FFFF00" transform="translate(10, 2) rotate(121.7)">
      <polygon points="0,-1 0.29,-0.3 0.95,-0.3 0.42,0.12 0.62,0.8 0,0.38 -0.62,0.8 -0.42,0.12 -0.95,-0.3 -0.29,-0.3" />
    </g>
    <g fill="#FFFF00" transform="translate(12, 4) rotate(98.1)">
      <polygon points="0,-1 0.29,-0.3 0.95,-0.3 0.42,0.12 0.62,0.8 0,0.38 -0.62,0.8 -0.42,0.12 -0.95,-0.3 -0.29,-0.3" />
    </g>
    <g fill="#FFFF00" transform="translate(12, 7) rotate(74.1)">
      <polygon points="0,-1 0.29,-0.3 0.95,-0.3 0.42,0.12 0.62,0.8 0,0.38 -0.62,0.8 -0.42,0.12 -0.95,-0.3 -0.29,-0.3" />
    </g>
    <g fill="#FFFF00" transform="translate(10, 9) rotate(50.2)">
      <polygon points="0,-1 0.29,-0.3 0.95,-0.3 0.42,0.12 0.62,0.8 0,0.38 -0.62,0.8 -0.42,0.12 -0.95,-0.3 -0.29,-0.3" />
    </g>
  </svg>
);

// Italian Flag SVG
export const ITFlag: React.FC<FlagProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 3 2"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    className={`w-full h-full ${className || ""}`}
    {...props}
  >
    <rect width="1" height="2" fill="#009246" />
    <rect x="1" width="1" height="2" fill="#FFFFFF" />
    <rect x="2" width="1" height="2" fill="#F11813" />
  </svg>
);

// German Flag SVG
export const DEFlag: React.FC<FlagProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 5 15 9"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    className={`w-full h-full ${className || ""}`}
    {...props}
  >
    <rect y="5" width="15" height="3" fill="#000000" />
    <rect y="8" width="15" height="3" fill="#FF0000" />
    <rect y="11" width="15" height="3" fill="#FFCC00" />
  </svg>
);

// Mapping from code to flag element
export const flagIconsMap: Record<string, React.ReactElement> = {
  EN: <USFlag />,
  FR: <FRFlag />,
  JP: <JPFlag />,
  KR: <KRFlag />,
  ES: <ESFlag />,
  CN: <CNFlag />,
  IT: <ITFlag />,
  DE: <DEFlag />,
};

interface FlagIconProps {
  code: string;
  className?: string;
}

export const FlagIcon: React.FC<FlagIconProps> = ({ code, className = "" }) => {
  const icon = flagIconsMap[code.toUpperCase()];
  if (!icon) return null;

  return (
    <div
      className={`w-6 h-4 overflow-hidden rounded-[2px] border border-white/10 shadow-sm shrink-0 flex items-center justify-center bg-black/20 ${className}`}
    >
      {icon}
    </div>
  );
};
