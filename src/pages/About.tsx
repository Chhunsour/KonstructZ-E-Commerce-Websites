import React, { useEffect } from "react";
import { AboutScreen } from "../screens/About/About";

export const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return <AboutScreen />;
};
export default About;
