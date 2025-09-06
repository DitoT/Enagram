import './App.css';
import React, { useState } from 'react';
import { FaMicrophone, FaFilePdf, FaArrowsLeftRight } from 'react-icons/fa6';
import { FaArrowRight, FaChevronDown, FaRegDotCircle, FaBars } from 'react-icons/fa';
import { PiTextAa } from 'react-icons/pi';
import { TbAbc } from 'react-icons/tb';
import { RiVoiceprintFill } from 'react-icons/ri';
import { BsPersonCircle, BsThreeDots } from 'react-icons/bs';
import { AiOutlinePlusCircle } from 'react-icons/ai';

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function computeDiff(wordsA, wordsB) {
  const n = wordsA.length, m = wordsB.length;
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      if (wordsA[i] === wordsB[j]) dp[i][j] = 1 + dp[i + 1][j + 1];
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  let i = 0, j = 0;
  const opsA = [];
  const opsB = [];
  while (i < n || j < m) {
    if (i < n && j < m && wordsA[i] === wordsB[j]) {
      opsA.push({ type: 'same', word: wordsA[i] });
      opsB.push({ type: 'same', word: wordsB[j] });
      i++; j++;
    } else if (j < m && (i === n || dp[i][j + 1] >= dp[i + 1][j])) {
      opsB.push({ type: 'add', word: wordsB[j] });
      j++;
    } else if (i < n) {
      opsA.push({ type: 'del', word: wordsA[i] });
      i++;
    }
  }
  return { opsA, opsB };
}

function buildHtmlFromOps(ops) {
  return ops
    .map(op => {
      const w = escapeHtml(op.word || '');
      if (op.type === 'same') return w;
      if (op.type === 'del') return `<span class="deleted">${w}</span>`;
      if (op.type === 'add') return `<span class="added">${w}</span>`;
      return w;
    })
    .join(' ');
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('ქართული');
  const [isChecked, setIsChecked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [highlightedText1, setHighlightedText1] = useState('');
  const [highlightedText2, setHighlightedText2] = useState('');

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggleDropDown = () => setIsOpen(!isOpen);
  const handleLanguageChange = (lang) => { setLanguage(lang); setIsOpen(false); };
  const handleChangeChekbox = (e) => setIsChecked(e.target.checked);
  const handleRefresh = () => window.location.reload();
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const compareTexts = () => {
    setHighlightedText1('');
    setHighlightedText2('');
    setLoading(true);
    setProgress(0);

    let percent = 0;
    const timer = setInterval(() => {
      percent += 12;
      setProgress(Math.min(percent, 100));
      if (percent >= 100) {
        clearInterval(timer);

        const words1 = text1.trim() ? text1.trim().split(/\s+/) : [];
        const words2 = text2.trim() ? text2.trim().split(/\s+/) : [];

        const { opsA, opsB } = computeDiff(words1, words2);
        setHighlightedText1(buildHtmlFromOps(opsA));
        setHighlightedText2(buildHtmlFromOps(opsB));
        setLoading(false);
        setProgress(100);
      }
    }, 150);
  };

  return (
    <div className="App">
      <div className="menu">
        <button className="burger_btn" onClick={toggleMenu}><FaBars /></button>

        <div className={`menu_links ${menuOpen ? 'open' : ''}`}>
          <div className="top_menu">
            <img src="/main_logo.png" alt="Main Logo" width="150" />
            <ul>
              <li><TbAbc /> მართლიმწერი</li>
              <li><PiTextAa /> ტექსტის შედარება</li>
              <li><FaMicrophone /> ხმა <FaArrowRight /> ტექსტი</li>
              <li><RiVoiceprintFill /> ტექსტი <FaArrowRight /> ხმა</li>
              <li><FaFilePdf /> PDF კონვერტაცია</li>
            </ul>
          </div>

          <div className="bottom_menu">
            <a href="#profile"><BsPersonCircle /> დიმიტრი თუთბერიძე</a>
            <a href="#options"><BsThreeDots /></a>
          </div>
        </div>
      </div>

      <div className="main_content">
        <div className="top_of_content">
          <button className="dropdown_btn" onClick={toggleDropDown}>
            {language} <FaChevronDown className={`arrow ${isOpen ? 'open' : ''}`} />
          </button>
          {isOpen && (
            <ul className="dropdown_ul">
              {language !== 'ქართული' && <li onClick={() => handleLanguageChange('ქართული')}>ქართული</li>}
              {language !== 'ინგლისური' && <li onClick={() => handleLanguageChange('ინგლისური')}>ინგლისური</li>}
            </ul>
          )}

          <label className="checkbox_label">
            <input type="checkbox" checked={isChecked} onChange={handleChangeChekbox} />
            ფორმატის შენარჩუნება
          </label>

          <div className="left_top_content">
            <button onClick={handleRefresh}><AiOutlinePlusCircle /> ახლის გახსნა</button>
          </div>
        </div>

        <div className="bottom_of_content">
          {loading ? (
            <div className="loading_state">
              <FaRegDotCircle className="spinner" />
              <p>Converting... thank you for your patience</p>
              <div className="progress_bar">
                <div className="progress_fill" style={{ width: `${progress}%` }} />
              </div>
              <span>{progress}%</span>
            </div>
          ) : (
            <div className="textbox_container">
              <div className="textbox">
                {!highlightedText1 ? (
                  <textarea
                    className="editable textarea"
                    value={text1}
                    onChange={(e) => setText1(e.target.value)}
                    dir="ltr"
                    spellCheck={false}
                  />
                ) : (
                  <div
                    className="editable highlight"
                    style={{ pointerEvents: 'none' }}
                    dangerouslySetInnerHTML={{ __html: highlightedText1 }}
                  />
                )}
              </div>

              <div className="arrows" style={{ marginLeft: 20, marginTop: 30 }}>
                <FaArrowsLeftRight />
              </div>

              <div className="textbox">
                {!highlightedText2 ? (
                  <textarea
                    className="editable textarea"
                    value={text2}
                    onChange={(e) => setText2(e.target.value)}
                    dir="ltr"
                    spellCheck={false}
                  />
                ) : (
                  <div
                    className="editable highlight"
                    style={{ pointerEvents: 'none' }}
                    dangerouslySetInnerHTML={{ __html: highlightedText2 }}
                  />
                )}
              </div>
            </div>
          )}

          {!loading && (
            <div className="compare_btn_container">
              <button className="compareButton" onClick={compareTexts}>შედარება</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
