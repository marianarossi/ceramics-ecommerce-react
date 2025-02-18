import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductService from '@/service/product-service';
import { IProduct } from '@/commons/interfaces';
import ProductSlide from '@/components/product-slide';
import { useToast } from "@chakra-ui/react";
import addressService from "@/service/address-service";

const ProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [shippingPostalCode, setShippingPostalCode] = useState('');
    const [shippingCost, setShippingCost] = useState<string | null>(null);
    const toast = useToast();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await ProductService.findProductInfoById(Number(id));
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product", error);
            }
        };
        fetchProduct();
    }, [id]);

    const changeImage = (src: string) => {
        const mainImage = document.getElementById('mainImage') as HTMLImageElement;
        if (mainImage) {
            mainImage.src = src;
        }
    };

    const addItemCart = (product: IProduct) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (!cart.find((p: IProduct) => p.id === product.id)) {
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            toast({
                title: 'Product added.',
                description: 'This product was added to your cart.',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right'
            });
        } else {
            toast({
                title: 'Product already in the cart.',
                description: 'This product is already added to your cart.',
                duration: 3000,
                status: 'warning',
                isClosable: true,
                position: 'top-right'
            });
        }
    };

    const handleCalculateShipping = async () => {
        if (!shippingPostalCode) {
            toast({
                title: 'CEP não informado.',
                description: 'Por favor, informe um CEP para calcular o frete.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top-right'
            });
            return;
        }

        // Prepare the shipment data; adjust as needed.
        const shipmentData = {
            from: {
                postal_code: "85501560" // Fixed origin postal code
            },
            to: {
                postal_code: shippingPostalCode // Postal code from user input
            },
            products: [
                {
                    id: "x",
                    width: 11,
                    height: 17,
                    length: 11,
                    weight: 0.3,
                    insurance_value: 10.1,
                    quantity: 1
                }
            ],
            options: {
                receipt: false,
                own_hand: false
            },
            services: "1,2,18"
        };

        // Call your calculateShipment function.
        const result = await addressService.calculateShipment(shipmentData);
        if (result && Array.isArray(result) && result.length > 0) {
            // For demonstration, we display the price of the first two options.
            let message = '';
            if (result[0] && result[0].price) {
                message += `PAC: ${result[0].price}`;
            }
            if (result[1] && result[1].price) {
                message += ` | SEDEX: ${result[1].price}`;
            }
            setShippingCost(message);
        } else {
            setShippingCost("Frete indisponível");
        }
    };

    if (!product) return <p>Loading...</p>;

    return (
        <main data-page="product">
            <div className="productpage display-flex">
                <div className="w-50 content-center">
                    <div className="productgallery">
                        <img id="mainImage" className="productimage" src={product.img} alt={product.title} />
                        <div className="minigallery">
                            <img className="miniphoto" src={product.img} alt="" onClick={() => changeImage(product.img)} />
                            <img className="miniphoto" src={product.img1} alt="" onClick={() => changeImage(product.img1)} />
                            <img className="miniphoto" src={product.img2} alt="" onClick={() => changeImage(product.img2)} />
                            <img className="miniphoto" src={product.img3} alt="" onClick={() => changeImage(product.img3)} />
                        </div>
                    </div>
                </div>
                <div className="w-50 content-center productinfodiv">
                    <h2><strong>{product.title}</strong></h2>
                    <p>{product.text}</p>
                    <p><strong>Support Local Art</strong></p>
                    <p>
                        <s>${product.price}</s> <strong>{product.installment}</strong>
                    </p>

                    {/* Shipping Calculation */}
                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="text"
                            className="button shippingbutton"
                            placeholder="Enter postal code"
                            value={shippingPostalCode}
                            onChange={(e) => setShippingPostalCode(e.target.value)}
                            aria-label="Postal Code"
                        />
                        <button className="button" onClick={handleCalculateShipping}>
                            Calculate Shipping
                        </button>
                    </div>
                    {shippingCost && <p>Shipping Cost: {shippingCost}</p>}

                    <button className="button" onClick={() => addItemCart(product)}>
                        Adicionar ao carrinho
                    </button>
                </div>
            </div>
            <div className="productinfo">
                <table className="table">
                    <thead>
                    <tr>
                        <th>
                            <h2>
                                <strong>Product Description</strong>
                            </h2>
                        </th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>Color</th>
                        <th>{product.color}</th>
                    </tr>
                    <tr>
                        <th>Height</th>
                        <th>{product.height}</th>
                    </tr>
                    <tr>
                        <th>Width</th>
                        <th>{product.width}</th>
                    </tr>
                    <tr>
                        <th>Recommended environment</th>
                        <th>{product.recommended_environment}</th>
                    </tr>
                    <tr>
                        <th>Recommended for plants</th>
                        <th>{product.recommended_for_plants}</th>
                    </tr>
                    </tbody>
                </table>
            </div>
            <ProductSlide />
        </main>
    );
};

export default ProductPage;
