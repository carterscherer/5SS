import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase/firebase';
import "../scss/components/_bulletin.scss";
import logo from '../assets/simpleLogo.png';

const Bulletin = () => {
    const [flyers, setFlyers] = useState([]);

    useEffect(() => {
        const fetchFlyers = async () => {
            try {
                const flyersCollectionRef = collection(db, "flyer");
                const data = await getDocs(flyersCollectionRef);
                const flyerData = data.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFlyers(flyerData);
            } catch (err) {
                console.error("Error fetching flyers:", err);
            }
        };

        fetchFlyers();
    }, []);

    return (
        <div className="bulletin">
            <div className="bulletin-title-container">
                <h1>BULLETIN</h1>
                <img src={logo} alt="Logo" className="logo" />
            </div>

            <section className="intro-section">
                <p>At Fivestar Stash, we prioritize your experience through exclusive membership benefits
                    and direct communication with our store. Our members enjoy personalized service and
                    special access to premium offerings.</p>
            </section>

            <section className="flyers-section">
                <h2>Bulletin Flyers</h2>
                <div className="flyers-container">
                    {flyers.map((flyer) => (
                        <img
                            key={flyer.id}
                            src={flyer.image}
                            alt="Flyer"
                            className="flyer-image"
                        />
                    ))}
                </div>
                <p className="updates-notice">
                    Member updates are available here. Check back to the bulletin for limited time offers.
                </p>
            </section>

            <section className="disclaimer">
                <p>Disclaimer: Offers subject to change. Member benefits may vary.
                    Please see membership terms and conditions for full details.</p>
            </section>
        </div>
    );
};

export default Bulletin; 