import React, { useState, useEffect } from "react";
import "../scss/components/_add.scss";
import { FaSquarePlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { db } from "../firebase/firebase";
import { getDocs, collection, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import { PiSealWarningFill, PiSealCheckFill, PiSealPercentFill } from "react-icons/pi";


export default function Add() {
  const [menuList, setMenu] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({});

  const menuCollectionRef = collection(db, "menu");

  useEffect(() => {
    const getMenu = async () => {
      try {
        const data = await getDocs(menuCollectionRef);
        const menu = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        // Sort by orderIndex
        const sortedMenu = menu.sort((a, b) => a.orderIndex - b.orderIndex);
        setMenu(sortedMenu);
      } catch (err) {
        console.error(err);
      }
    };
    getMenu();
  }, []);

  const handleEdit = (id) => {
    setEditingItem(id);
    const currentItem = menuList.find((menu) => menu.id === id);
    setUpdatedFields({ ...currentItem });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (id) => {
    try {
      const itemDoc = doc(db, "menu", id);
      await updateDoc(itemDoc, updatedFields);
      setEditingItem(null);
      setMenu((prev) =>
        prev
          .map((item) =>
            item.id === id ? { ...item, ...updatedFields } : item
          )
          .sort((a, b) => a.orderIndex - b.orderIndex) // Re-sort after update
      );
    } catch (err) {
      console.error("Error updating document:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const itemDoc = doc(db, "menu", id);
      await deleteDoc(itemDoc);
      setMenu((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  };

  const handleAddNew = async () => {
    try {
      const newMenuItem = {
        title: "",
        pricing: "",
        strains: "",
        images: [],
        orderIndex: menuList.length + 1, // Default new item to the end
      };
      const newDocRef = await addDoc(menuCollectionRef, newMenuItem);
      const newMenuItemWithId = { ...newMenuItem, id: newDocRef.id };
      setMenu((prev) => [...prev, newMenuItemWithId].sort((a, b) => a.orderIndex - b.orderIndex));
      setEditingItem(newDocRef.id);
      setUpdatedFields(newMenuItemWithId);
    } catch (err) {
      console.error("Error adding new menu item:", err);
    }
  };

  const formatBulletPoints = (text) => {
    if (!text) return null;
    return text.split('\n')
      .filter(item => item.trim())
      .map((item, index) => (
        <li key={index}>{item.trim()}</li>
      ));
  };

  const statusOptions = [
    { value: '', label: 'No Status' },
    { value: 'low_inventory', label: 'Low Inventory', icon: <PiSealWarningFill /> },
    { value: 'hot', label: 'Hot', icon: <PiSealCheckFill /> },
    { value: 'price_change', label: 'Price Change', icon: <PiSealPercentFill /> }
  ];

  return (
    <div className="add">
      <div className="menu-grid">
        {menuList.map((menu) => (
          <div key={menu.id} className="menu-item">
            <ImageCarousel images={menu.images || []} status={menu.status} />
            {editingItem === menu.id ? (
              <div className="edit-fields">
                <input
                  type="number"
                  name="orderIndex"
                  value={updatedFields.orderIndex || ""}
                  onChange={handleChange}
                  placeholder="Edit Order Index"
                />
                <input
                  type="text"
                  name="title"
                  value={updatedFields.title || ""}
                  onChange={handleChange}
                  placeholder="Edit Title"
                />
                <textarea
                  name="pricing"
                  value={updatedFields.pricing || ""}
                  onChange={handleChange}
                  placeholder="Add Pricing (one item per line)"
                ></textarea>
                <textarea
                  name="strains"
                  value={updatedFields.strains || ""}
                  onChange={handleChange}
                  placeholder="Add Strains (one strain per line)"
                ></textarea>
                <textarea
                  type="text"
                  name="images" // Update images field
                  value={updatedFields.images?.join(", ") || ""}
                  onChange={(e) =>
                    setUpdatedFields((prev) => ({
                      ...prev,
                      images: e.target.value.split(",").map((url) => url.trim()),
                    }))
                  }
                  placeholder="Add Image Links (comma separated)"
                />
                <select
                  name="status"
                  value={updatedFields.status || ''}
                  onChange={handleChange}
                  className="status-select"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleUpdate(menu.id)}>Save</button>
                <button onClick={() => setEditingItem(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <div className="title-container">
                  <h3 className="menu-title">{menu.title || "Untitled"}</h3>
                  <span className="order-index">{menu.orderIndex || 0}</span>
                </div>
                <div className="content-section">
                  <h4>Strains:</h4>
                  <ul className="menu-item-list">
                    {formatBulletPoints(menu.strains)}
                  </ul>
                  <h4>Pricing:</h4>
                  <ul className="menu-item-list">
                    {formatBulletPoints(menu.pricing)}
                  </ul>
                </div>
                <div className="buttons-container">
                  <button
                    onClick={() => handleEdit(menu.id)}
                    className="edit-button"
                  >
                    EDIT THIS ITEM
                  </button>
                  <button
                    onClick={() => handleDelete(menu.id)}
                    className="delete-button"
                  >
                    <MdDelete /> Delete
                  </button>
                </div>
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

function ImageCarousel({ images, status }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'low_inventory':
        return <PiSealWarningFill className="status-icon" data-status="Low Inventory" />;
      case 'hot':
        return <PiSealCheckFill className="status-icon" data-status="Hot Item" />;
      case 'price_change':
        return <PiSealPercentFill className="status-icon" data-status="Price Change" />;
      default:
        return null;
    }
  };

  if (images.length === 0) {
    return (
      <img
        src="https://via.placeholder.com/150"
        alt="Placeholder"
        className="menu-image"
      />
    );
  }

  return (
    <div className="image-carousel">
      <button onClick={prevImage} className="carousel-button">
        <IoMdArrowDropleft />
      </button>
      <div className="image-wrapper">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex}`}
          className="menu-image"
        />
        {getStatusIcon()}
      </div>
      <button onClick={nextImage} className="carousel-button">
        <IoMdArrowDropright />
      </button>
    </div>
  );
}
