import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import "../scss/components/_backend.scss";
import "../scss/components/_bulletin.scss";

const BulletinEditor = () => {
    const [flyers, setFlyers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newImageUrl, setNewImageUrl] = useState("");
    const [bulletinContent, setBulletinContent] = useState({
        intro: '',
        disclaimer: '',
        updates: ''
    });
    const [editingField, setEditingField] = useState(null);

    useEffect(() => {
        const getContent = async () => {
            try {
                // Fetch flyers
                const flyersCollection = collection(db, "flyer");
                const flyersSnapshot = await getDocs(flyersCollection);
                const flyerData = flyersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFlyers(flyerData);

                // Fetch bulletin content
                const bulletinCollection = collection(db, "bulletin");
                const bulletinSnapshot = await getDocs(bulletinCollection);
                if (bulletinSnapshot.docs.length > 0) {
                    const content = bulletinSnapshot.docs[0].data();
                    setBulletinContent({
                        intro: content.intro || '',
                        disclaimer: content.disclaimer || '',
                        updates: content.updates || ''
                    });
                }
            } catch (err) {
                console.error("Error fetching content:", err);
            }
        };
        getContent();
    }, []);

    const handleContentUpdate = async (field) => {
        try {
            const bulletinCollection = collection(db, "bulletin");
            const bulletinSnapshot = await getDocs(bulletinCollection);
            if (bulletinSnapshot.docs.length > 0) {
                const docId = bulletinSnapshot.docs[0].id;
                const bulletinDoc = doc(db, "bulletin", docId);
                await updateDoc(bulletinDoc, { [field]: bulletinContent[field] });
            }
            setEditingField(null);
        } catch (err) {
            console.error("Error updating bulletin content:", err);
        }
    };

    const handleUpdate = async (flyerId) => {
        try {
            let processedUrl = newImageUrl;
            if (processedUrl.includes('github.com') && processedUrl.includes('/blob/')) {
                processedUrl = processedUrl.replace('github.com', 'raw.githubusercontent.com')
                    .replace('/blob/', '/');
            }

            const flyerDoc = doc(db, "flyer", flyerId);
            await updateDoc(flyerDoc, { image: processedUrl });

            setFlyers(prevFlyers =>
                prevFlyers.map(flyer =>
                    flyer.id === flyerId ? { ...flyer, image: processedUrl } : flyer
                )
            );
            setEditingId(null);
            setNewImageUrl("");
        } catch (err) {
            console.error("Error updating flyer image:", err);
        }
    };

    const processImageUrl = (url) => {
        // First convert GitHub blob URLs to raw URLs
        let processedUrl = url;
        if (url.includes('github.com') && url.includes('/blob/')) {
            processedUrl = url.replace('github.com', 'raw.githubusercontent.com')
                .replace('/blob/', '/');
        }

        // Add size parameter to raw GitHub URLs
        if (processedUrl.includes('raw.githubusercontent.com')) {
            processedUrl = processedUrl + '?size=150';
        }

        return processedUrl;
    };

    return (
        <div className="bulletin-editor">
            <div className="content-editor">
                {['intro', 'disclaimer', 'updates'].map((field) => (
                    <div key={field} className="content-item">
                        <h3>{field.toUpperCase()}</h3>
                        {editingField === field ? (
                            <div className="edit-controls">
                                <textarea
                                    value={bulletinContent[field]}
                                    onChange={(e) => setBulletinContent(prev => ({
                                        ...prev,
                                        [field]: e.target.value
                                    }))}
                                    rows={5}
                                />
                                <div className="button-group">
                                    <button onClick={() => handleContentUpdate(field)}>Save</button>
                                    <button onClick={() => setEditingField(null)}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p>{bulletinContent[field]}</p>
                                <button onClick={() => setEditingField(field)}>Edit</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <div className="flyers-editor">
                {flyers.map(flyer => (
                    <div key={flyer.id} className="bulletin-item">
                        <div className="bulletin-image-container">
                            <img
                                src={processImageUrl(flyer.image)}
                                alt="Flyer"
                                className="bulletin-image"
                                width="150"
                                height="150"
                                loading="lazy"
                            />
                        </div>

                        {editingId === flyer.id ? (
                            <div className="edit-controls">
                                <input
                                    type="text"
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    placeholder="Enter new image URL"
                                />
                                <div className="button-group">
                                    <button onClick={() => handleUpdate(flyer.id)}>Save</button>
                                    <button onClick={() => {
                                        setEditingId(null);
                                        setNewImageUrl("");
                                    }}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => {
                                setEditingId(flyer.id);
                                setNewImageUrl(flyer.image);
                            }}>Edit Image URL</button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BulletinEditor; 