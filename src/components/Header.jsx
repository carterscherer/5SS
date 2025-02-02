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

    // Get display name from auth
    const getDisplayName = () => {
        return currentUser?.displayName || '';
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
                    <Link to="/home" className="nav-link">Menu</Link>
                    <Link to="/bulletin" className="nav-link">Bulletin</Link>
                    <Link to="/contact" className="nav-link">Contact</Link>
                </div>
            )}

            {/* Desktop User Info */}
            <div className="header-user-section">
                <div className="header-user-info">
                    <BsFillPersonBadgeFill className="header-user-icon" />
                    <span className="header-user">{getDisplayName()}</span>
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
                        <span className="header-user">{getDisplayName()}</span>
                    </div>
                    <div className="mobile-nav-links">
                        <Link to="/home" className="nav-link" onClick={toggleMenu}>Menu</Link>
                        <Link to="/bulletin" className="nav-link" onClick={toggleMenu}>Bulletin</Link>
                        <Link to="/contact" className="nav-link" onClick={toggleMenu}>Contact</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Header;
