import React from 'react';
import logo from '../assets/logo.png';
import "../scss/components/_menu.scss"
import menuImages from '../utils/menuImages';


// Sample menu items array - this can be expanded with additional items
const menuItems = [
    {
        id: 1,
        image: menuImages[0], // Replace with actual image paths
        title: 'Menu Item 1',
        description: 'A tasty dish.',
        price: '$10.00'
    },
    {
        id: 2,
        image: menuImages[1],
        title: 'Menu Item 2',
        description: 'Another delicious choice.',
        price: '$12.00'
    },
    {
        id: 3,
        image: menuImages[2],
        title: 'Menu Item 2',
        description: 'Another delicious choice.',
        price: '$12.00'
    },
    {
        id: 4,
        image: menuImages[3],
        title: 'Menu Item 2',
        description: 'Another delicious choice.',
        price: '$12.00'
    },
    {
        id: 5,
        image: menuImages[4],
        title: 'Menu Item 2',
        description: 'Another delicious choice.',
        price: '$12.00'
    },
    {
        id: 6,
        image: menuImages[5],
        title: 'Menu Item 2',
        description: 'Another delicious choice.',
        price: '$12.00'
    },
    {
        id: 7,
        image: menuImages[6],
        title: 'Menu Item 2',
        description: 'Another delicious choice.',
        price: '$12.00'
    },
    {
        id: 8,
        image: menuImages[7],
        title: 'Menu Item 2',
        description: 'Another delicious choice.',
        price: '$12.00'
    },
    {
        id: 9,
        image: menuImages[8],
        title: 'Menu Item 2',
        description: 'Another delicious choice.',
        price: '$12.00'
    },
    {
        id: 10,
        image: menuImages[9],
        title: 'Menu Item 2',
        description: 'Another delicious choice.',
        price: '$12.00'
    },
];

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
