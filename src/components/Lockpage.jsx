import React, { useState } from 'react';
import logo from '../assets/logo.png';
import simpleLogo from '../assets/simpleLogo.png';

export default function Lockpage() {
  const [inputPin, setInputPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const validPins = ["1234", "5678", "9012"]; // Example 4-digit PINs

  const handleUnlock = () => {
    if (validPins.includes(inputPin)) {
      setIsUnlocked(true);
    } else {
      alert("Incorrect PIN, please try again.");
    }
  };

  return (
    <div className="lockpage">
      {!isUnlocked ? (
        <div className="pin-container">
            <div className="simpleLogo">
                <img src={simpleLogo} alt="Logo" />
            </div>
          <p className="prompt">Enter 4-digit PIN:</p>
          <input
            type="tel"
            maxLength="4"
            value={inputPin}
            onChange={(e) => setInputPin(e.target.value.replace(/\D/g, ''))} // Allow only digits
          />
          <button onClick={handleUnlock}>Unlock</button>
        </div>
      ) : (
        <div className="lockpage-logo">
          <img src={logo} alt="Logo" />
          <div className="textBox">
            <h1 className="title">MENU</h1>
            <p className="description">this is a sample menu</p>
          </div>
        </div>
      )}
    </div>
  );
}
