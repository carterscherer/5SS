import React, { useEffect, useState } from 'react';
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import logo from '../assets/logo.png';
//import Simplelogo from '../assets/simpleLogo.png';
//import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";
import { Navigate } from 'react-router-dom';
import { PiSealWarningFill, PiSealCheckFill, PiSealPercentFill } from "react-icons/pi";

import "../scss/components/_menu.scss";
import { useAuth } from "../context/authContext";

const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const { isApproved, userLoggedIn } = useAuth();

    useEffect(() => {
        // Fetch menu items from Firestore
        const fetchMenuItems = async () => {
            if (!userLoggedIn || !isApproved) {
                return;
            }

            try {
                const menuCollectionRef = collection(db, "menu");
                const data = await getDocs(menuCollectionRef);
                const fetchedMenuItems = data.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                const sortedMenuItems = fetchedMenuItems.sort((a, b) => a.orderIndex - b.orderIndex);
                setMenuItems(sortedMenuItems);
            } catch (err) {
                console.error("Error fetching menu items:", err);
            }
        };

        fetchMenuItems();
    }, [userLoggedIn, isApproved]);

    if (!userLoggedIn || !isApproved) {
        return <Navigate to="/pending" />;
    }

    const formatBulletPoints = (text) => {
        if (!text) return null;
        return text.split('\n').filter(item => item.trim()).map((item, index) => (
            <li key={index}>{item.trim()}</li>
        ));
    };

    return (
        <div className="menu">
            <div className="menu-title-container">
                <h1 className="menu-title">MENU</h1>
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <div className="menu-grid">
                {menuItems.length > 0 ? (
                    menuItems.map((item) => (
                        <div key={item.id} className="menu-item">
                            <ImageCarousel images={item.images} title={item.title} status={item.status} />
                            <h3 className="menu-item-title">{item.title}</h3>
                            <ul className="menu-item-list">
                                {formatBulletPoints(item.pricing)}
                            </ul>
                            <ul className="menu-item-list">
                                {formatBulletPoints(item.strains)}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p>No menu items available.</p>
                )}
            </div>
        </div>
    );
};

// Carousel component for images
const ImageCarousel = ({ images, title, status }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showTooltip, setShowTooltip] = useState(false);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    const getStatusIcon = () => {
        let statusText = '';
        switch (status) {
            case 'low_inventory':
                statusText = 'Low Inventory';
                return (
                    <>
                        <PiSealWarningFill
                            className="status-icon"
                            onClick={() => setShowTooltip(!showTooltip)}
                        />
                        {showTooltip && (
                            <div className="status-tooltip" onAnimationEnd={() => setShowTooltip(false)}>
                                <svg viewBox="0 0 100 100">
                                    <path id="curve" d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
                                    <text>
                                        <textPath href="#curve" startOffset="0">
                                            {statusText}
                                        </textPath>
                                    </text>
                                </svg>
                            </div>
                        )}
                    </>
                );
            case 'hot':
                statusText = 'Hot Item';
                return (
                    <>
                        <PiSealCheckFill
                            className="status-icon"
                            onClick={() => setShowTooltip(!showTooltip)}
                        />
                        {showTooltip && (
                            <div className="status-tooltip" onAnimationEnd={() => setShowTooltip(false)}>
                                <svg viewBox="0 0 100 100">
                                    <path id="curve" d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
                                    <text>
                                        <textPath href="#curve" startOffset="0">
                                            {statusText}
                                        </textPath>
                                    </text>
                                </svg>
                            </div>
                        )}
                    </>
                );
            case 'price_change':
                statusText = 'Price Change';
                return (
                    <>
                        <PiSealPercentFill
                            className="status-icon"
                            onClick={() => setShowTooltip(!showTooltip)}
                        />
                        {showTooltip && (
                            <div className="status-tooltip" onAnimationEnd={() => setShowTooltip(false)}>
                                <svg viewBox="0 0 100 100">
                                    <path id="curve" d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
                                    <text>
                                        <textPath href="#curve" startOffset="0">
                                            {statusText}
                                        </textPath>
                                    </text>
                                </svg>
                            </div>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="carousel-container">
            <button onClick={handlePrev} className="carousel-button left">
                <IoMdArrowDropleft />
            </button>
            <div className="image-wrapper">
                <img src={images[currentIndex]} alt={title} className="menu-item-image" />
                {getStatusIcon()}
            </div>
            <button onClick={handleNext} className="carousel-button right">
                <IoMdArrowDropright />
            </button>
        </div>
    );
};

export default Menu;
