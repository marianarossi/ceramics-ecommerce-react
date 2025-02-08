import { IProduct } from "@/commons/interfaces";
import React, { useState, useEffect } from "react";

const Cart = () => {
const [cart, setCart] = useState<IProduct[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);

  useEffect(() => {
    const loadCart = async () => {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(storedCart);
      calculateSubtotal(storedCart);
    };

    loadCart();
}, 
  []);

  const calculateSubtotal = (cart) => {
    let subtotal = 0;
    cart.forEach((item: IProduct) => {
      subtotal += item.price * item.quantity;
    });
    setSubtotal(subtotal);
  };

  const handleQuantityChange = (id, quantity) => {
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, quantity: parseInt(quantity) } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateSubtotal(updatedCart);
  };

  const handleRemoveItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateSubtotal(updatedCart);
  };

  const handleShippingChange = (e) => {
    setShipping(parseFloat(e.target.value));
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      <div>
        {cart.map(item => (
          <div key={item.id}>
            <img src={`./img/${item.img}`} alt={item.title} />
            <h6>${item.price}</h6>
            <h6>{item.title}</h6>
            <input 
              type="number" 
              value={item.quantity} 
              onChange={(e) => handleQuantityChange(item.id, e.target.value)} 
            />
            <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
            <h6>${(item.price * item.quantity).toFixed(2)}</h6>
          </div>
        ))}
      </div>

      <div>
        <h5>Subtotal: ${subtotal.toFixed(2)}</h5>
        <select onChange={handleShippingChange}>
          <option value="0">Pick up in Store - $0.00</option>
          <option value="5">Standard Delivery - $5.00</option>
          <option value="15">Fast Delivery - $15.00</option>
        </select>
        <h5>Total: ${(subtotal + shipping).toFixed(2)}</h5>
      </div>

      <button>Finish</button>
    </div>
  );
};

export default Cart;
