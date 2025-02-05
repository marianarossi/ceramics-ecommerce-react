import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductService from '@/service/product-service';
import { IProduct } from '@/commons/interfaces';

const ProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<IProduct | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await ProductService.findById(Number(id));
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product", error);
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) return <p>Loading...</p>;

    return (
        <div >
            <h2>{product.title}</h2>
            <img src={product.img} alt={product.title} style={{ width: '100%', maxWidth: '400px' }} />
            <p>{product.text}</p>
            <p><strong>Price:</strong> {product.price}</p>
            <p><strong>Installment:</strong> {product.installment}</p>
            <button className="btn btn-dark" onClick={() => alert('Added to cart')}>Add to Cart</button>
        </div>
    );
};

export default ProductPage;
