import { useEffect, useState } from "react";
import AddressService from "@/service/address-service";
import orderService from "@/service/order-service"; // Import your order service
import { useNavigate } from "react-router-dom";
import { AddAddressModal } from "@/components/address-modal";
import addressService from "@/service/address-service"; // Adjust the path if needed
import { useToast } from "@chakra-ui/react";
import {ICartItem, IResponseAddress} from "@/commons/interfaces.ts";

interface ShippingOption {
    id: number;
    name: string;
    price: string;
    custom_price: string;
    discount: string;
    currency: string;
    delivery_time: number;
}

const Checkout = () => {
    const [addresses, setAddresses] = useState<IResponseAddress[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [modalOpen, setModalOpen] = useState(false);
    const [pendingOrder, setPendingOrder] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
    const toast = useToast();

    const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
    const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
    const [cartItems, setCartItems] = useState<ICartItem[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        loadAddresses();
        loadCartItems();
    }, []);

    // Recalculate shipping options when addresses or selectedAddress changes
    useEffect(() => {
        const calcShipping = async () => {
            if (selectedAddress !== null && addresses.length > 0) {
                const addr = addresses.find((a) => a.id === selectedAddress);
                if (!addr) return;

                const shipmentData = {
                    from: {
                        postal_code: "85501560",
                    },
                    to: {
                        postal_code: addr.zip,
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
                    const result = await addressService.calculateShipment(shipmentData);
                    if (result && Array.isArray(result) && result.length > 0) {
                        const validOptions = result.filter((option: any) => !option.error && option.price);
                        setShippingOptions(validOptions);
                        if (validOptions.length > 0) {
                            setSelectedShipping(validOptions[0]);
                        } else {
                            setSelectedShipping(null);
                        }
                    } else {
                        setShippingOptions([]);
                        setSelectedShipping(null);
                    }
                } catch (error) {
                    console.error("Error calculating shipping:", error);
                    setShippingOptions([]);
                    setSelectedShipping(null);
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

    const loadCartItems = () => {
        const cartString = localStorage.getItem("cart");
        if (cartString) {
            const parsedCart: ICartItem[] = JSON.parse(cartString).map((item: ICartItem) => ({
                ...item,
                quantity: item.quantity ?? 1,
            }));
            setCartItems(parsedCart);
        }
    };
    const handleSelectAddress = (id: number) => {
        setSelectedAddress(id);
    };

    const handleAddressSaved = () => {
        setModalOpen(false);
        loadAddresses(); // Reload addresses after adding a new one
    };

    const handleFinishOrder = async () => {
        if (!selectedAddress || !paymentMethod || !selectedShipping) {
            toast({
                title: 'Order not made.',
                description: 'Please select an address, payment method, and shipping option.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top-right'
            });
            return;
        }

        if (!cartItems.length) {
            toast({
                title: 'Order not made.',
                description: 'No items in cart.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top-right'
            });
            return;
        }

        // Map cart items to order items structure
        const orderItems = cartItems.map((item) => ({
            product: { id: item.id },
            quantity: item.quantity,
        }));

        const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const total = subtotal + parseFloat(selectedShipping.price);
        const order = {
            shipping: parseFloat(selectedShipping.price),
            shippingMethod: selectedShipping.name,
            payment: paymentMethod,
            address: { id: selectedAddress },
            items: orderItems,
            total: total,
        };

        setPendingOrder(true);
        setOrderError(null);
        setOrderSuccess(null);

        try {
            const response = await orderService.save(order);
            if (response.status === 200 || response.status === 201) {
                setOrderSuccess("Order placed successfully!");
                localStorage.removeItem("cart");
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
        <main className="container py-4">
            <h1 className="mb-5 text-center">Checkout</h1>
            <div className="row">
                {/* Left Column: Addresses */}
                <div className="col-md-6">
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header">
                            <h5 className="mb-0">Select Delivery Address</h5>
                        </div>
                        <div className="card-body" style={{ maxHeight: "300px", overflowY: "auto" }}>
                            {addresses.length > 0 ? (
                                addresses.map((addr) => (
                                    <div
                                        key={addr.id}
                                        onClick={() => handleSelectAddress(addr.id)}
                                        className="card mb-2"
                                        style={{
                                            cursor: "pointer",
                                            backgroundColor: selectedAddress === addr.id ? "#cce5ff" : "#fff",
                                            border: selectedAddress === addr.id ? "2px solid #004085" : "1px solid #ccc"
                                        }}
                                    >
                                        <div className="card-body p-2">
                                            <p className="mb-0">
                                                {addr.street}, {addr.city}, {addr.state} - {addr.zip}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No saved addresses.</p>
                            )}
                        </div>
                        <div className="card-footer text-end">
                            <button className="btn btn-outline-primary" onClick={() => setModalOpen(true)}>
                                + Add New Address
                            </button>
                        </div>
                    </div>
                </div>
                {/* Right Column: Payment & Shipping */}
                <div className="col-md-6">
                    <div className="card mb-4 shadow-sm">
                        <div className="card-header">
                            <h5 className="mb-0">Select Payment Method</h5>
                        </div>
                        <div className="card-body">
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
                    </div>

                    <div className="card mb-4 shadow-sm">
                        <div className="card-header">
                            <h5 className="mb-0">Select Shipping Option</h5>
                        </div>
                        <div className="card-body">
                            {shippingOptions.length > 0 ? (
                                <select
                                    className="form-select"
                                    value={selectedShipping ? selectedShipping.id : ""}
                                    onChange={(e) => {
                                        const selectedId = parseInt(e.target.value);
                                        const option = shippingOptions.find((opt) => opt.id === selectedId);
                                        setSelectedShipping(option || null);
                                    }}
                                >
                                    {shippingOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name} - R${option.price} ({option.delivery_time} days)
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p>Frete indisponível</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cart Items Review */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header">
                    <h5 className="mb-0">Review Items in Cart</h5>
                </div>
                <div className="card-body">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={item.id} className="d-flex align-items-center mb-3">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "15px" }}
                                    className="rounded"
                                />
                                <div>
                                    <p className="mb-1 fw-bold">{item.title}</p>
                                    <p className="mb-0">Price: R${item.price}</p>
                                    <p className="mb-0">Quantity: {item.quantity}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No items in cart.</p>
                    )}
                </div>
            </div>

            <div className="text-center">
                <a href="/cart" className="text-muted text-decoration-underline me-5">
                    Go back to cart
                </a>
                <button className="btn btn-info btn-lg" onClick={handleFinishOrder} disabled={pendingOrder}>
                    {pendingOrder ? "Placing Order..." : "Finish Order"}
                </button>
            </div>

            {orderError && <div className="alert alert-danger mt-3">{orderError}</div>}
            {orderSuccess && <div className="alert alert-success mt-3">{orderSuccess}</div>}

            <AddAddressModal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                onAddressSaved={handleAddressSaved}
            />
        </main>
    );
};

export default Checkout;
