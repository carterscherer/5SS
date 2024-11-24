import React, { useState } from "react";
import "../scss/components/_add.scss"
import ProgressBar from "./ProgressBar";

export default function Add() {

    const [file, setFile ] = useState(null);
    const [error, setError] = useState(null);

    const types  = ['image/png', 'image/jpeg'];
  
    const changeHandler = (e) => {
        let selected = e.target.files[0];
      
        if (selected && types.includes(selected.type)) {
            setFile(selected);
            setError('');
        } else {
            setFile(null);
            setError('Please select an image file (png or jpeg)');
        }
    }

    return (

    <div className="add">
        <form>
            <label>
                <input type="file" onChange={changeHandler} />
                <span>+</span>
            </label>
            <div className="output">
                { error && <div className="error"> { error } </div> }
                { file && <div> { file.name } </div>}
                { file && <ProgressBar file={file} setFile={setFile} /> }
            </div>
        </form>

        <button>
            Add New Menu Item
        </button>
    </div>
  )
}
