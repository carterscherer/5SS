import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { doSignOut, doPasswordReset, doUpdateEmail, doDeleteAccount } from '../firebase/auth'
import "../scss/components/_header.scss";
import { BsFillPersonBadgeFill, BsBoxArrowRight, BsTrash, BsKey, BsEnvelope } from "react-icons/bs";
import { ImMenu } from "react-icons/im";
import Modal from 'react-modal';
import Landscape from "../assets/landscape.png";

const Header = () => {
    const { currentUser, userLoggedIn, isApproved } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [emailUpdateMessage, setEmailUpdateMessage] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
    const [password, setPassword] = useState('');
    const [isReauthModalOpen, setIsReauthModalOpen] = useState(false);
    const navigate = useNavigate();

    if (!userLoggedIn) return null;

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    // Get display name from auth
    const getDisplayName = () => {
        return currentUser?.displayName || '';
    };

    const handleResetPassword = async () => {
        try {
            await doPasswordReset(currentUser.email);
            setIsResetModalOpen(false);
            alert('Password reset email sent! Check your inbox.');
        } catch (error) {
            alert('Failed to send password reset email. Please try again.');
        }
    };

    const handleUpdateEmail = async () => {
        try {
            await doUpdateEmail(newEmail);
            setIsEmailModalOpen(false);
            setEmailUpdateMessage('');
            alert('Email updated successfully!');
        } catch (error) {
            setEmailUpdateMessage(error.message);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmation.toLowerCase() !== 'delete') {
            setDeleteErrorMessage('Please type "delete" to confirm');
            return;
        }

        setIsDeleteModalOpen(false);
        setIsReauthModalOpen(true);
    };

    const handleReauthenticateAndDelete = async () => {
        try {
            await doDeleteAccount(password);
            setIsReauthModalOpen(false);
            navigate('/login');
        } catch (error) {
            setDeleteErrorMessage(error.message);
        }
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
                    <Link to="/menu" className="nav-link">Menu</Link>
                    <Link to="/bulletin" className="nav-link">Bulletin</Link>
                    <Link to="/contact" className="nav-link">Contact</Link>
                </div>
            )}

            {/* Desktop User Info */}
            <div className="header-user-section">
                <div className="header-user-info" onClick={toggleUserMenu}>
                    <BsFillPersonBadgeFill className="header-user-icon" />
                    <span className="header-user">{getDisplayName()}</span>
                </div>

                {/* Desktop User Menu Dropdown */}
                {isUserMenuOpen && (
                    <div className="user-menu-dropdown">
                        <button
                            className="menu-item"
                            onClick={() => doSignOut().then(() => navigate('/login'))}
                        >
                            <BsBoxArrowRight className="menu-icon" />
                            <span>Logout</span>
                        </button>
                        <button
                            className="menu-item"
                            onClick={() => setIsResetModalOpen(true)}
                        >
                            <BsKey className="menu-icon" />
                            <span>Reset Password</span>
                        </button>
                        {/* <button
                            className="menu-item"
                            onClick={() => setIsEmailModalOpen(true)}
                        >
                            <BsEnvelope className="menu-icon" />
                            <span>Update Email</span>
                        </button> */}
                        <button
                            className="menu-item"
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            <BsTrash className="menu-icon" />
                            <span>Delete Account</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Reset Password Modal */}
            <Modal
                isOpen={isResetModalOpen}
                onRequestClose={() => setIsResetModalOpen(false)}
                className="reset-modal"
                overlayClassName="reset-overlay"
            >
                <h2>Reset Password</h2>
                <p>Are you sure you want to reset your password? A reset link will be sent to your email.</p>
                <div className="modal-buttons">
                    <button onClick={handleResetPassword}>Yes</button>
                    <button onClick={() => setIsResetModalOpen(false)}>No</button>
                </div>
            </Modal>

            {/* Email Update Modal */}
            <Modal
                isOpen={isEmailModalOpen}
                onRequestClose={() => setIsEmailModalOpen(false)}
                className="email-modal"
                overlayClassName="email-overlay"
            >
                <h2>Update Email Address</h2>
                <p>Enter your new email address:</p>
                <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="email-input"
                />
                {emailUpdateMessage && (
                    <span className="error-message">{emailUpdateMessage}</span>
                )}
                <div className="modal-buttons">
                    <button onClick={handleUpdateEmail}>Update</button>
                    <button onClick={() => setIsEmailModalOpen(false)}>Cancel</button>
                </div>
            </Modal>

            {/* Delete Account Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onRequestClose={() => setIsDeleteModalOpen(false)}
                className="delete-modal"
                overlayClassName="delete-overlay"
            >
                <h2>Delete Account</h2>
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <p>Type "delete" to confirm:</p>
                <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="delete-input"
                />
                {deleteErrorMessage && (
                    <span className="error-message">{deleteErrorMessage}</span>
                )}
                <div className="modal-buttons">
                    <button onClick={handleDeleteAccount}>Delete Account</button>
                    <button onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                </div>
            </Modal>

            {/* Reauthentication Modal */}
            <Modal
                isOpen={isReauthModalOpen}
                onRequestClose={() => setIsReauthModalOpen(false)}
                className="delete-modal"
                overlayClassName="delete-overlay"
            >
                <h2>Reauthentication Required</h2>
                <p>Please enter your password to confirm account deletion:</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="delete-input"
                />
                {deleteErrorMessage && (
                    <span className="error-message">{deleteErrorMessage}</span>
                )}
                <div className="modal-buttons">
                    <button onClick={handleReauthenticateAndDelete}>Confirm</button>
                    <button onClick={() => setIsReauthModalOpen(false)}>Cancel</button>
                </div>
            </Modal>

            {/* Mobile Menu Dropdown */}
            {isApproved && isMenuOpen && (
                <div className="mobile-menu-dropdown">
                    <div className="mobile-user-info">
                        <BsFillPersonBadgeFill className="header-user-icon" />
                        <span className="header-user">{getDisplayName()}</span>
                    </div>
                    <div className="mobile-nav-links">
                        <Link to="/menu" className="nav-link" onClick={toggleMenu}>Menu</Link>
                        <Link to="/bulletin" className="nav-link" onClick={toggleMenu}>Bulletin</Link>
                        <Link to="/contact" className="nav-link" onClick={toggleMenu}>Contact</Link>
                    </div>
                    <img 
                src={Landscape} 
                alt="Landscape" 
                className="landscape-image" 
                style={{ 
                    opacity: 0.1, 
                    padding: 0,
                    width: '100%',
                    height: '17%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 0,
                }}
            />
                    <div className="mobile-actions">
                        <button
                            className="mobile-action-item"
                            onClick={() => doSignOut().then(() => navigate('/login'))}
                        >
                            <BsBoxArrowRight className="menu-icon" />
                            <span>Logout</span>
                        </button>
                        <button
                            className="mobile-action-item"
                            onClick={() => {
                                toggleMenu();
                                setIsResetModalOpen(true);
                            }}
                        >
                            <BsKey className="mobile-action-icon" />
                            <span>Reset Password</span>
                        </button>
                        {/* <button
                            className="mobile-action-item"
                            onClick={() => {
                                toggleMenu();
                                setIsEmailModalOpen(true);
                            }}
                        >
                            <BsEnvelope className="mobile-action-icon" />
                            <span>Update Email</span>
                        </button> */}
                        <button
                            className="mobile-action-item"
                            onClick={() => {
                                toggleMenu();
                                setIsDeleteModalOpen(true);
                            }}
                        >
                            <BsTrash className="mobile-action-icon" />
                            <span>Delete Account</span>
                        </button>
                    </div>
                </div>
            )}
            
        </nav>
    );
};

export default Header;
