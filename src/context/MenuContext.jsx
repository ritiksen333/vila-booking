import React, { createContext, useContext, useState } from 'react';

const MenuContext = createContext();

export const categoryIconMap = {
  pizza: '🍕',
  burger: '🍔',
  drink: '🥤',
  beverage: '🥤',
  coffee: '☕',
  dessert: '🍰',
  cake: '🍰',
  side: '🍟',
  fry: '🍟',
  salad: '🥗',
  pasta: '🍝',
  chicken: '🍗',
  icecream: '🍨',
  breakfast: '🍳',
  egg: '🍳',
  indian: '🍛',
  curry: '🍛',
  chinese: '🍜',
  noodle: '🍜',
  bakery: '🥐',
  bread: '🥐',
  sandwich: '🥪',
  soup: '🥣',
  steak: '🥩',
  fish: '🐟',
  sushi: '🍣'
};

const initialItems = [
  { 
    id: 1, 
    name: 'Margherita Pizza', 
    category: 'Pizza', 
    price: 299, 
    image: '🍕', 
    description: 'Classic tomato, mozzarella, basil', 
    available: true,
    sizes: [
      { name: "Small", price: 199 },
      { name: "Medium", price: 299 },
      { name: "Large", price: 399 }
    ]
  },
  { 
    id: 2, 
    name: 'Pepperoni Pizza', 
    category: 'Pizza', 
    price: 399, 
    image: '🍕', 
    description: 'Beef pepperoni with extra cheese', 
    available: true,
    sizes: [
      { name: "Small", price: 299 },
      { name: "Medium", price: 399 },
      { name: "Large", price: 499 }
    ]
  },
  { 
    id: 3, 
    name: 'Cheese Burger', 
    category: 'Burgers', 
    price: 189, 
    image: '🍔', 
    description: 'Juicy patty with cheddar', 
    available: true,
    sizes: [
      { name: "Regular", price: 189 },
      { name: "Large", price: 249 }
    ]
  },
  { 
    id: 4, 
    name: 'Chicken Pasta', 
    category: 'Pasta', 
    price: 349, 
    image: '🍝', 
    description: 'Creamy alfredo with grilled chicken', 
    available: true,
    sizes: [
      { name: "Half", price: 199 },
      { name: "Full", price: 349 }
    ]
  },
  { 
    id: 5, 
    name: 'Coca Cola', 
    category: 'Drinks', 
    price: 49, 
    image: '🥤', 
    description: 'Chilled 300ml', 
    available: true,
    sizes: [
      { name: "Small", price: 49 },
      { name: "Medium", price: 79 },
      { name: "Large", price: 99 }
    ]
  },
  { id: 11, name: 'Paneer Tikka', category: 'Indian', price: 349, image: '🍛', description: 'Grilled cottage cheese with spices', available: true },
  { id: 12, name: 'Butter Chicken', category: 'Indian', price: 449, image: '🍛', description: 'Creamy tomato gravy with chicken', available: true },
  { id: 13, name: 'Veg Manchurian', category: 'Chinese', price: 289, image: '🍜', description: 'Fried veg balls in spicy sauce', available: true },
  { id: 14, name: 'Hakka Noodles', category: 'Chinese', price: 249, image: '🍜', description: 'Stir-fried noodles with veggies', available: true },
  { id: 15, name: 'Greek Salad', category: 'Salad', price: 229, image: '🥗', description: 'Fresh olives, feta, and greens', available: true },
  { id: 16, name: 'Tiramisu', category: 'Desserts', price: 199, image: '🍰', description: 'Classic Italian coffee dessert', available: true },
  { id: 17, name: 'Fresh Lime Soda', category: 'Drinks', price: 89, image: '🥤', description: 'Refreshing sweet and salt lime', available: true },
  { id: 18, name: 'Club Sandwich', category: 'Sides', price: 179, image: '🥪', description: 'Triple layered veg sandwich', available: true },
  { id: 19, name: 'Garlic Bread', category: 'Sides', price: 129, image: '🥐', description: 'Toasted with herb butter', available: true },
  { id: 20, name: 'Fruit Platter', category: 'Breakfast', price: 159, image: '🍎', description: 'Seasonal fresh cut fruits', available: true },
];

const initialCategories = ['All', 'Pizza', 'Burgers', 'Pasta', 'Indian', 'Chinese', 'Salad', 'Sides', 'Drinks', 'Desserts', 'Breakfast'];

export const MenuProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('pos-menu-items');
    return saved ? JSON.parse(saved) : initialItems;
  });
  const [categoriesList, setCategoriesList] = useState(() => {
    const saved = localStorage.getItem('pos-menu-categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  React.useEffect(() => {
    localStorage.setItem('pos-menu-items', JSON.stringify(items));
    localStorage.setItem('pos-menu-categories', JSON.stringify(categoriesList));
  }, [items, categoriesList]);

  const addItem = (newItem) => {
    const id = Date.now();
    const itemWithId = { ...newItem, id, available: true };
    setItems(prev => [itemWithId, ...prev]);
    
    if (!categoriesList.includes(newItem.category)) {
      setCategoriesList(prev => [...prev, newItem.category]);
    }
  };

  const updateItem = (id, data) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <MenuContext.Provider value={{ items, categoriesList, addItem, updateItem, deleteItem }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
