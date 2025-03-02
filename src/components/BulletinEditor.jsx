import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
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
    const [testimonials, setTestimonials] = useState([]);
    const [addingTestimonial, setAddingTestimonial] = useState(false);
    const [newTestimonialUrl, setNewTestimonialUrl] = useState("");

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

                // Fetch testimonials
                const testimonialsCollection = collection(db, "testimonials");
                const testimonialsSnapshot = await getDocs(testimonialsCollection);
                const testimonialData = testimonialsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTestimonials(testimonialData);
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

    const handleAddTestimonial = async () => {
        try {
            let processedUrl = newTestimonialUrl;
            if (processedUrl.includes('github.com') && processedUrl.includes('/blob/')) {
                processedUrl = processedUrl.replace('github.com', 'raw.githubusercontent.com')
                    .replace('/blob/', '/');
            }

            const testimonialCollection = collection(db, "testimonials");
            const newTestimonial = await addDoc(testimonialCollection, {
                image: processedUrl
            });

            setTestimonials(prev => [...prev, { id: newTestimonial.id, image: processedUrl }]);
            setAddingTestimonial(false);
            setNewTestimonialUrl("");
        } catch (err) {
            console.error("Error adding testimonial:", err);
        }
    };

    const handleDeleteTestimonial = async (id) => {
        try {
            await deleteDoc(doc(db, "testimonials", id));
            setTestimonials(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error("Error deleting testimonial:", err);
        }
    };

    const handleUpdateTestimonial = async (testimonialId) => {
        try {
            let processedUrl = newImageUrl;
            if (processedUrl.includes('github.com') && processedUrl.includes('/blob/')) {
                processedUrl = processedUrl.replace('github.com', 'raw.githubusercontent.com')
                    .replace('/blob/', '/');
            }

            const testimonialDoc = doc(db, "testimonials", testimonialId);
            await updateDoc(testimonialDoc, { image: processedUrl });

            setTestimonials(prevTestimonials =>
                prevTestimonials.map(testimonial =>
                    testimonial.id === testimonialId ? { ...testimonial, image: processedUrl } : testimonial
                )
            );
            setEditingId(null);
            setNewImageUrl("");
        } catch (err) {
            console.error("Error updating testimonial image:", err);
        }
    };

    return (
        <div className="bulletin-editor">
            <div className="content-editor">
                {/* Commenting out INTRO and DISCLAIMER sections */}
                {/*['intro', 'disclaimer', 'updates'].map((field) => (*/}
                {['updates'].map((field) => (
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
            <div className="testimonials-editor">
                <h3>TESTIMONIALS</h3>
                <div className="testimonials-grid">
                    {testimonials.map(testimonial => (
                        <div key={testimonial.id} className="testimonial-item">
                            <div className="testimonial-image-container">
                                <img
                                    src={processImageUrl(testimonial.image)}
                                    alt="Testimonial"
                                    className="bulletin-image"
                                    width="150"
                                    height="150"
                                    loading="lazy"
                                />
                            </div>
                            {editingId === testimonial.id ? (
                                <div className="edit-controls">
                                    <input
                                        type="text"
                                        value={newImageUrl}
                                        onChange={(e) => setNewImageUrl(e.target.value)}
                                        placeholder="Enter new image URL"
                                    />
                                    <div className="button-group">
                                        <button className="save-button" onClick={() => handleUpdateTestimonial(testimonial.id)}>Save</button>
                                        <button className="cancel-button" onClick={() => {
                                            setEditingId(null);
                                            setNewImageUrl("");
                                        }}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="testimonial-controls">
                                    <button className="edit-button" onClick={() => {
                                        setEditingId(testimonial.id);
                                        setNewImageUrl(testimonial.image);
                                    }}>Edit</button>
                                    <button className="delete-button" onClick={() => handleDeleteTestimonial(testimonial.id)}>
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="add-testimonial">
                        {addingTestimonial ? (
                            <div className="edit-controls">
                                <input
                                    type="text"
                                    value={newTestimonialUrl}
                                    onChange={(e) => setNewTestimonialUrl(e.target.value)}
                                    placeholder="Enter testimonial image URL"
                                />
                                <div className="button-group">
                                    <button onClick={handleAddTestimonial}>Save</button>
                                    <button onClick={() => {
                                        setAddingTestimonial(false);
                                        setNewTestimonialUrl("");
                                    }}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <button className="add-button" onClick={() => setAddingTestimonial(true)}>
                                {/* Add New Testimonial */}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="flyers-editor">
                <h3>REFERRAL REWARDS</h3>
                {flyers.length > 0 && (
                    <div className="bulletin-item">
                        <div className="bulletin-image-container">
                            <img
                                src={processImageUrl(flyers[0].image)}
                                alt="Flyer"
                                className="bulletin-image"
                                width="150"
                                height="150"
                                loading="lazy"
                            />
                        </div>
                        {editingId === flyers[0].id ? (
                            <div className="edit-controls">
                                <input
                                    type="text"
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    placeholder="Enter new image URL"
                                />
                                <div className="button-group">
                                    <button onClick={() => handleUpdate(flyers[0].id)}>Save</button>
                                    <button onClick={() => {
                                        setEditingId(null);
                                        setNewImageUrl("");
                                    }}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => {
                                setEditingId(flyers[0].id);
                                setNewImageUrl(flyers[0].image);
                            }}>Edit Image</button>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
};

export default BulletinEditor; 