import React from 'react';
import { SiSignal } from 'react-icons/si';
import "../scss/components/_contact.scss";

const Contact = () => {
    return (
        <div className="contact">
            <div className="contact-title-container">
                <h1 className="contact-title">Contact Us</h1>
            </div>

            <div className="contact-grid">
                <a href="https://signal.me/#eu/DBPkL-OerQ2rqLUcv27T5sRNUmpPvOALKLwRRrmuBaQXVlGcfw9Ko4gecFWM912n" target="_blank" rel="noopener noreferrer" className="contact-item">
                    <SiSignal className="contact-icon" />
                    <span className="contact-text">Signal</span>
                </a>
            </div>
        </div>
    );
};

export default Contact; 