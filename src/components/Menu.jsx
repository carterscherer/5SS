import React, { useEffect, useState } from 'react';
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import logo from '../assets/logo.png';
import Simplelogo from '../assets/simpleLogo.png';
import "../scss/components/_menu.scss";
import menuItems from '../utils/menuData';

const Menu = () => {
    const [isApproved, setIsApproved] = useState(null); // Null indicates loading
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApprovalStatus = async () => {
            const user = auth.currentUser;
            if (user) {
                const memberDoc = doc(db, "members", user.uid);
                const docSnap = await getDoc(memberDoc);

                if (docSnap.exists()) {
                    setIsApproved(docSnap.data().isApproved);
                } else {
                    console.error("No such document!");
                    setIsApproved(false);
                }
            }
            setLoading(false);
        };

        fetchApprovalStatus();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="menu">
            {isApproved ? (
                <>
                    <div className="menu-title-container">
                        <h1 className="menu-title">MENU</h1>
                        <img src={logo} alt="Logo" className="logo" />
                    </div>
                    <div className="menu-grid">
                        {menuItems.map((item) => (
                            <div key={item.id} className="menu-item">
                                <img src={item.image} alt={item.title} className="menu-item-image" />
                                <h3 className="menu-item-title">{item.title}</h3>
                                <p className="menu-item-description">{item.description}</p>
                                <p className="menu-item-price">{item.price}</p>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div>
                <div className="approval-message">
                    
                    <img src={Simplelogo} alt="simpleLogo" className="approval-logo" />
                </div>
                <div className="member-text">
                    <h2>MEMBERSHIP REQUESTED.</h2>
                    <p>Check back in later to access the menu.</p>
                </div>
                </div>
            )}
        </div>
    );
};

export default Menu;
