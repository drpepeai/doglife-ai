// PageTransition_one.js
import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

const PageTransition_one = ({ children }) => {
  const containerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      {
        clipPath: "circle(0% at 50% 50%)", // Start with nothing visible
        opacity: 0
      },
      {
        clipPath: "circle(150% at 50% 50%)", // Expand to cover the whole element
        opacity: 1,
        duration: 1.2,
        ease: "expo.out"
      }
    );
  }, [location]);

  return <div ref={containerRef}>{children}</div>;
};

export default PageTransition_one;
