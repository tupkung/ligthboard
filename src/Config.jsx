import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import './Config.css';

const Config = ({
  text,
  setText,
  backgroundColor,
  setBackgroundColor,
  textColor,
  setTextColor,
  scrollSpeed,
  setScrollSpeed,
  fontSize,
  setFontSize,
  isBlinking,
  setIsBlinking,
  blinkSpeed,
  setBlinkSpeed,
  isColorChanging,
  setIsColorChanging,
  displayMode,
  setDisplayMode,
  isScrolling,
  setIsScrolling
}) => {
  const navigate = useNavigate();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleTextChange = (e) => {
    setText(e.target.value);
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

  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value);
  };

  const handleBlinkingChange = (e) => {
    setIsBlinking(e.target.checked);
  };

  const handleBlinkSpeedChange = (e) => {
    setBlinkSpeed(e.target.value);
  };

  const handleColorChangingChange = (e) => {
    setIsColorChanging(e.target.checked);
  };

  const handleDisplayModeChange = (e) => {
    setDisplayMode(e.target.value);
  };

  const handleScrollingChange = (e) => {
    setIsScrolling(e.target.checked);
  };

  const handleShowDisplay = () => {
    navigate('/display');
  };

  const handleEmojiClick = (emojiData) => {
    setText(text + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div className="config-container">
      <h1>Light Board Configuration</h1>
      <div className="controls">
        <div className="control-group">
          <label htmlFor="text-input">Enter Text:</label>
          <div className="text-input-container">
            <input
              id="text-input"
              type="text"
              value={text}
              onChange={handleTextChange}
              placeholder="Enter text for the light sign"
            />
            <button
              type="button"
              className="emoji-button"
              onClick={toggleEmojiPicker}
            >
              😊
            </button>
          </div>
          {showEmojiPicker && (
            <div className="emoji-picker-container">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
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
          <label htmlFor="font-size-input">Font Size:</label>
          <input
            id="font-size-input"
            type="range"
            min="12"
            max="512"
            value={fontSize}
            onChange={handleFontSizeChange}
          />
          <div className="speed-value">{fontSize}px</div>
        </div>
        <div className="control-group">
          <div className="checkbox-control">
            <input
              id="blinking-input"
              type="checkbox"
              checked={isBlinking}
              onChange={handleBlinkingChange}
            />
            <label htmlFor="blinking-input">Enable Blinking Effect</label>
          </div>
        </div>
        {isBlinking && (
          <>
            <div className="control-group">
              <label htmlFor="blink-speed-input">Blinking Speed (slower → faster):</label>
              <input
                id="blink-speed-input"
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={blinkSpeed}
                onChange={handleBlinkSpeedChange}
              />
              <div className="speed-value">{blinkSpeed}s</div>
            </div>
            <div className="control-group">
              <div className="checkbox-control">
                <input
                  id="color-changing-input"
                  type="checkbox"
                  checked={isColorChanging}
                  onChange={handleColorChangingChange}
                />
                <label htmlFor="color-changing-input">Change Colors While Blinking</label>
              </div>
            </div>
          </>
        )}
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
        <div className="control-group">
          <div className="checkbox-control">
            <input
              id="scrolling-input"
              type="checkbox"
              checked={isScrolling}
              onChange={handleScrollingChange}
            />
            <label htmlFor="scrolling-input">Enable Scrolling Text</label>
          </div>
        </div>
        <button className="show-display-btn" onClick={handleShowDisplay}>
          Show Display
        </button>
      </div>
      <div className="preview">
        <h2>Preview:</h2>
        <div
          className="light-sign-preview"
          style={{ backgroundColor }}
        >
          <div className="marquee">
            <span
              className={displayMode === 'pixel' ? 'pixel-mode' : ''}
              style={{
                color: textColor,
                fontSize: `${fontSize}px`,
                animation: isScrolling
                  ? (isBlinking
                      ? `marquee ${scrollSpeed}s linear infinite, ${isColorChanging ? 'colorBlink' : 'blink'} ${blinkSpeed}s ease-in-out infinite`
                      : `marquee ${scrollSpeed}s linear infinite`)
                  : (isBlinking
                      ? `${isColorChanging ? 'colorBlink' : 'blink'} ${blinkSpeed}s ease-in-out infinite`
                      : 'none'),
                position: isScrolling ? 'relative' : 'static',
                transform: isScrolling ? 'none' : 'translateX(0)',
                paddingLeft: isScrolling ? '100%' : '0',
                textAlign: isScrolling ? 'left' : 'center',
                width: isScrolling ? 'auto' : '100%'
              }}
            >
              {text}
            </span>
          </div>
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

export default Config;
