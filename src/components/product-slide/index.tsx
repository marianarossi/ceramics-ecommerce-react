// ProductSlide.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IProduct } from '@/commons/interfaces';
import ProductService from '@/service/product-service';
import { useToast } from '@chakra-ui/react';

const ProductSlide: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ProductService.findAllPageable(currentPage);
                // API returns a pageable object so we extract the content array
                setProducts(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("An error occurred while loading the products", error);
            }
        };

        fetchProducts();
    }, [currentPage]);

    const addItemCart = (product: IProduct) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.find((item: IProduct) => item.id === product.id)) {
            toast({
                title: 'Product already in the cart.',
                description: 'This product is already added to your cart.',
                duration: 3000,
                status: 'warning',
                isClosable: true,
                position: 'top-right',
            });
        } else {
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            toast({
                title: 'Product added.',
                description: 'This product was added to your cart.',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const loadProduct = (productId: number) => {
        navigate(`/product/${productId}`);
    };

    return (
        <div>
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
                                    <s className="text-muted bg-transparent me-2">${product.price}</s>
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

            {/* Pagination Controls */}
            <div className="pagination-controls d-flex justify-content-center align-items-center mt-3">
                <button
                    className="btn btn-secondary me-2"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(prev => prev - 1)}>
                    Previous
                </button>
                <span>
          Page {currentPage + 1} of {totalPages}
        </span>
                <button
                    className="btn btn-secondary ms-2"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage(prev => prev + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default ProductSlide;
