import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase"; 
import {v4} from 'uuid';
import "../scss/components/_add.scss"

export default function NewAdd() {

    const [imageUpload, setImageUpload] = useState(null);
    const uploadImage = () => {
        if (imageUpload == null)  return;
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then(() => {
            alert("Image Uploaded");
        });
    };

    return (
        <div className="newAdd">
            <input 
                className="input-button"
                type="file"
                id="image"
                name="image"
                accept="image/png, image/jpeg"
                onChange={(event) => {setImageUpload(event.target.files[0]);
                }}
            />
            <button
                onClick={uploadImage}>
                Upload
            </button>
        </div>
    );
}
