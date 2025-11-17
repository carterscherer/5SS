import React from 'react';
import { SiSignal } from 'react-icons/si';
import "../scss/components/_contact.scss";
import logo from "../assets/logo.png";
const Contact = () => {
    return (
        <div className="contact">
            <div className="contact-title-container">
                <img src={logo} alt="Logo" className="logo" />
                <h1 className="contact-title">CONTACT</h1>
            </div>

            <div className="contact-grid">
                <a href="https://signal.me/#eu/-jVh-fCCpMFPiBX5EH2fqM9yMXUTXbesrLG_IhlpveHcqH3LighL2qypjdoiL4O_" target="_blank" rel="noopener noreferrer" className="contact-item">
                    <SiSignal className="contact-icon" />
                    <span className="contact-text">Signal</span>
                </a>
            </div>
        </div>
    );
};

export default Contact; 