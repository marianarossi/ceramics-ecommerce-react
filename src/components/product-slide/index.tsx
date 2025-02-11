import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IProduct } from '@/commons/interfaces';
import ProductService from '@/service/product-service';
import {useToast} from "@chakra-ui/react";


const ProductSlide: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const navigate = useNavigate();
    const toast = useToast(); // Initialize toast

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ProductService.findAll();
                setProducts(response.data);
            } catch (error) {
                console.error("An error occurred while loading the products", error);
            }
        };

        fetchProducts();
    }, []);

    const addItemCart = (product: IProduct) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.find((item: IProduct) => item.id === product.id)) {
            toast({
                title: 'Product already in the cart.',
                description: 'This product is already added to your cart.',
                duration: 3000,
                status: 'warning',
                isClosable: true,
                position: 'top-right'});
        } else {
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            toast({
                title: 'Product added.',
                description: 'This product was added to your cart.',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right'});
        }
    };

    const loadProduct = (productId: number) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div className="mt-5 row row-cols-1 row-cols-md-3 g-4 mx-5" id="product-cards">
            {products.map(product => (
                <div className="col" key={product.id}>
                    <div className="card h-100">
                        <img src={product.img} className="card-img-top" alt={product.title} />
                        <div className="card-body" onClick={() => loadProduct(product.id!)}>
                            <h5 className="card-title">{product.title}</h5>
                            <p className="card-text">{product.text}</p>
                        </div>
                        <div className="card-footer d-flex justify-content-between flex-column flex-lg-row">
                            <div className="d-flex bg-transparent align-items-end">
                                <s className="text-muted bg-transparent me-2">{product.price}</s>
                                <strong className="bg-transparent">{product.installment}</strong>
                            </div>
                            <button
                                type="button"
                                className="btn btn-sm btn-dark btn-outline-success"
                                onClick={() => addItemCart(product)}>
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductSlide;
