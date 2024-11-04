import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { doCreateUserWithEmailAndPassword } from '../firebase/auth'
import { db } from '../firebase/firebase' // Import Firestore instance
import { doc, setDoc } from 'firebase/firestore' // Firestore methods

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
        <>
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}

            <main>
                <div>
                    <div>
                        <h3>Create a New Account</h3>
                    </div>

                    <form onSubmit={onSubmit}>
                        {/* First Name Field */}
                        <div>
                            <label>First Name</label>
                            <input
                                type="text"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                autoComplete='email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label>Password</label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='new-password'
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label>Confirm Password</label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='off'
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {errorMessage && (
                            <span>{errorMessage}</span>
                        )}

                        <button type="submit" disabled={isRegistering}>
                            {isRegistering ? 'Signing Up...' : 'Sign Up'}
                        </button>

                        <div>
                            Already have an account? {' '}
                            <Link to={'/login'}>Continue</Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Register
