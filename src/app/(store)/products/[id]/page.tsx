'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Grid, Image, Title, Text, Button, Badge, Group, Stack, Card, Center, Loader, ActionIcon, Divider } from '@mantine/core';
import { IconShoppingCartPlus, IconHeart, IconMinus, IconPlus } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

type ProductDetail = {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl?: string;
    stock: number;
};

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function ProductDetailPage({ params }: PageProps) {
    const router = useRouter();
    const { id } = use(params);
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id || id === 'undefined') return;
            try {
                const data = await api.products.getById(id);
                setProduct(data);
            } catch (error) {
                console.error("Failed to load product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

const handleAddToCart = async () => {
    const token = localStorage.getItem('user_token');
    if (!token) {
        router.push('/auth/login');
        return;
    }

    if (!product) return;
    setIsAddingToCart(true);

    try {
        const cartData = await api.cart.get();
        let currentItems = cartData?.items || [];
        const existingIndex = currentItems.findIndex((item: any) => String(item.id) === String(product.id));
        if (existingIndex > -1) {
            currentItems[existingIndex].quantity += quantity;
        } else {
            currentItems.push({
                ...product, 
                quantity: quantity
            });
        }
        const newTotal = currentItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        await api.cart.sync({
            items: currentItems,
            total: newTotal
        });
        notifications.show({
            title: 'Added to Cart',
            message: `${quantity}x ${product.name} successfully added!`,
            color: 'teal',
            icon: <IconShoppingCartPlus size={16} />,
        });
    } catch (error) {
        console.error("Error adding to cart:", error);
        notifications.show({
            title: 'Error',
            message: 'Could not add item to cart.',
            color: 'red',
        });
    } finally {
        setIsAddingToCart(false);
    }
};
    if (loading) return <Center h="100vh"><Loader color="violet" size="xl" type="bars" /></Center>;
    if (!product) return <Center h="100vh"><Text c="white" fz="xl">Product not found</Text></Center>;

    return (
        <Box className={layout.container} py={80}>
            <Card className={layout.glassCard} radius="24px" p={40} maw={1000} mx="auto">
                <Grid gutter={50} align="center">
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Image
                            radius="xl"
                            src={product.imageUrl || "/cobra-pro.webp"}
                            alt={product.name}
                            style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Stack gap="lg">
                            <Group>
                                <Badge size="lg" variant="filled" color={product.stock > 0 ? "violet.6" : "red.6"}>
                                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </Badge>
                                {product.stock > 0 && (
                                    <Text size="sm" c="gray.5">{product.stock} units available</Text>
                                )}
                            </Group>
                            <Title order={1} fz={42} fw={800} c="white" lts={-1}>{product.name}</Title>
                            <Text size="h1" fw={900} c="cyan.4">${product.price?.toFixed(2)}</Text>
                            <Text c="gray.4" size="md" lh={1.6}>{product.description}</Text>
                            <Divider color="rgba(255,255,255,0.1)" my="sm" />
                            <Stack gap="md">
                                <Text size="sm" fw={600} c="white">Select Quantity</Text>
                                <Group gap="md">
                                    <Group gap="xs" style={{ background: 'rgba(255,255,255,0.05)', padding: '5px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <ActionIcon variant="transparent" color="gray" size="lg" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1 || product.stock === 0}>
                                            <IconMinus size={16} />
                                        </ActionIcon>
                                        <Text c="white" fw={700} w={30} ta="center">{quantity}</Text>
                                        <ActionIcon variant="transparent" color="gray" size="lg" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock || product.stock === 0}>
                                            <IconPlus size={16} />
                                        </ActionIcon>
                                    </Group>
                                    <Button 
                                        size="lg" radius="md" 
                                        variant="gradient" gradient={{ from: 'violet.6', to: 'cyan.5' }} 
                                        flex={1}
                                        leftSection={<IconShoppingCartPlus size={20} />}
                                        onClick={handleAddToCart}
                                        loading={isAddingToCart}
                                        disabled={product.stock === 0}
                                    >
                                        Add to Cart
                                    </Button>
                                    <ActionIcon size="xl" radius="md" variant="default" style={{ height: '54px', width: '54px', backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
                                        <IconHeart size={24} color="#e9ecef" />
                                    </ActionIcon>
                                </Group>
                            </Stack>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Card>
        </Box>
    );
}