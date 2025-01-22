import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { doSignOut } from '../firebase/auth'
import "../scss/components/_header.scss";
import { BsFillPersonBadgeFill } from "react-icons/bs";
import { ImMenu } from "react-icons/im";

const Header = () => {
    const { currentUser, userLoggedIn, isApproved } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    if (!userLoggedIn) return null;

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Get first name from email or displayName
    const getFirstName = () => {
        if (currentUser?.displayName) {
            return currentUser.displayName.split(' ')[0];
        }
        if (currentUser?.email) {
            return currentUser.email.split('@')[0];
        }
        return 'User';
    };

    return (
        <nav className="header-nav">
            {/* Mobile Menu Icon */}
            {isApproved && (
                <button className="mobile-menu-button" onClick={toggleMenu}>
                    <ImMenu />
                </button>
            )}

            {/* Desktop Navigation */}
            {isApproved && (
                <div className="desktop-nav">
                    <Link to="/bulletin" className="nav-link">Home</Link>
                    <Link to="/home" className="nav-link">Menu</Link>
                    <Link to="/contact" className="nav-link">Contact</Link>
                </div>
            )}

            {/* Desktop User Info */}
            <div className="header-user-section">
                <div className="header-user-info">
                    <BsFillPersonBadgeFill className="header-user-icon" />
                    <span className="header-user">{getFirstName()}</span>
                </div>
                <button
                    className="header-button logout-button"
                    onClick={() => doSignOut().then(() => navigate('/login'))}
                >
                    Logout
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isApproved && isMenuOpen && (
                <div className="mobile-menu-dropdown">
                    <div className="mobile-user-info">
                        <BsFillPersonBadgeFill className="header-user-icon" />
                        <span className="header-user">{getFirstName()}</span>
                    </div>
                    <div className="mobile-nav-links">
                        <Link to="/bulletin" className="nav-link" onClick={toggleMenu}>Home</Link>
                        <Link to="/home" className="nav-link" onClick={toggleMenu}>Menu</Link>
                        <Link to="/contact" className="nav-link" onClick={toggleMenu}>Contact</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Header;
