import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Config from './Config'
import LightBoardDisplay from './LightBoardDisplay'

function App() {
  const [text, setText] = useState('WELCOME TO THE CONCERT')
  const [backgroundColor, setBackgroundColor] = useState('#000000')
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [scrollSpeed, setScrollSpeed] = useState(15)
  const [fontSize, setFontSize] = useState(36)
  const [isBlinking, setIsBlinking] = useState(false)
  const [blinkSpeed, setBlinkSpeed] = useState(1)
  const [isColorChanging, setIsColorChanging] = useState(false)
  const [displayMode, setDisplayMode] = useState('normal')
  const [isScrolling, setIsScrolling] = useState(true)

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Config
            text={text}
            setText={setText}
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
            textColor={textColor}
            setTextColor={setTextColor}
            scrollSpeed={scrollSpeed}
            setScrollSpeed={setScrollSpeed}
            fontSize={fontSize}
            setFontSize={setFontSize}
            isBlinking={isBlinking}
            setIsBlinking={setIsBlinking}
            blinkSpeed={blinkSpeed}
            setBlinkSpeed={setBlinkSpeed}
            isColorChanging={isColorChanging}
            setIsColorChanging={setIsColorChanging}
            displayMode={displayMode}
            setDisplayMode={setDisplayMode}
            isScrolling={isScrolling}
            setIsScrolling={setIsScrolling}
          />
        } />
        <Route path="/display" element={
          <LightBoardDisplay
            text={text}
            backgroundColor={backgroundColor}
            textColor={textColor}
            scrollSpeed={scrollSpeed}
            fontSize={fontSize}
            isBlinking={isBlinking}
            blinkSpeed={blinkSpeed}
            isColorChanging={isColorChanging}
            displayMode={displayMode}
            isScrolling={isScrolling}
          />
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
