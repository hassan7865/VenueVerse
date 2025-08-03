import React, { createContext, useState, useEffect } from "react";
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [itemAmount, setItemAmount] = useState(0);
  const [total, setTotal] = useState(0);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, id) => {
    const newItem = { ...product, amount: 1 };
    const cartItem = cart.find((item) => item._id === id);

    if (cartItem) {
      const newCart = cart.map((item) =>
        item._id === id ? { ...item, amount: item.amount + 1 } : item
      );
      setCart(newCart);
      
      // Professional toast for quantity update
      toast.success(`${product.name || 'Product'} quantity updated`, {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#ffffff',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        iconTheme: {
          primary: '#059669',
          secondary: '#ffffff',
        },
      });
    } else {
      setCart([...cart, newItem]);
      
      // Professional toast for new item
      toast.success(`${product.name || 'Product'} added to cart`, {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#ffffff',
          color: '#1f2937',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        iconTheme: {
          primary: '#059669',
          secondary: '#ffffff',
        },
      });
    }
  };

  const removeFromCart = (id) => {
    const newCart = cart.filter((item) => item._id !== id);
    setCart(newCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  const increaseAmount = (id) => {
    const newCart = cart.map((item) =>
      item._id === id ? { ...item, amount: item.amount + 1 } : item
    );
    setCart(newCart);
  };

  const decreaseAmount = (id) => {
    const cartItem = cart.find((item) => item._id === id);
    if (cartItem && cartItem.amount > 1) {
      const newCart = cart.map((item) =>
        item._id === id ? { ...item, amount: item.amount - 1 } : item
      );
      setCart(newCart);
    } else {
      removeFromCart(id);
    }
  };

  useEffect(() => {
    const total = cart.reduce((acc, item) => {
      const price = item.offer && item.discountPrice ? item.discountPrice : item.price;
      return acc + price * item.amount;
    }, 0);
    setTotal(total);
  }, [cart]);

  useEffect(() => {
    const amount = cart.reduce((acc, item) => acc + item.amount, 0);
    setItemAmount(amount);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseAmount,
        decreaseAmount,
        itemAmount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};