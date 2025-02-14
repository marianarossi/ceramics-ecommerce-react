import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, SimpleGrid, Box, Image, Heading, Text, Button, Flex, Fade, useToast,} from '@chakra-ui/react';
import { IProduct } from '@/commons/interfaces';
import ProductService from '@/service/product-service';
import CategoryService from '@/service/category-service'; // Ensure this service exists

const ProductCategoryPage: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [categories, setCategories] = useState<any[]>([]); // Adjust type as needed
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await CategoryService.findAll();
                setCategories(response.data);
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const categoryObj = categories.find(
        (cat) => cat.id.toString() === id
    );
    const categoryName = id
        ? categoryObj
            ? categoryObj.name
            : id
        : 'All Products';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (id) {
                    const response = await ProductService.findProductsByCategory(id);
                    setProducts(response.data);
                } else {
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
                <Flex align="start">
                    <Box flex="1">
                        <Fade in={true} transition={{ enter: { duration: 0.8 } }}>
                            <Heading mb={6}>Products in {categoryName}</Heading>
                            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
                                {products.map((product) => (
                                    <Box
                                        key={product.id}
                                        borderWidth="1px"
                                        borderRadius="lg"
                                        overflow="hidden"
                                        boxShadow="md"
                                        _hover={{
                                            boxShadow: 'lg',
                                            transform: 'scale(1.02)',
                                            transition: 'transform 0.2s',
                                        }}
                                        display="flex"
                                        flexDirection="column"
                                    >
                                        <Image
                                            src={product.img}
                                            alt={product.title}
                                            objectFit="cover"
                                            width="100%"
                                            height="200px"
                                            cursor="pointer"
                                            onClick={() => handleViewDetails(product.id)}
                                        />
                                        <Box p={6} display="flex" flexDirection="column" flex="1">
                                            <Heading
                                                size="md"
                                                mb={2}
                                                cursor="pointer"
                                                onClick={() => handleViewDetails(product.id)}
                                            >
                                                {product.title}
                                            </Heading>
                                            <Text mb={4} flex="1">
                                                {product.text}
                                            </Text>
                                            <Flex alignItems="center" mb={4}>
                                                <Text textDecoration="line-through" color="gray.500" mr={2}>
                                                    {product.price}
                                                </Text>
                                                <Text fontWeight="bold">{product.installment}</Text>
                                            </Flex>
                                            <Flex mt="auto" justifyContent="space-between">
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
                        </Fade>
                    </Box>
                </Flex>
            </Container>
        </main>
    );
};

export default ProductCategoryPage;