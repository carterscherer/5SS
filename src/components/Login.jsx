import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { doSignInWithEmailAndPassword, doSignInWithGoogle, doPasswordReset } from "../firebase/auth";
import { useAuth } from "../context/authContext";
import { FcGoogle } from "react-icons/fc";
import "../scss/components/_login.scss";
import Logo from '../assets/logo.png';

const Login = () => {
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [resetMessage, setResetMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            setErrorMessage('');
            try {
                await doSignInWithEmailAndPassword(email, password);
            } catch (error) {
                if (error.code === 'auth/wrong-password') {
                    setErrorMessage('Invalid password, please try again.');
                } else if (error.code === 'auth/user-not-found') {
                    setErrorMessage('No account found with this email.');
                } else {
                    setErrorMessage('An unexpected error occurred. Please try again.');
                }
                setIsSigningIn(false);
            }
        }
    };

    const onGoogleSignIn = async () => {
        if (!isSigningIn) {
            setIsSigningIn(true);
            doSignInWithGoogle().catch(() => setIsSigningIn(false));
        }
    };

    const onForgotPassword = async () => {
        setResetMessage('');
        setErrorMessage('');
        if (!email) {
            setErrorMessage('Please enter your email to reset your password.');
            return;
        }
        try {
            await doPasswordReset(email); // Use the imported function
            setResetMessage('Password reset email sent! Check your inbox.');
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                setErrorMessage('No account found with this email.');
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        }
    };    

    return (
        <div className="login-page">
            {userLoggedIn && (<Navigate to="/home" replace={true} />)}
            <main className="login-container">
                <div className="login-box">
                    <div className="simpleLogo"><img src={ Logo } alt="Logo" /></div>
                    <header className="login-header"></header>
                    <form className="login-form" onSubmit={onSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                            />
                        </div>
                        {errorMessage && (
                            <span className="error-message">{errorMessage}</span>
                        )}
                        {resetMessage && (
                            <span className="reset-message">{resetMessage}</span>
                        )}
                        <button className="submit-button" type="submit" disabled={isSigningIn}>
                            {isSigningIn ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                    <button className="forgot-password" onClick={onForgotPassword}>
                        Forgot Password?
                    </button>
                    <p className="register-link">
                        Don’t have an account? <Link to="/register">Sign up</Link>
                    </p>
                    <div className="divider">
                        <span className="divider-line"></span>
                        <span className="divider-text">OR</span>
                        <span className="divider-line"></span>
                    </div>
                    <button
                        className="google-signin"
                        onClick={onGoogleSignIn}
                        onTouchStart={onGoogleSignIn}
                    >
                        <FcGoogle size={20} />
                        {isSigningIn ? 'Signing In...' : 'Continue with Google'}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Login;
