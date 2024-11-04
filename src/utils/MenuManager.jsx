// utils/MenuManager.jsx
import React, { useState } from 'react';
import Menu from '../components/Menu';
import Backend from '../components/Backend';
import menuImages from '../utils/menuImages';

const MenuManager = () => {

    const [menuItems, setMenuItems] = useState([
        {
            id: 1,
            image: menuImages[0], 
            title: 'OilLabs',
            description: 'Enter a description here',
            price: '$10.00',
            isVisible: true
        },
        {
            id: 2,
            image: menuImages[1],
            title: 'Menu Item 2', 
            description: 'Enter a description here',
            price: '$12.00',
            isVisible: true
        },
        {
            id: 3,
            image: menuImages[2],
            title: 'Menu Item 3',
            description: 'Enter a description here',
            price: '$12.00',
            isVisible: true
        },
        {
            id: 4,
            image: menuImages[3],
            title: 'Menu Item 4',
            description: 'Another delicious choice.',
            price: '$12.00',
            isVisible: true
        },
        {
            id: 5,
            image: menuImages[4],
            title: 'Menu Item 5',
            description: 'Another delicious choice.',
            price: '$12.00',
            isVisible: true
        },
        {
            id: 6,
            image: menuImages[5],
            title: 'Menu Item 6',
            description: 'Enter a description here',
            price: '$12.00',
            isVisible: true
        },
        {
            id: 7,
            image: menuImages[6],
            title: 'Menu Item 7',
            description: 'Enter a description here',
            price: '$12.00',
            isVisible: true
        },
        {
            id: 8,
            image: menuImages[7],
            title: 'Menu Item 8',
            description: 'Enter a description here',
            price: '$12.00',
            isVisible: true
        },
        {
            id: 9,
            image: menuImages[8],
            title: 'Menu Item 9',
            description: 'Enter a description here',
            price: '$12.00',
            isVisible: true
        },
        {
            id: 10,
            image: menuImages[9],
            title: 'Menu Item 10',
            description: 'Enter a description here',
            price: '$12.00',
            isVisible: true
        },
    ]);

    // Functions to update, add, and delete items in menuItems
    const updateMenuItem = (id, updatedData) => {
        setMenuItems(menuItems.map(item => item.id === id ? { ...item, ...updatedData } : item));
    };

    const addMenuItem = () => {
        const newItem = {
            id: Date.now(),
            image: menuImages[menuItems.length % menuImages.length],
            title: 'New Item',
            description: '',
            price: '$0.00',
            isVisible: true
        };
        setMenuItems([...menuItems, newItem]);
    };

    const deleteMenuItem = (id) => {
        setMenuItems(menuItems.filter(item => item.id !== id));
    };

    return (
        <div className="menu-manager">
            <Menu menuItems={menuItems.filter(item => item.isVisible)} />
            <Backend 
                menuItems={menuItems} 
                updateMenuItem={updateMenuItem} 
                addMenuItem={addMenuItem} 
                deleteMenuItem={deleteMenuItem} 
            />
        </div>
    );
};

export default MenuManager;