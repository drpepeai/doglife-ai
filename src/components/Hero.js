import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link


import "./hero.css";
import doglifeai_title from "../assets/Doglife_funky_title.svg";
import doggylogo from "../assets/doggy-head-right-top.svg";
import doggyhead from "../assets/doggy_head_gold_centered.gif"

const Hero = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
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





  
  return (
    <div className="container">



              <div className="logo-wired" ref={dropdownRef}>
                <img src={doggylogo} alt="drpepe logo" width={50} onClick={toggleDropdown} className="doggylogo" />
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div onClick={() => window.open('tg://resolve?domain=drpepeaiOFFICIAL', '_blank')} className="dropdown-item">Join The Community</div>
                    <div onClick={() => window.open('https://x.com/DogLifeAI', '_blank')} className="dropdown-item">X @doglifeai</div>
                    <div onClick={() => window.open('https://drpepe.typeform.com/EternalsProgram', '_blank')} className="dropdown-item">Become an Ambassador</div>
                    <div onClick={() => window.open('https://docs.drpepe.ai/', '_blank')} className="dropdown-item">Docs</div>
                  </div>
                )}
              </div>


 

  

          


  

                  <img src={doggyhead} alt="doggyhead" width={260}/>
      

                  <img src={doglifeai_title} alt="DOG LIFE AI" width={200} />

                  <div  className="text-line">
                    Help dogs live forever
                  </div>
                  <div  className="text-line">
                    ( because humans are weird ) 
                  </div>
                  <div  className="text-line">
                    an Ai agent by DrPepe.ai
                  </div>
          
                   <div onClick={openDogAgent} className="text-line"> dog agent v.0 1</div>
             
                   <Link to="/transfer-widget" className="text-line">
                      <span className="">
                      buy with $bryan
                      </span>  
                   </Link>


   
               

            

       

   

   

    </div>
  );
};

export default Hero;
