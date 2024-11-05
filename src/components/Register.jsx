import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { doCreateUserWithEmailAndPassword } from '../firebase/auth'
import { db } from '../firebase/firebase' // Import Firestore instance
import { doc, setDoc } from 'firebase/firestore' // Firestore methods
import "../scss/components/_register.scss"

const Register = () => {
    const navigate = useNavigate()

    const [firstName, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { userLoggedIn } = useAuth()

    const onSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match")
            return
        }

        setErrorMessage('')

        if (!isRegistering) {
            setIsRegistering(true)
            try {
                const userCredential = await doCreateUserWithEmailAndPassword(email, password)
                const userId = userCredential.user.uid

                // Save additional data to Firestore
                await setDoc(doc(db, "users", userId), {
                    firstName: firstName,
                    userId: userId,
                    isApproved: false
                })

                navigate('/home')
            } catch (error) {
                setErrorMessage(error.message)
            } finally {
                setIsRegistering(false)
            }
        }
    }

    return (
        <div className="register-page">
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}
            
            <main className="register-container">
                <div className="register-box">
                    <header className="register-header">
                        <h3>Create a New Account</h3>
                    </header>
    
                    <form className="register-form" onSubmit={onSubmit}>
                        {/* First Name Field */}
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                id="firstName"
                                type="text"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="form-input"
                            />
                        </div>
    
                        {/* Email Field */}
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                autoComplete='email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                            />
                        </div>
    
                        {/* Password Field */}
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                disabled={isRegistering}
                                type="password"
                                autoComplete='new-password'
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                            />
                        </div>
    
                        {/* Confirm Password Field */}
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                disabled={isRegistering}
                                type="password"
                                autoComplete='off'
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="form-input"
                            />
                        </div>
    
                        {errorMessage && (
                            <span className="error-message">{errorMessage}</span>
                        )}
    
                        <button className="submit-button" type="submit" disabled={isRegistering}>
                            {isRegistering ? 'Signing Up...' : 'Sign Up'}
                        </button>
    
                        <div className="login-link">
                            Already have an account?{' '}
                            <Link to={'/login'}>Continue</Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default Register
