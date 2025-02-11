import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link

import "./hero.css";


import l_bottom_left from "../assets/l_bottom_left.svg";
import l_bottom_right from "../assets/l_bottom_right.svg";
import l_top_left from "../assets/l_top_left.svg";
import doglifeai_title from "../assets/Doglife_funky_title.svg";

import doggylogo from "../assets/doggylogo.svg";

import doggyhead from "../assets/doggy_head_gold.gif"

const Hero = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const gridRef = useRef(null);
  const dropdownRef = useRef(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const openTelegramLink = () => {
    const mobileLink = 'tg://resolve?domain=drpepeaiOFFICIAL'; 
    const webLink = 'tg://resolve?domain=drpepeaiOFFICIAL'; 

    if (isMobile) {
      window.location.href = mobileLink;
    } else {
      window.open(webLink, '_blank', 'noopener noreferrer');
    }
  };
  const openXLink = () => {
    const webLink = 'https://x.com/DogLifeAI'; 
    window.open(webLink, '_blank', 'noopener noreferrer');
  };
  const openAmbassadorLink = () => {
    const webLink = 'https://drpepe.typeform.com/EternalsProgram'; 
    window.open(webLink, '_blank', 'noopener noreferrer');
  };
  const openDocsLink = () => {
    const webLink = 'https://docs.drpepe.ai/';
    window.open(webLink, '_blank', 'noopener noreferrer');

  }
  const openJupiter = () => {
    const webLink ='https://jup.ag/tokens/BrYANThKaAbjZZH5XWLrw26NzMbfUNmBwbZiMe4Fj5Mk'
    window.open(webLink, '_blank', 'noopener noreferrer');
  }
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


      {/* 4 Corner Words */}
      <div className="corner-text bottom-left">
        <img src={l_bottom_left} alt="l" height={15} />
      </div>
      <div className="corner-text bottom-right">
        <img src={l_bottom_right} alt="l" height={15} />
      </div>
      <div className="corner-text top-left">
        <img src={l_top_left} alt="l" height={15} />
      </div>
      <div className="corner-text top-right">
        <Link to="/transfer-widget" className="burn-link">
          BUY DOGLIFEAI
        </Link>
      </div>






      {/* Top desktop */}
      <div className="container-top-desktop">

           {/* Dropdown Menu on Desktop */}
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
                <img src={doglifeai_title} alt="DOG LIFE AI" width={400} />
              </div>
              <div className="overlay-text-subtitle-one">
                <div>
                  Help dogs live forever ( because humans are weird ) 
                </div>
          
                <br/>
                <div className="desktop-third-title">
                 an AI agent by DrPepe.ai
                </div>
              </div>
              <div className="agents-container">
                <div className="square-arrow-text-container">

                  <div onClick={openDogAgent} className="overlay-text-subtitle-three human-agent-link"> DOG AGENT V.0 1</div>

                </div>

                <Link to="/transfer-widget" className="square-arrow-text-container">
                    <span className="overlay-text-subtitle-three human-agent-link">
                  
                      <span>BUY WITH $BRYAN</span>

                    </span>
                      
                </Link>
              </div>

            </div>

      </div>

   
  

      {/* Top mobile */}
      <div className="container-top-mobile">
          <div className="mobile-logo-wired-container">
            <img src={doggyhead} alt="doggyhead"/>
          </div>


        <div className="mobile-container-top-two">

          <div className="mobile-title-subtitle-container">

            <div className="mobile-title"> 
              <img src={doglifeai_title} alt="DOG LIFE AI" className="mobile-title-img" />
            </div>

            <div className="mobile-subtitle">
              <div className="mobile-subtitle-text">

              An AI agent to help dogs live forever ﹝because humans are weird﹞
              </div>
            </div>
            
          </div>


   



        </div>

        <div className="agents-container">
          <div className="mobile-agent-text-arrow-container">
            <div   onClick={openDogAgent} className="agent-text-mobile">Dog Agent v.0 1</div>
            
          </div>
        </div>
      </div>


      {/* Bottom mobile */}
      <div className="landing-cta-mobile-container">

      <div className="cta-container-mobile-first">
            <div  onClick={openJupiter}  className="text-cta-mobile parenthesis-text">﹝Buy on Solana﹞</div>
            <div  onClick={openXLink}  className="text-cta-mobile parenthesis-text">﹝Follow on X @doglifeai﹞</div>
            <div onClick={openTelegramLink} className="text-cta-mobile parenthesis-text">﹝Join Telegram﹞</div>
            <div  onClick={openAmbassadorLink}  className="text-cta-mobile parenthesis-text">﹝Become an Ambassador﹞</div>
            <div  onClick={openDocsLink} className="text-cta-mobile cta-docs-mobile ">﹝Docs﹞</div>

      </div>



      <div className="ca-container-mobile">
        <div  className="text-cta-mobile ca-mobile">CA:000000000000000000000000000000000000000000</div>
      </div>

      </div>

    </div>
  );
};

export default Hero;
