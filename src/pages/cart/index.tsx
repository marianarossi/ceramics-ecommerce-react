import { useState, useEffect } from "react";

const ShoppingCart = () => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const loadCart = () => {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart).map((item) => ({
            ...item,
            quantity: item.quantity ?? 1, // Ensure each item has a quantity
          }));
          setCart(parsedCart);
          updateCartSummary(parsedCart);
        } catch (error) {
          console.error("Error parsing cart from localStorage", error);
        }
      }
    };
    loadCart();
  }, []);

  useEffect(() => {
    setTotal(subtotal + shipping);
  }, [subtotal, shipping]);

  const updateCartSummary = (cart) => {
    let subtotalValue = 0;
    let itemCountValue = 0;
    cart.forEach((item) => {
      const qty = item.quantity ?? 1;
      subtotalValue += item.price * qty;
      itemCountValue += qty;
    });
    setSubtotal(subtotalValue);
    setItemCount(itemCountValue);
  };

  const updateQuantity = (id, newQuantity) => {
    const updatedCart = cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity || 1) } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartSummary(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartSummary(updatedCart);
  };

  const handleShippingChange = (event) => {
    const shippingCost = parseFloat(event.target.value) || 0;
    setShipping(shippingCost);
  };

  return (
      <main>
      <div className="container py-5">
        <h1 className="fw-bold mb-4">Shopping Cart</h1>
        <p>{itemCount} items</p>
        {cart.map((product) => (
            <div key={product.id} className="row mb-4">
              <div className="col-md-2">
                <img src={product.img} className="img-fluid rounded-3" alt={product.title} />
              </div>
              <div className="col-md-3">
                <h6 className="text-muted">${product.price.toFixed(2)}</h6>
                <h6>{product.title}</h6>
              </div>
              <div className="col-md-3 d-flex">
                <button onClick={() => updateQuantity(product.id, product.quantity - 1)}>-</button>
                <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                />
                <button onClick={() => updateQuantity(product.id, product.quantity + 1)}>+</button>
              </div>
              <div className="col-md-3">
                <h6>${(product.price * product.quantity).toFixed(2)}</h6>
              </div>
              <div className="col-md-1 text-end">
                <button onClick={() => removeItem(product.id)}>X</button>
              </div>
            </div>
        ))}
        <hr />
        <h5>Subtotal: ${subtotal.toFixed(2)}</h5>
        <label>Shipping</label>
        <select onChange={handleShippingChange} value={shipping}>
          <option value="0">Pick up in Store - $0.00</option>
          <option value="5">Standard Delivery - $5.00</option>
          <option value="15">Fast Delivery - $15.00</option>
        </select>
        <h5>Total: ${total.toFixed(2)}</h5>
        <button className="btn btn-dark">Finish</button>
      </div>
    </main>
  );
};

export default ShoppingCart;
