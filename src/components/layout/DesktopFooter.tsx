import React from "react";
import { Footer } from "./Footer";

interface DesktopFooterProps {
  top: number;
}

export const DesktopFooter: React.FC<DesktopFooterProps> = ({ top }) => {
  return <Footer variant="embedded" style={{ top: `${top}px` }} />;
};
