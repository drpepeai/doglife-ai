// PageTransition.js
import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

const PageTransition = ({ children }) => {
  const containerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out"
      }
    );
  }, [location]);

  return <div ref={containerRef}>{children}</div>;
};

export default PageTransition;
