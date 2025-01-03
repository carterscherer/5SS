import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { doSignOut } from '../firebase/auth'
import "../scss/components/_header.scss";
import { BsFillPersonBadgeFill } from "react-icons/bs";
import { BiSolidFoodMenu } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase/firebase';

const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const [flyers, setFlyers] = useState([]);
    const { currentUser } = useAuth()
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()

    useEffect(() => {
        const fetchFlyers = async () => {
            try {
                const flyersCollectionRef = collection(db, "flyer");
                const data = await getDocs(flyersCollectionRef);
                const flyerData = data.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log("Fetched flyer data:", flyerData);
                setFlyers(flyerData);
            } catch (err) {
                console.error("Error fetching flyers:", err);
            }
        };

        if (showModal) {
            fetchFlyers();
        }
    }, [showModal]);

    return (
        <>
            <nav className="header-nav">
                <button className="menu-icon-button" onClick={() => setShowModal(true)}>
                    <BiSolidFoodMenu />
                </button>
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

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close" onClick={() => setShowModal(false)}>
                            <IoMdClose />
                        </button>
                        <div className="flyers-container">
                            {flyers.map((flyer) => {
                                console.log("Rendering flyer:", flyer);
                                return (
                                    <img
                                        key={flyer.id}
                                        src={flyer.image}
                                        alt="Flyer"
                                        className="flyer-image"
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                        onError={(e) => console.error("Image failed to load:", e)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Header
