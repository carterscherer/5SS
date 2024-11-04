import React, { useState } from 'react';
import "../scss/components/_backend.scss";
import initialMenuItems from '../utils/menuData'; // import hardcoded menu items array
import menuItems from '../utils/menuData';

const Backend = () => {
    // Initialize state with imported menu items
    const [menuItems, setMenuItems] = useState(initialMenuItems);

    // Function to handle editing changes
    const handleInputChange = (e, id, field) => {
        const updatedItems = menuItems.map((item) => 
            item.id === id ? { ...item, [field]: e.target.value } : item
        );
        setMenuItems(updatedItems);
    };

    // Function to save changes (optional: can add save to DB or localStorage here)
    const handleSave = () => {
        console.log("Saved items:", menuItems);
        // Optionally, save to localStorage or a database here
    };

    // Function to delete an item
    const handleDelete = (id) => {
        const filteredItems = menuItems.filter((item) => item.id !== id);
        setMenuItems(filteredItems);
    };

    // Function to add a new item
    const handleAddNewItem = () => {
        const newItem = {
            id: menuItems.length + 1,
            image: "", // Set a default image if needed
            title: "New Item",
            description: "Enter a description here",
            price: "$0.00"
        };
        setMenuItems([...menuItems, newItem]);
    };

    return (
        <div className="backend">
            <h2>Menu Management</h2>
            <div className="menu-items">
                {menuItems.map((item) => (
                    <div key={item.id} className="menu-item-edit">
                        <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleInputChange(e, item.id, "title")}
                        />
                        <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleInputChange(e, item.id, "description")}
                        />
                        <input
                            type="text"
                            value={item.price}
                            onChange={(e) => handleInputChange(e, item.id, "price")}
                        />
                        <button onClick={() => handleDelete(item.id)}>Delete</button>
                    </div>
                ))}
                <div className="add-new-button">
                    <button onClick={handleAddNewItem}>Add New Item</button>
                </div>
                <div className="save-button">
                    <button onClick={handleSave}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default Backend;
