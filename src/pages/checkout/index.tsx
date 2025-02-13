import { useEffect, useState } from "react";
import AddressService from "@/service/address-service";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

    useEffect(() => {
        const loadAddresses = async () => {
            try {
                const response = await AddressService.findAll();
                setAddresses(response.data);
                if (response.data.length > 0) {
                    setSelectedAddress(response.data[0].id); // Select first by default
                }
            } catch (error) {
                console.error("Error loading addresses", error);
            }
        };
        loadAddresses();
    }, []);

    const handleSelectAddress = (id: number) => {
        setSelectedAddress(id);
    };

    const handleConfirmCheckout = () => {
        if (!selectedAddress || !paymentMethod) {
            alert("Please select an address and payment method.");
            return;
        }

        // Move to next step (e.g., payment page or order summary)
        navigate("/payment", { state: { selectedAddress, paymentMethod } });
    };

    return (
        <div className="container py-5">
            <h1 className="fw-bold mb-4">Checkout</h1>

            {/* Addresses List */}
            <div className="mb-4">
                <h5>Select Delivery Address</h5>
                <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
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
                                <p>{addr.street}, {addr.city}, {addr.state} - {addr.zip}</p>
                            </div>
                        ))
                    ) : (
                        <p>No saved addresses.</p>
                    )}
                </div>
                <button className="btn btn-outline-primary mt-2" onClick={() => navigate("/add-address")}>
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
                    <option value="credit-card">Credit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank-transfer">Bank Transfer</option>
                </select>
            </div>

            {/* Confirm Checkout */}
            <button className="btn btn-info btn-lg" onClick={handleConfirmCheckout}>
                Proceed to Payment
            </button>
        </div>
    );
};

export default Checkout;
