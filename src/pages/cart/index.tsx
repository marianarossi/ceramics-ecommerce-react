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
        <div className="row">
          {/* Product List (Scrollable, Vertical Only) */}
            <div className="col-md-8">
              <p>{itemCount} items</p>
              <div style={{ maxHeight: "70vh", overflowY: "auto", overflowX: "hidden" }}>
                {cart.map((product) => (
                    <div key={product.id} className="row mb-4 align-items-center">
                      <div className="col-md-2">
                        <img src={product.img} className="img-fluid rounded-3" alt={product.title} />
                      </div>
                      <div className="col-md-3">
                        <h6 className="text-muted">${product.price.toFixed(2)}</h6>
                        <h6>{product.title}</h6>
                      </div>
                      <div className="col-md-3 d-flex align-items-center gap-2">
                        <button className="" onClick={() => updateQuantity(product.id, product.quantity - 1)}>-</button>
                        <input
                            type="number"
                            value={product.quantity}
                            onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                            className="form-control text-center"
                            style={{ width: "50px" }}
                        />
                        <button className="" onClick={() => updateQuantity(product.id, product.quantity + 1)}>+</button>
                      </div>
                      <div className="col-md-2 d-flex align-items-center justify-content-center">
                        <h6 className="mb-0">${(product.price * product.quantity).toFixed(2)}</h6>
                      </div>
                      <div className="col-md-1 text-end">
                        <button className="btn btn-danger btn-sm" onClick={() => removeItem(product.id)}>X</button>
                      </div>
                    </div>
                ))}
              </div>
            </div>


          {/* Order Summary - Updated Buttons & Continue Shopping Link */}
          <div className="col-md-4">
            <h5 className="fw-bold">Order Summary</h5>
            <hr />
            <p className="d-flex justify-content-between">
              <span>Subtotal:</span> <strong>${subtotal.toFixed(2)}</strong>
            </p>

            <label className="fw-bold mt-2 mb-1">ZIP Code</label>
            <div className="input-group">
              <input
                  type="text"
                  className="form-control border-0 border-bottom rounded-0"
                  placeholder="Enter ZIP code"
              />
              <button className="btn btn-info  ">Calculate</button>
            </div>

            <label className="fw-bold mt-3 mb-1">Shipping</label>
            <select className="form-select mb-3 btn-outline-white" onChange={handleShippingChange} value={shipping}>
              <option value="0">Pick up in Store - $0.00</option>
              <option value="5">Standard Delivery - $5.00</option>
              <option value="15">Fast Delivery - $15.00</option>
            </select>

            <p className="d-flex justify-content-between mt-3">
              <span className="fw-bold">Total:</span> <strong>${total.toFixed(2)}</strong>
            </p>

            <button className="btn btn-info btn-lg btn-block">Checkout</button>

            <p className="text-center mt-4">
              <a href="/" className="text-muted text-decoration-underline">Continue Shopping</a>
            </p>
          </div>



        </div>
      </div>
      </main>
  );
};

export default ShoppingCart;
