import React, { useEffect, useState } from 'react';
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import logo from '../assets/logo.png';
import Simplelogo from '../assets/simpleLogo.png';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Import React Icons
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";

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

                // Sort items by orderIndex before setting them in state
                const sortedMenuItems = fetchedMenuItems.sort((a, b) => a.orderIndex - b.orderIndex);

                setMenuItems(sortedMenuItems); // Set the sorted data to state
            } catch (err) {
                console.error("Error fetching menu items:", err);
            }
        };

        fetchApprovalStatus();
        fetchMenuItems();
    }, []);

    const formatBulletPoints = (text) => {
        if (!text) return null;
        return text.split('\n').filter(item => item.trim()).map((item, index) => (
            <li key={index}>{item.trim()}</li>
        ));
    };

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
                                    <ImageCarousel images={item.images} title={item.title} />
                                    <h3 className="menu-item-title">{item.title}</h3>
                                    <ul className="menu-item-list">
                                        {formatBulletPoints(item.strains)}
                                    </ul>
                                    <ul className="menu-item-list">
                                        {formatBulletPoints(item.pricing)}
                                    </ul>
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

// Carousel component for images
const ImageCarousel = ({ images, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div className="carousel-container">
            <button onClick={handlePrev} className="carousel-button left">
                <IoMdArrowDropleft />
            </button>
            <img src={images[currentIndex]} alt={title} className="menu-item-image" />
            <button onClick={handleNext} className="carousel-button right">
                <IoMdArrowDropright />
            </button>
        </div>
    );
};

export default Menu;
