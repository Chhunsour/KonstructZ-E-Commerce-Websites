import React, { useEffect, useRef, useState } from "react";

const DESIGN_WIDTH = 1920;
const MOBILE_BREAKPOINT = 1024; // matches Tailwind `lg`

export const AnimaScaler: React.FC<{
  children: React.ReactNode;
  bgColor: string;
  mobile?: React.ReactNode;
}> = ({ children, bgColor, mobile }) => {
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  );
  const innerRef = useRef<HTMLDivElement>(null);
  const [innerHeight, setInnerHeight] = useState(0);

  useEffect(() => {
    const update = () => {
      const mobileNow = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobileNow);
      if (mobileNow && mobile) {
        return; // mobile layout flows naturally; no scaling needed
      }
      const s = window.innerWidth / DESIGN_WIDTH;
      setScale(s);
      if (innerRef.current) {
        setInnerHeight(innerRef.current.scrollHeight * s);
      }
    };
    update();
    window.addEventListener("resize", update);
    const timer = setTimeout(update, 100);
    return () => {
      window.removeEventListener("resize", update);
      clearTimeout(timer);
    };
  }, [mobile]);

  if (isMobile && mobile) {
    return (
      <div className="w-full" style={{ backgroundColor: bgColor }}>
        {mobile}
      </div>
    );
  }

  return (
    <div
      className="w-full overflow-hidden"
      style={{ backgroundColor: bgColor, height: innerHeight || "auto" }}
    >
      <div
        ref={innerRef}
        style={{
          width: DESIGN_WIDTH,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
