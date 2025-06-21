import React, { useState, useRef, useEffect } from 'react';
import './LightBoard.css';

const LightBoard = () => {
  const initialQueue = ['WELCOME TO THE CONCERT', 'HELLO WORLD', 'HAVE A NICE DAY', 'THANK YOU'];
  const [textQueue, setTextQueue] = useState(initialQueue);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [visibleTexts, setVisibleTexts] = useState([{ text: initialQueue[0], id: 0 }]);
  const [nextId, setNextId] = useState(1);
  const [textInput, setTextInput] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [scrollSpeed, setScrollSpeed] = useState(15);
  const [displayMode, setDisplayMode] = useState('normal'); // 'normal' or 'pixel'
  const marqueeRef = useRef(null);

  useEffect(() => {
    if (marqueeRef.current) {
      // Add animation end event listener to each span
      const handleAnimationEnd = (e) => {
        const spanId = parseInt(e.target.dataset.id);

        // Remove this text from visibleTexts
        setVisibleTexts(prev => prev.filter(item => item.id !== spanId));

        // Get the next text from the queue
        const nextIndex = (currentTextIndex + 1) % textQueue.length;
        setCurrentTextIndex(nextIndex);

        // Add the next text to visibleTexts
        setVisibleTexts(prev => [...prev, { text: textQueue[nextIndex], id: nextId }]);
        setNextId(prev => prev + 1);
      };

      // Add event listeners to all spans
      const spans = marqueeRef.current.querySelectorAll('span');
      spans.forEach((span, index) => {
        span.style.animationDuration = `${scrollSpeed}s`;

        // Set animation delay based on index
        if (index === 0) {
          span.style.animationDelay = '0s';
        } else if (index === 1) {
          span.style.animationDelay = `${scrollSpeed / 2}s`;
        }

        span.addEventListener('animationend', handleAnimationEnd);
      });

      // Add a new text every few seconds
      const addTextInterval = setInterval(() => {
        if (visibleTexts.length < 2) { // Limit to 2 visible texts at a time
          const nextIndex = (currentTextIndex + 1) % textQueue.length;
          setCurrentTextIndex(nextIndex);
          setVisibleTexts(prev => [...prev, { text: textQueue[nextIndex], id: nextId }]);
          setNextId(prev => prev + 1);
        }
      }, scrollSpeed * 1000 / 2); // Start the next text halfway through the animation

      return () => {
        spans.forEach(span => {
          span.removeEventListener('animationend', handleAnimationEnd);
        });
        clearInterval(addTextInterval);
      };
    }
  }, [scrollSpeed, currentTextIndex, textQueue, visibleTexts, nextId]);

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleAddToQueue = () => {
    if (textInput.trim()) {
      setTextQueue([...textQueue, textInput]);
    }
  };

  const handleColorChange = (e) => {
    setBackgroundColor(e.target.value);
  };

  const handleTextColorChange = (e) => {
    setTextColor(e.target.value);
  };

  const handleSpeedChange = (e) => {
    setScrollSpeed(e.target.value);
  };

  const handleDisplayModeChange = (e) => {
    setDisplayMode(e.target.value);
  };

  return (
    <div className="light-board-container">
      <div className="controls">
        <div className="control-group">
          <label htmlFor="text-input">Enter Text:</label>
          <div className="text-input-container">
            <input
              id="text-input"
              type="text"
              value={textInput}
              onChange={handleTextChange}
              placeholder="Enter text for the light sign"
            />
            <button onClick={handleAddToQueue} className="add-button">Add to Queue</button>
          </div>
        </div>
        <div className="control-group">
          <label>Text Queue:</label>
          <div className="text-queue">
            {textQueue.map((queueText, index) => (
              <div key={index} className={`queue-item ${index === currentTextIndex ? 'current' : ''}`}>
                {queueText}
              </div>
            ))}
          </div>
        </div>
        <div className="control-group">
          <label htmlFor="color-input">Background Color:</label>
          <input
            id="color-input"
            type="color"
            value={backgroundColor}
            onChange={handleColorChange}
          />
        </div>
        <div className="control-group">
          <label htmlFor="text-color-input">Text Color:</label>
          <input
            id="text-color-input"
            type="color"
            value={textColor}
            onChange={handleTextColorChange}
          />
        </div>
        <div className="control-group">
          <label htmlFor="speed-input">Scrolling Speed (slower → faster):</label>
          <input
            id="speed-input"
            type="range"
            min="5"
            max="30"
            value={scrollSpeed}
            onChange={handleSpeedChange}
          />
          <div className="speed-value">{scrollSpeed}s</div>
        </div>
        <div className="control-group">
          <label>Display Mode:</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="displayMode"
                value="normal"
                checked={displayMode === 'normal'}
                onChange={handleDisplayModeChange}
              />
              Normal
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="displayMode"
                value="pixel"
                checked={displayMode === 'pixel'}
                onChange={handleDisplayModeChange}
              />
              Pixel
            </label>
          </div>
        </div>
      </div>

      <div
        className="light-sign"
        style={{ backgroundColor }}
      >
        <div className="marquee" ref={marqueeRef}>
          {visibleTexts.map(item => (
            <span
              key={item.id}
              data-id={item.id}
              className={`marquee-text ${displayMode === 'pixel' ? 'pixel-mode' : ''}`}
              style={{ color: textColor }}
            >
              {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* SVG Filter for pixelation effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter id="pixel-filter">
            <feFlood x="4" y="4" height="2" width="2"/>
            <feComposite width="8" height="8"/>
            <feTile result="a"/>
            <feComposite in="SourceGraphic" in2="a" operator="in"/>
            <feMorphology operator="dilate" radius="1"/>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default LightBoard;
