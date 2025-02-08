import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductService from '@/service/product-service';
import { IProduct } from '@/commons/interfaces';
import ProductSlide from '@/components/product-slide';

const ProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<IProduct | null>(null);

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
        alert('Product added to the cart');
    } else {
        alert('Product already in the cart');
    }
};

    if (!product) return <p>Loading...</p>;

    return (
        <main data-page="product">
            <div className='productpage display-flex'>
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
                    <p><s>{product.price}</s> <strong>{product.installment}</strong></p>
                    <input type="search" className="button shippingbutton" placeholder="Estimate Shipping" aria-label="Search" aria-describedby="search-addon" />
                    <button className="button" onClick={() => addItemCart(product)}>Adicionar ao carrinho</button>
                </div>
            </div>
            <div className="productinfo">
                <table className="table">
                    <thead>
                        <tr>
                            <th><h2><strong>Product Description</strong></h2></th>
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
            <ProductSlide/>
        </main>
    );
};


export default ProductPage;
