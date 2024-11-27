import React, { useEffect, useState } from 'react';
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import logo from '../assets/logo.png';
import Simplelogo from '../assets/simpleLogo.png';
import "../scss/components/_menu.scss";

const Menu = () => {
    const [isApproved, setIsApproved] = useState(null); // Null indicates loading
    const [loading, setLoading] = useState(true);
    const [menuItems, setMenuItems] = useState([]); // State to hold menu items from Firestore

    useEffect(() => {
        // Fetch user's approval status
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

        // Fetch menu items from Firestore
        const fetchMenuItems = async () => {
            try {
                const menuCollectionRef = collection(db, "menu"); // Reference to your Firestore "menu" collection
                const data = await getDocs(menuCollectionRef);
                const fetchedMenuItems = data.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMenuItems(fetchedMenuItems); // Set the fetched data to state
            } catch (err) {
                console.error("Error fetching menu items:", err);
            }
        };

        fetchApprovalStatus();
        fetchMenuItems(); // Fetch menu items when the component loads
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
                        {menuItems.length > 0 ? (
                            menuItems.map((item) => (
                                <div key={item.id} className="menu-item">
                                    <img src={item.image || "https://via.placeholder.com/150"} alt={item.title} className="menu-item-image" />
                                    <h3 className="menu-item-title">{item.title}</h3>
                                    <p className="menu-item-description">{item.description}</p>
                                    <p className="menu-item-price">${item.price ? item.price.toFixed(2) : '0.00'}</p>
                                </div>
                            ))
                        ) : (
                            <p>No menu items available.</p>
                        )}
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
