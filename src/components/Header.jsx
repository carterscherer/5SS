import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { doSignOut } from '../firebase/auth'
import "../scss/components/_header.scss";
import { BsFillPersonBadgeFill } from "react-icons/bs";


const Header = () => {

    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    
    return (
        <nav className="header-nav">
            <div className="header-user-icon"><BsFillPersonBadgeFill /></div>
            <div className="header-user">{currentUser.displayName ? currentUser.displayName : currentUser.email}</div>
            {
                userLoggedIn
                ? (
                    <button className="header-button logout-button" onClick={() => { 
                        doSignOut().then(() => { navigate('/login') }) 
                    }}>
                        Logout
                        
                    </button>
                ) : (
                    <>
                        <Link className="header-link" to={'/login'}>Login</Link>
                        <Link className="header-link" to={'/register'}>Register New Account</Link>
                    </>
                )
            }
        </nav>
    )
}

export default Header
