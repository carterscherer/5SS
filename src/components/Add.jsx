import React, { useState, useEffect } from "react";
import "../scss/components/_add.scss";

import { FaSquarePlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md"; // Importing delete icon

import { db } from "../firebase/firebase";
import { getDocs, collection, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";

export default function Add() {
  const [menuList, setMenu] = useState([]);
  const [editingItem, setEditingItem] = useState(null); // Tracks the item being edited
  const [updatedFields, setUpdatedFields] = useState({}); // Holds updated values

  const menuCollectionRef = collection(db, "menu");

  useEffect(() => {
    const getMenu = async () => {
      try {
        const data = await getDocs(menuCollectionRef);
        const menu = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setMenu(menu);
      } catch (err) {
        console.error(err);
      }
    };
    getMenu();
  }, []);

  const handleEdit = (id) => {
    setEditingItem(id); // Sets the currently edited item
    const currentItem = menuList.find((menu) => menu.id === id);
    setUpdatedFields({ ...currentItem }); // Prepopulate inputs with current values
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id) => {
    try {
      const itemDoc = doc(db, "menu", id); // Reference to the specific document
      await updateDoc(itemDoc, {
        title: updatedFields.title,
        price: parseFloat(updatedFields.price), // Ensure price is a number
        description: updatedFields.description,
        image: updatedFields.image, // Save the updated image link
      });
      setEditingItem(null); // Exit editing mode

      // Update the local state for better UX
      setMenu((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updatedFields } : item
        )
      );
    } catch (err) {
      console.error("Error updating document:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Delete item from Firestore
      const itemDoc = doc(db, "menu", id);
      await deleteDoc(itemDoc);

      // Update local state to reflect deletion
      setMenu((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  };

  const handleAddNew = async () => {
    try {
      const newMenuItem = {
        title: "",
        price: 0,
        description: "",
        image: "",
      };
      const newDocRef = await addDoc(menuCollectionRef, newMenuItem);
      const newMenuItemWithId = { ...newMenuItem, id: newDocRef.id };
      setMenu((prev) => [...prev, newMenuItemWithId]); // Add new item to the list
      setEditingItem(newDocRef.id); // Automatically open it for editing
      setUpdatedFields(newMenuItemWithId); // Prepopulate the fields with new values
    } catch (err) {
      console.error("Error adding new menu item:", err);
    }
  };

  return (
    <div className="add">
      <div className="menu-grid">
        {menuList.map((menu) => (
          <div key={menu.id} className="menu-item">
            <img
              src={menu.image || "https://via.placeholder.com/150"}
              alt={menu.title || "No title"}
              className="menu-image"
            />
            {editingItem === menu.id ? (
              <div className="edit-fields">
                <input
                  type="text"
                  name="title"
                  value={updatedFields.title || ""}
                  onChange={handleChange}
                  placeholder="Edit Title"
                />
                <input
                  type="text"
                  name="price"
                  value={updatedFields.price || ""}
                  onChange={handleChange}
                  placeholder="Edit Price"
                />
                <textarea
                  name="description"
                  value={updatedFields.description || ""}
                  onChange={handleChange}
                  placeholder="Edit Description"
                ></textarea>
                <input
                  type="text"
                  name="image"
                  value={updatedFields.image || ""}
                  onChange={handleChange}
                  placeholder="Add Image Link"
                />
                <button onClick={() => handleUpdate(menu.id)}>Save</button>
                <button onClick={() => setEditingItem(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <h3>{menu.title || "Untitled"}</h3>
                <p>{menu.description || "No description available"}</p>
                <p>Price: ${menu.price ? Number(menu.price).toFixed(2) : "0.00"}</p>
                <button onClick={() => handleEdit(menu.id)}>EDIT THIS ITEM</button>
                <button onClick={() => handleDelete(menu.id)} className="delete-button">
                  <MdDelete /> Delete
                </button>
              </div>
            )}
          </div>
        ))}
        <div className="menu-item add-new" onClick={handleAddNew}>
          <FaSquarePlus className="add-icon" />
          <p>Add New Item</p>
        </div>
      </div>
    </div>
  );
}
