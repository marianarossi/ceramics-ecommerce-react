import { useEffect, useState } from "react";
import AddressService from "@/service/address-service";
import orderService from "@/service/order-service"; // Import your order service
import { useNavigate } from "react-router-dom";
import { AddAddressModal } from "@/components/address-modal";
import addressService from "@/service/address-service"; // Adjust the path if needed

interface Address {
    id: number;
    street: string;
    city: string;
    state: string;
    zip: string;
}

const Checkout = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [modalOpen, setModalOpen] = useState(false);
    const [pendingOrder, setPendingOrder] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

    // Shipping states
    const [shippingCost, setShippingCost] = useState<number | null>(null);
    const [shippingCostMessage, setShippingCostMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadAddresses();
    }, []);

    // When addresses or selectedAddress change, recalc shipping cost
    useEffect(() => {
        const calcShipping = async () => {
            if (selectedAddress !== null && addresses.length > 0) {
                // Find the selected address in the list
                const addr = addresses.find((a) => a.id === selectedAddress);
                if (!addr) return;

                // Prepare the shipment data
                const shipmentData = {
                    from: {
                        postal_code: "85501560", // Fixed origin postal code
                    },
                    to: {
                        postal_code: addr.zip, // Use selected address zip code
                    },
                    products: [
                        {
                            id: "x",
                            width: 11,
                            height: 17,
                            length: 11,
                            weight: 0.3,
                            insurance_value: 10.1,
                            quantity: 1,
                        },
                    ],
                    options: {
                        receipt: false,
                        own_hand: false,
                    },
                    services: "1,2,18",
                };

                try {
                    const result = await  addressService.calculateShipment(shipmentData);
                    if (result && Array.isArray(result) && result.length > 0) {
                        // Build a message showing available shipping options
                        let message = "";
                        if (result[0] && result[0].price) {
                            message += `PAC: ${result[0].price}`;
                        }
                        if (result[1] && result[1].price) {
                            message += ` | SEDEX: ${result[1].price}`;
                        }
                        setShippingCostMessage(message);
                        // Use one of the calculated prices (for example, PAC) as the shipping cost value
                        if (result[0] && result[0].price) {
                            setShippingCost(parseFloat(result[0].price));
                        }
                    } else {
                        setShippingCostMessage("Frete indisponível");
                        setShippingCost(null);
                    }
                } catch (error) {
                    console.error("Error calculating shipping:", error);
                    setShippingCostMessage("Erro ao calcular o frete");
                    setShippingCost(null);
                }
            }
        };

        calcShipping();
    }, [selectedAddress, addresses]);

    const loadAddresses = async () => {
        try {
            const response = await AddressService.findAll();
            setAddresses(response.data);
            if (response.data.length > 0) {
                setSelectedAddress(response.data[0].id); // Select the first address by default
            }
        } catch (error) {
            console.error("Error loading addresses", error);
        }
    };

    const handleSelectAddress = (id: number) => {
        setSelectedAddress(id);
    };

    const handleAddressSaved = () => {
        setModalOpen(false);
        loadAddresses(); // Reload the addresses after a new one is added
    };

    const handleFinishOrder = async () => {
        if (!selectedAddress || !paymentMethod) {
            alert("Please select an address and a payment method.");
            return;
        }

        // Ensure a shipping cost was calculated
        if (shippingCost === null) {
            alert("Shipping cost has not been calculated yet or is unavailable.");
            return;
        }

        // Retrieve cart items from localStorage (adjust the key if necessary)
        const cartString = localStorage.getItem("cart");
        if (!cartString) {
            alert("No items in cart.");
            return;
        }

        const cartItems = JSON.parse(cartString);
        if (!cartItems.length) {
            alert("No items in cart.");
            return;
        }

        // Map cart items to the order items structure
        const orderItems = cartItems.map((item: any) => ({
            product: { id: item.id }, // Assumes each item has an "id" property
            quantity: item.quantity,
        }));

        // Use the calculated shipping cost instead of a constant
        const order = {
            shipping: shippingCost,
            payment: paymentMethod,
            address: { id: selectedAddress },
            items: orderItems,
        };

        setPendingOrder(true);
        setOrderError(null);
        setOrderSuccess(null);

        try {
            const response = await orderService.save(order);
            if (response.status === 200 || response.status === 201) {
                setOrderSuccess("Order placed successfully!");
                // Optionally clear the cart after a successful order
                localStorage.removeItem("cart");
                // Navigate to an order confirmation page (adjust the route and state as needed)
                navigate("/user#tab3", { state: { order: response.data } });
            } else {
                setOrderError("Failed to place order. Please try again.");
            }
        } catch (error: any) {
            console.error("Order error", error);
            setOrderError("Failed to place order. Please try again.");
        } finally {
            setPendingOrder(false);
        }
    };

    return (
        <main className="container">
            <h1 className="fw-bold mb-4">Checkout</h1>

            {/* Addresses List */}
            <div className="mb-4">
                <h5>Select Delivery Address</h5>
                <div
                    style={{
                        maxHeight: "200px",
                        overflowY: "auto",
                        border: "1px solid #ccc",
                        padding: "10px",
                    }}
                >
                    {addresses.length > 0 ? (
                        addresses.map((addr) => (
                            <div
                                key={addr.id}
                                onClick={() => handleSelectAddress(addr.id)}
                                style={{
                                    padding: "10px",
                                    borderRadius: "5px",
                                    marginBottom: "5px",
                                    cursor: "pointer",
                                    background: selectedAddress === addr.id ? "#ddd" : "#fff",
                                    border: "1px solid #ccc",
                                }}
                            >
                                <p>
                                    {addr.street}, {addr.city}, {addr.state} - {addr.zip}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>No saved addresses.</p>
                    )}
                </div>
                <button className="btn btn-outline-primary mt-2" onClick={() => setModalOpen(true)}>
                    + Add New Address
                </button>
            </div>

            {/* Payment Method */}
            <div className="mb-4">
                <h5>Select Payment Method</h5>
                <select
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option value="">Select...</option>
                    <option value="credit card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank transfer">Bank Transfer</option>
                </select>
            </div>

            {/* Display Calculated Shipping Cost */}
            {shippingCostMessage && (
                <div className="mb-4">
                    <h5>Shipping Cost</h5>
                    <p>{shippingCostMessage}</p>
                </div>
            )}

            {/* Finish Order Button */}
            <button className="btn btn-info btn-lg" onClick={handleFinishOrder} disabled={pendingOrder}>
                {pendingOrder ? "Placing Order..." : "Finish Order"}
            </button>

            {orderError && <div className="alert alert-danger mt-3">{orderError}</div>}
            {orderSuccess && <div className="alert alert-success mt-3">{orderSuccess}</div>}

            {/* Add Address Modal */}
            <AddAddressModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                onAddressSaved={handleAddressSaved}
            />
        </main>
    );
};

export default Checkout;
