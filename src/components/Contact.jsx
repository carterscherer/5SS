import React from 'react';
import { FaPhone, FaInstagram } from 'react-icons/fa';
import { SiSignal } from 'react-icons/si';
import "../scss/components/_contact.scss";

const Contact = () => {
    return (
        <div className="contact">
            <div className="contact-title-container">
                <h1 className="contact-title">Contact Us</h1>
            </div>

            <div className="contact-grid">
                <a href="tel:+12017836783" className="contact-item">
                    <FaPhone className="contact-icon" />
                    <span className="contact-text">(120) 178-6783</span>
                </a>

                <a href="https://instagram.com/5starstash" target="_blank" rel="noopener noreferrer" className="contact-item">
                    <FaInstagram className="contact-icon" />
                    <span className="contact-text">@5starstash</span>
                </a>

                <a href="https://signal.me/yoursignal" target="_blank" rel="noopener noreferrer" className="contact-item">
                    <SiSignal className="contact-icon" />
                    <span className="contact-text">Signal</span>
                </a>
            </div>
        </div>
    );
};

export default Contact; 