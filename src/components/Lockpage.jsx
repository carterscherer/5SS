import React, { useState } from 'react';
import simpleLogo from '../assets/simpleLogo.png';
import Backend from './Backend';
import Backendheader from '../components/Backendheader'
import "../scss/components/_lockpage.scss";

export default function Lockpage() {
  const [inputPin, setInputPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const validPins = ["957!32a3z1"]; // Changed to text passwords

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
          <p className="prompt">Enter Password:</p>
          <input
            type="password"
            value={inputPin}
            onChange={(e) => setInputPin(e.target.value)}
            onKeyDown={handleKeyDown}
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
