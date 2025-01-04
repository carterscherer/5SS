import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import "../scss/components/_subnav.scss";

const SubNav = () => {
    const { isApproved, userLoggedIn } = useAuth();
    const location = useLocation();

    // Only show nav if user is logged in (we'll show different content based on approval)
    if (!userLoggedIn) return null;

    return (
        <nav className="sub-nav">
            <div className="nav-links">
                <Link
                    to="/home"
                    className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}
                >
                    Home
                </Link>
                {isApproved && (
                    <>
                        <Link
                            to="/bulletin"
                            className={`nav-link ${location.pathname === '/bulletin' ? 'active' : ''}`}
                        >
                            Bulletin
                        </Link>
                        <Link
                            to="/contact"
                            className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
                        >
                            Contact
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default SubNav; 