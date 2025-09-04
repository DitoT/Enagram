import './App.css';
import React, { useState } from 'react';
import { FaMicrophone, FaFilePdf, FaArrowsLeftRight } from 'react-icons/fa6';
import { FaArrowRight, FaChevronDown, FaRegDotCircle, FaBars } from 'react-icons/fa';
import { PiTextAa } from 'react-icons/pi';
import { TbAbc } from 'react-icons/tb';
import { RiVoiceprintFill } from 'react-icons/ri';
import { BsPersonCircle, BsThreeDots } from 'react-icons/bs';
import { AiOutlinePlusCircle } from 'react-icons/ai';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("ქართული");
  const [isChecked, setIsChecked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [highlightedText1, setHighlightedText1] = useState("");
  const [highlightedText2, setHighlightedText2] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggleDropDown = () => setIsOpen(!isOpen);
  const handleLanguageChange = (lang) => { setLanguage(lang); setIsOpen(false); };
  const handleChangeChekbox = (event) => setIsChecked(event.target.checked);
  const handleRefresh = () => window.location.reload();
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const compareTexts = () => {
    setLoading(true);
    setProgress(0);
    setHighlightedText1("");
    setHighlightedText2("");
    let percent = 0;
    const interval = setInterval(() => {
      percent += 10;
      setProgress(percent);
      if (percent >= 100) {
        clearInterval(interval);
        const words1 = text1.split(/\s+/);
        const words2 = text2.split(/\s+/);
        const maxLen = Math.max(words1.length, words2.length);
        const result1 = [];
        const result2 = [];
        for (let i = 0; i < maxLen; i++) {
          const w1 = words1[i];
          const w2 = words2[i];
          if (w1 === w2) {
            if (w1) result1.push(w1);
            if (w2) result2.push(w2);
          } else {
            if (w1) result1.push(`<span class="deleted">${w1}</span>`);
            if (w2) result2.push(`<span class="added">${w2}</span>`);
          }
        }
        setHighlightedText1(result1.join(" "));
        setHighlightedText2(result2.join(" "));
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="App">
      <div className='menu'>
        <button className="burger_btn" onClick={toggleMenu}><FaBars /></button>
        <div className={`menu_links ${menuOpen ? "open" : ""}`}>
          <div className='top_menu'>
            <img src="/main_logo.png" alt="Main Logo" width="150" />
            <ul>
              <li><TbAbc /> მართლიმწერი</li>
              <li><PiTextAa /> ტექსტის შედარება</li>
              <li><FaMicrophone /> ხმა <FaArrowRight /> ტექსტი</li>
              <li><RiVoiceprintFill /> ტექსტი <FaArrowRight /> ხმა</li>
              <li><FaFilePdf /> PDF კონვერტაცია</li>
            </ul>
          </div>
          <div className='bottom_menu'>
            <a href="#profile"><BsPersonCircle /> დიმიტრი თუთბერიძე </a>
            <a href="#options"><BsThreeDots/></a>
          </div>
        </div>
      </div>

      <div className='main_content'>
        <div className="top_of_content">
          <button className="dropdown_btn" onClick={toggleDropDown}>
            {language} <FaChevronDown className={`arrow ${isOpen ? "open" : ""}`} />
          </button>
          {isOpen && (
            <ul className="dropdown_ul">
              {language !== "ქართული" && <li onClick={() => handleLanguageChange("ქართული")}>ქართული</li>}
              {language !== "ინგლისური" && <li onClick={() => handleLanguageChange("ინგლისური")}>ინგლისური</li>}
            </ul>
          )}
          <label className='checkbox_label'>
            <input type="checkbox" checked={isChecked} onChange={handleChangeChekbox} />
            ფორმატის შენარჩუნება
          </label>
          <div className='left_top_content'>
            <button onClick={handleRefresh}><AiOutlinePlusCircle /> ახლის გახსნა</button>
          </div>
        </div>

        <div className='bottom_of_content'>
          {loading ? (
            <div className="loading_state">
              <FaRegDotCircle className="spinner" />
              <p>Converting... thank you for your patience</p>
              <div className="progress_bar">
                <div className="progress_fill" style={{ width: `${progress}%` }}></div>
              </div>
              <span>{progress}%</span>
            </div>
          ) : (
            <div className="textbox_container">
              <div className="textbox">
                {!highlightedText1 ? (
                  <div
                    className="editable"
                    contentEditable={!loading}
                    suppressContentEditableWarning={true}
                    onInput={(e) => setText1(e.currentTarget.textContent)}
                  />
                ) : (
                  <div
                    className="editable"
                    dangerouslySetInnerHTML={{ __html: highlightedText1 }}
                    style={{ pointerEvents: "none" }}
                  />
                )}
              </div>

              <div style={{marginLeft: "20px", marginTop: "30px"}} className="arrows"><FaArrowsLeftRight/></div>

              <div className="textbox">
                {!highlightedText2 ? (
                  <div
                    className="editable"
                    contentEditable={!loading}
                    suppressContentEditableWarning={true}
                    onInput={(e) => setText2(e.currentTarget.textContent)}
                  />
                ) : (
                  <div
                    className="editable"
                    dangerouslySetInnerHTML={{ __html: highlightedText2 }}
                    style={{ pointerEvents: "none" }}
                  />
                )}
              </div>
            </div>
          )}

          {!loading && (
            <div className="compare_btn_container">
              <button className='compareButton' onClick={compareTexts}>შედარება</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
