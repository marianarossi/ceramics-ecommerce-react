// File: src/pages/ShoppingCart.tsx
import { useState, useEffect } from "react";
import { ICartItem } from "@/commons/interfaces.ts";
import { useNavigate } from "react-router-dom";
import AuthService from "@/service/auth-service"; // using your auth service

const ShoppingCart = () => {
  const [cart, setCart] = useState<ICartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [itemCount, setItemCount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = () => {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        try {
          const parsedCart: ICartItem[] = JSON.parse(storedCart).map((item: ICartItem) => ({
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

  const updateCartSummary = (cart: ICartItem[]) => {
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

  const updateQuantity = (id: number, newQuantity: number) => {
    const updatedCart = cart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartSummary(updatedCart);
  };

  const removeItem = (id: number) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateCartSummary(updatedCart);
  };

  const handleCheckout = () => {
    // Check if the user is authenticated using your auth service.
    if (!AuthService.isAuthenticated()) {
      // Store intended destination for redirection after login.
      localStorage.setItem("lastPage", "/checkout");
      navigate("/login");
    } else {
      // If authenticated, go directly to the checkout page.
      navigate("/checkout");
    }
  };

  return (
      <main>
        <div className="container py-5">
          <h1 className="fw-bold mb-4">Shopping Cart</h1>
          <div className="row">
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
                        <button onClick={() => updateQuantity(product.id, product.quantity - 1)}>-</button>
                        <input
                            type="number"
                            value={product.quantity}
                            onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 1)}
                            className="form-control text-center"
                            style={{ width: "50px" }}
                        />
                        <button onClick={() => updateQuantity(product.id, product.quantity + 1)}>+</button>
                      </div>
                      <div className="col-md-2 d-flex align-items-center justify-content-center">
                        <h6 className="mb-0">${(product.price * product.quantity).toFixed(2)}</h6>
                      </div>
                      <div className="col-md-1 text-end">
                        <button className="btn btn-danger btn-sm" onClick={() => removeItem(product.id)}>
                          X
                        </button>
                      </div>
                    </div>
                ))}
              </div>
            </div>

            <div className="col-md-4">
              <h5 className="fw-bold">Order Summary</h5>
              <hr />
              <p className="d-flex justify-content-between">
                <span>Subtotal:</span> <strong>${subtotal.toFixed(2)}</strong>
              </p>
              {/* Note: Shipping and payment selections now occur in the checkout page */}
              <p className="text-muted">
                Shipping &amp; payment options will be selected on the checkout page.
              </p>
              <button className="btn btn-info btn-lg btn-block" onClick={handleCheckout}>
                Checkout
              </button>
              <p className="text-center mt-4">
                <a href="/" className="text-muted text-decoration-underline">
                  Continue Shopping
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
  );
};

export default ShoppingCart;
