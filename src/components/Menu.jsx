import React from 'react';
import logo from '../assets/logo.png';
import "../scss/components/_menu.scss";
import menuItems from '../utils/menuData';

const Menu = () => {
    return (
        <div className="menu">
            <div className="menu-title-container">
                <h1 className="menu-title">MENU</h1>
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <div className="menu-grid">
                {menuItems.map((item) => (
                    <div key={item.id} className="menu-item">
                        <img src={item.image} alt={item.title} className="menu-item-image" />
                        <h3 className="menu-item-title">{item.title}</h3>
                        <p className="menu-item-description">{item.description}</p>
                        <p className="menu-item-price">{item.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;
