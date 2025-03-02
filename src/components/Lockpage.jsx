import React, { useState, useEffect } from 'react';
import simpleLogo from '../assets/simpleLogo.png';
import Backend from './Backend';
import Backendheader from '../components/Backendheader'
import "../scss/components/_lockpage.scss";
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Lockpage() {
  const [inputPin, setInputPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [gateCode, setGateCode] = useState(null);

  useEffect(() => {
    const fetchGateCode = async () => {
      try {
        const infoCollection = collection(db, 'info');
        const snapshot = await getDocs(infoCollection);
        if (!snapshot.empty) {
          const infoDoc = snapshot.docs[0].data();
          setGateCode(infoDoc.gateCode);
        }
      } catch (error) {
        console.error('Error fetching gate code:', error);
      }
    };

    fetchGateCode();
  }, []);

  const handleUnlock = () => {
    if (gateCode && inputPin === gateCode) {
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
            type="text"
            value={inputPin}
            onChange={(e) => setInputPin(e.target.value)}
            onKeyDown={handleKeyDown}
            inputMode="text"
            autoComplete="current-pin"
            name="gate-pin"
            id="gate-pin"
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
