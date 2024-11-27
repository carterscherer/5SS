import React, { useState } from 'react';
import simpleLogo from '../assets/simpleLogo.png';
import Backend from './Backend';
import Backendheader from '../components/Backendheader'
import "../scss/components/_lockpage.scss";

export default function Lockpage() {
  const [inputPin, setInputPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const validPins = ["4495", "0000", "5678", "9012"]; // Example 4-digit PINs

  const handleUnlock = () => {
    if (validPins.includes(inputPin)) {
      setIsUnlocked(true);
    } else {
      alert("Incorrect PIN, please try again.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleUnlock();
    }
  };

  return (
    <div className="lockpage">
      {!isUnlocked ? (
        <div className="pin-container">
          <div className="simpleLogo">
            <img src={simpleLogo} alt="Logo" />
          </div>
          <p className="prompt">Enter Code:</p>
          <input
            type="tel"
            maxLength="4"
            value={inputPin}
            onChange={(e) => setInputPin(e.target.value.replace(/\D/g, ''))} // Allow only digits
            onKeyDown={handleKeyDown} // Add keydown handler
          />
          <button onClick={handleUnlock}>Unlock</button>
        </div>
      ) : (
        <div>
        <Backendheader />
        <Backend />
        </div>
      )}
    </div>
  );
}
