import React, { createContext, useState, useEffect } from "react";

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
    } else {
      setCart([...cart, newItem]);
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
    const total = cart.reduce((acc, item) => acc + item.price * item.amount, 0);
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
