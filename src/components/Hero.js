import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./hero.css";
import doglifeai_title from "../assets/Doglife_funky_title.svg";
import doggyhead from "../assets/doggy_head_gold_centered.gif";
import paw from "../assets/paw.svg"

const Hero = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State for hamburger menu animation
  const dropdownRef = useRef(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const openDogAgent = () => {
    const mobileLink = "tg://resolve?domain=drpepeaiOFFICIAL";
    const webLink = "tg://resolve?domain=drpepeaiOFFICIAL";

    if (isMobile) {
      window.location.href = mobileLink;
    } else {
      window.open(webLink, "_blank", "noopener noreferrer");
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    setMenuOpen((prev) => !prev); // Ensure hamburger toggles properly
  };

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
      setMenuOpen(false); // Ensure hamburger resets if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  return (
    <div className="container">

<   div className="container-header">
        <Link to="https://www.drpepe.ai/" className="tohome"> </Link>
        <div className="paw-dropdown-container" ref={dropdownRef}>
            <div onClick={toggleDropdown} className="nav-toggle">
              {menuOpen ? (
                <img src={paw} alt="paw icon" className="paw-icon" width={30} />
              ) : (
                <>
                  <span className="bar"></span>
                  <span className="bar"></span>
                  <span className="bar"></span>
                </>
              )}
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <div
                  onClick={() =>
                    window.open("tg://resolve?domain=drpepeaiOFFICIAL", "_blank")
                  }
                  className="dropdown-item"
                >
                  Join The Community
                </div>
                <div
                  onClick={() => window.open("https://x.com/DogLifeAI", "_blank")}
                  className="dropdown-item"
                >
                  X @doglifeai
                </div>
                <div
                  onClick={() =>
                    window.open("https://drpepe.typeform.com/EternalsProgram", "_blank")
                  }
                  className="dropdown-item"
                >
                  Become an Ambassador
                </div>
                <div
                  onClick={() => window.open("https://docs.drpepe.ai/", "_blank")}
                  className="dropdown-item"
                >
                  Docs
                </div>
                <div
                  onClick={() => window.open("https://drpepe.ai/", "_blank")}
                  className="dropdown-item"
                >
                  DrPepe.AI
                </div>
              </div>
            )}
        </div>
    </div>

      {/* Main Content */}
      <section className="body-hero">

          <img src={doggyhead} alt="doggyhead" width={260} />
          <img src={doglifeai_title} alt="DOG LIFE AI" width={200} />

          <div className="text-line">Help dogs live forever</div>
          <div className="text-line">( because humans are weird )</div>
          <div className="text-line">an AI agent by <span className="drpepelink"> <div
                  onClick={() =>
                    window.open("https://drpepe.ai/", "_blank")
                  }
                  className="dropdown-item"
                >
                DrPepe.ai
                </div></span></div>

          <div onClick={openDogAgent} className="text-line link-text">
            dog agent v.0 1
          </div>

          <Link to="/buy" className="text-line link-text">
            <span>buy with $BRYAN</span>
          </Link>

      </section>
      
      <div className="container-header">
       
    </div>


    </div>
  );
};

export default Hero;
