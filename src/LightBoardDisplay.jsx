import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LightBoardDisplay.css';

const LightBoardDisplay = ({ text, backgroundColor, textColor, scrollSpeed, fontSize, isBlinking, blinkSpeed, isColorChanging, displayMode, isScrolling }) => {
  const navigate = useNavigate();
  const marqueeRef = useRef(null);
  const [visibleTexts, setVisibleTexts] = useState([{ text, id: 0 }]);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    if (marqueeRef.current) {
      // Reset visible texts when switching between scrolling and static modes
      if (!isScrolling) {
        setVisibleTexts([{ text, id: 0 }]);
        setNextId(1);
      }

      if (isScrolling) {
        // Add animation end event listener to each span
        const handleAnimationEnd = (e) => {
          // Only handle the marquee animation end, not the blink animation
          if (e.animationName === 'marquee') {
            const spanId = parseInt(e.target.dataset.id);

            // Remove this text from visibleTexts
            setVisibleTexts(prev => prev.filter(item => item.id !== spanId));

            // Add the text again to create a continuous loop
            setVisibleTexts(prev => [...prev, { text, id: nextId }]);
            setNextId(prev => prev + 1);
          }
        };

        // Add event listeners to all spans
        const spans = marqueeRef.current.querySelectorAll('span');
        spans.forEach((span, index) => {
          // Set animation duration and delay
          if (isBlinking) {
            const blinkAnimation = isColorChanging ? 'colorBlink' : 'blink';
            span.style.animation = `marquee ${scrollSpeed}s linear forwards, ${blinkAnimation} ${blinkSpeed}s ease-in-out infinite`;
          } else {
            span.style.animation = `marquee ${scrollSpeed}s linear forwards`;
          }

          // Set animation delay based on index
          if (index === 0) {
            span.style.animationDelay = '0s';
          } else if (index === 1) {
            span.style.animationDelay = `${scrollSpeed / 2}s`;
          }

          // Make sure the span has the correct position at the start
          span.style.transform = 'translateX(100%)';

          span.addEventListener('animationend', handleAnimationEnd);
        });

        // Add a new text halfway through the animation if there's only one visible
        const addTextInterval = setInterval(() => {
          if (visibleTexts.length < 2) {
            setVisibleTexts(prev => [...prev, { text, id: nextId }]);
            setNextId(prev => prev + 1);
          }
        }, scrollSpeed * 1000 / 2);

        // Clean up any texts that have been around too long (safety measure)
        const cleanupInterval = setInterval(() => {
          // If we have more than 5 texts, something might be wrong with the animation end event
          // So let's clean up all but the most recent 2
          if (visibleTexts.length > 5) {
            const sortedTexts = [...visibleTexts].sort((a, b) => b.id - a.id);
            const recentTexts = sortedTexts.slice(0, 2);
            setVisibleTexts(recentTexts);
          }
        }, 5000); // Check every 5 seconds

        return () => {
          spans.forEach(span => {
            span.removeEventListener('animationend', handleAnimationEnd);
          });
          clearInterval(addTextInterval);
          clearInterval(cleanupInterval);
        };
      } else {
        // For static display, just set up blinking if needed
        const spans = marqueeRef.current.querySelectorAll('span');
        spans.forEach(span => {
          if (isBlinking) {
            const blinkAnimation = isColorChanging ? 'colorBlink' : 'blink';
            span.style.animation = `${blinkAnimation} ${blinkSpeed}s ease-in-out infinite`;
          } else {
            span.style.animation = 'none';
          }

          // Reset position for static display
          span.style.transform = 'none';
        });
      }
    }

    // Add event listener for the Escape key to return to config
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [scrollSpeed, navigate, isBlinking, blinkSpeed, isColorChanging, text, fontSize, displayMode, visibleTexts, nextId, isScrolling]);

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="display-container">
      <div
        className="light-sign-fullscreen"
        style={{ backgroundColor }}
      >
        <div className={`marquee ${!isScrolling ? 'static-text' : ''}`} ref={marqueeRef}>
          {visibleTexts.map(item => (
            <span
              key={item.id}
              data-id={item.id}
              className={`marquee-text ${displayMode === 'pixel' ? 'pixel-mode' : ''} ${!isScrolling ? 'static-text' : ''}`}
              style={{
                color: textColor,
                fontSize: `${fontSize}px`,
                paddingLeft: isScrolling ? '100%' : '0',
                transform: isScrolling ? undefined : 'none',
                position: isScrolling ? 'absolute' : 'static',
                textAlign: isScrolling ? 'left' : 'center',
                width: isScrolling ? 'auto' : '100%'
              }}
            >
              {item.text}
            </span>
          ))}
        </div>
      </div>
      <button className="back-button" onClick={handleBackClick}>
        Back to Config
      </button>

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

export default LightBoardDisplay;
