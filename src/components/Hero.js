import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import drpepetitle from "../assets/Ai-agent-by-drp.svg"

import "./hero.css";
import doglifeai_title from "../assets/Doglife_funky_title.svg";
import doggylogo from "../assets/doggy-head-right-top.svg";
import doggyhead from "../assets/doggy_head_gold_centered.gif"

const Hero = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const gridRef = useRef(null);
  const dropdownRef = useRef(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const openDogAgent = () => {
    const mobileLink = 'tg://resolve?domain=drpepeaiOFFICIAL'; 
    const webLink = 'tg://resolve?domain=drpepeaiOFFICIAL'; 

    if (isMobile) {
      window.location.href = mobileLink;
    } else {
      window.open(webLink, '_blank', 'noopener noreferrer');
    }
  }
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  useEffect(() => {

    const gridItems = gridRef.current.querySelectorAll(".grid-item");

    // Elastic grid animation
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;

      gridItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const distanceX = clientX - (rect.left + rect.width / 2);
        const distanceY = clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(distanceX, distanceY);

        const maxDistance = 200;
        const intensity = 1 - Math.min(distance / maxDistance, 1);

        const translateX = -intensity * (distanceX / distance) * 20;
        const translateY = -intensity * (distanceY / distance) * 20;

        item.style.transform = `translate(${translateX}px, ${translateY}px)`;
      });
    };

    const handleMouseLeave = () => {
      gridItems.forEach((item) => {
        item.style.transform = "translate(0, 0)";
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);

    };
  }, []);




  
  return (
    <div className="container">

      {/* Grid */}
      <div ref={gridRef} className="elastic-grid">
        {[...Array(64)].map((_, index) => (
          <div key={index} className="grid-item" />
        ))}
      </div>


      <div className="container-top-desktop">

  
            <div className="desktop-dropdown">
              <div className="logo-wired" ref={dropdownRef}>
                <img src={doggylogo} alt="drpepe logo" width={70} onClick={toggleDropdown} className="doggylogo" />
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div onClick={() => window.open('tg://resolve?domain=drpepeaiOFFICIAL', '_blank')} className="dropdown-item">Join The Community</div>
                    <div onClick={() => window.open('https://x.com/DogLifeAI', '_blank')} className="dropdown-item">X @doglifeai</div>
                    <div onClick={() => window.open('https://drpepe.typeform.com/EternalsProgram', '_blank')} className="dropdown-item">Become an Ambassador</div>
                    <div onClick={() => window.open('https://docs.drpepe.ai/', '_blank')} className="dropdown-item">Docs</div>
                  </div>
                )}
              </div>
            </div>

            <div className="capsule-image-container">
              <img src={doggyhead} alt="doggyhead"/>
            </div>

            <div className="landing-text-container">

              <div className="overlay-text-title">
                <img src={doglifeai_title} alt="DOG LIFE AI" width={450} />
              </div>

              <div className="overlay-text-subtitle-one">
                <div>
                  Help dogs live forever
                </div>
                <div>
                 ( because humans are weird ) 
                </div>
          
             
                <div className="desktop-third-title">
                <span><img src={drpepetitle} alt="drpepe.ai title" width={300}/></span>
                </div>
              </div>

              <div className="agents-container">
                <div className="square-arrow-text-container">

                  <div onClick={openDogAgent} className="button-85"> DOG AGENT v.0 1</div>

                </div>

                <Link to="/transfer-widget" className="square-arrow-text-container">
                    <span className="buy-bryan-link">
                  
                 BUY WITH $BRYAN

                    </span>
                      
                </Link>
              </div>

            </div>

      </div>

   

    </div>
  );
};

export default Hero;
