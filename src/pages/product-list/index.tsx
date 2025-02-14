import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    SimpleGrid,
    Box,
    Image,
    Heading,
    Text,
    Button,
    Flex,
    useToast,
} from '@chakra-ui/react';
import { IProduct } from '@/commons/interfaces';
import ProductService from '@/service/product-service';

const ProductCategoryPage: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    // Here the 'id' is considered the category id.
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (id) {
                    // Fetch products filtered by the category id.
                    const response = await ProductService.findProductsByCategory(id);
                    setProducts(response.data);
                } else {
                    // Fallback: Load all products if no category id is provided.
                    const response = await ProductService.findAll();
                    setProducts(response.data);
                }
            } catch (error) {
                console.error('Error loading products:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load products. Please try again later.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'top-right',
                });
            }
        };

        fetchProducts();
    }, [id, toast]);

    const handleAddToCart = (product: IProduct) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.find((item: IProduct) => item.id === product.id)) {
            toast({
                title: 'Product already in cart',
                description: 'This product is already added to your cart.',
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
        } else {
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            toast({
                title: 'Product added',
                description: 'This product was added to your cart.',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const handleViewDetails = (productId: number | undefined) => {
        if (productId) {
            navigate(`/product/${productId}`);
        }
    };

    return (
        <main>
        <Container maxW="container.xl" py={10}>
            <Heading mb={6}>
                {id ? `Products in Category ${id}` : 'All Products'}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                {products.map((product) => (
                    <Box
                        key={product.id}
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        boxShadow="md"
                        _hover={{ boxShadow: 'lg' }}
                    >
                        <Image
                            src={product.img}
                            alt={product.title}
                            objectFit="cover"
                            width="100%"
                            height="200px"
                        />
                        <Box p={6}>
                            <Heading size="md" mb={2}>
                                {product.title}
                            </Heading>
                            <Text mb={4}>{product.text}</Text>
                            <Flex justifyContent="space-between" alignItems="center">
                                <Text textDecoration="line-through" color="gray.500">
                                    {product.price}
                                </Text>
                                <Text fontWeight="bold">{product.installment}</Text>
                            </Flex>
                            <Flex mt={4} justifyContent="space-between">
                                <Button
                                    colorScheme="blue"
                                    onClick={() => handleViewDetails(product.id)}
                                >
                                    View Details
                                </Button>
                                <Button
                                    colorScheme="green"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Add to Cart
                                </Button>
                            </Flex>
                        </Box>
                    </Box>
                ))}
            </SimpleGrid>
        </Container>
        </main>
    );
};

export default ProductCategoryPage;
