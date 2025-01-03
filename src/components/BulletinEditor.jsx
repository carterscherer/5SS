import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const BulletinEditor = () => {
    const [flyers, setFlyers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [newImageUrl, setNewImageUrl] = useState("");

    useEffect(() => {
        const getFlyers = async () => {
            try {
                const flyersCollection = collection(db, "flyer");
                const querySnapshot = await getDocs(flyersCollection);
                const flyerData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setFlyers(flyerData);
            } catch (err) {
                console.error("Error fetching flyer images:", err);
            }
        };
        getFlyers();
    }, []);

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
    );
};

export default BulletinEditor; 