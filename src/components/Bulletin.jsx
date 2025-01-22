import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase/firebase';
import "../scss/components/_bulletin.scss";
import logo from '../assets/simpleLogo.png';
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";

const Bulletin = () => {
    const [flyers, setFlyers] = useState([]);
    const [bulletinContent, setBulletinContent] = useState({
        disclaimer: '',
        intro: '',
        updates: ''
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const flyersCollectionRef = collection(db, "flyer");
                const data = await getDocs(flyersCollectionRef);
                const flyerData = data.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFlyers(flyerData);

                const bulletinCollectionRef = collection(db, "bulletin");
                const bulletinData = await getDocs(bulletinCollectionRef);

                // Assuming there's only one document in the bulletin collection
                if (bulletinData.docs.length > 0) {
                    const bulletinDoc = bulletinData.docs[0].data();
                    setBulletinContent({
                        disclaimer: bulletinDoc.disclaimer || '',
                        intro: bulletinDoc.intro || '',
                        updates: bulletinDoc.updates || ''
                    });
                }
            } catch (err) {
                console.error("Error fetching content:", err);
            }
        };

        fetchContent();
    }, []);

    const ImageCarousel = ({ images }) => {
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
                <div className="image-wrapper">
                    <img src={images[currentIndex]} alt="Flyer" className="flyer-image" />
                </div>
                <button onClick={handleNext} className="carousel-button right">
                    <IoMdArrowDropright />
                </button>
            </div>
        );
    };

    return (
        <div className="bulletin">
            <div className="bulletin-title-container">
                <h1>HOME</h1>
                <img src={logo} alt="Logo" className="logo" />
            </div>

            <section className="intro-section">
                <p>{bulletinContent.intro}</p>
            </section>

            <section className="flyers-section">
                <h2>Bulletin Flyers</h2>
                <div className="flyers-container">
                    <div className="swiper-container">
                        <ImageCarousel images={flyers.map(flyer => flyer.image)} />
                    </div>
                    <div className="updates-notice">
                        <h3>Latest Updates</h3>
                        <p>{bulletinContent.updates}</p>
                    </div>
                </div>
            </section>

            <section className="disclaimer">
                <p>{bulletinContent.disclaimer}</p>
            </section>
        </div>
    );
};

export default Bulletin; 