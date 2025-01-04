import React from 'react';
import Simplelogo from '../assets/simpleLogo.png';
import "../scss/components/_menu.scss"; // Reusing menu styles for consistent background

const Pending = () => {
    return (
        <div className="menu"> {/* Reusing menu class for background */}
            <div className="approval-message">
                <img src={Simplelogo} alt="simpleLogo" className="approval-logo" />
            </div>
            <div className="member-text">
                <h2>MEMBERSHIP REQUESTED.</h2>
                <p>Check back in later to access the menu.</p>
            </div>
        </div>
    );
};

export default Pending; 