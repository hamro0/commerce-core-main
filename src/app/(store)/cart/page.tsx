'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Card, Title, Text, Button, Group, Divider, Center, Loader } from '@mantine/core';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

type CartItem = {
    productId: string; 
    name: string;
    price: number;
    quantity: number;
};

type CartData = {
    items: CartItem[];
    total: number;
};

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem('user_token');

            if (!token) {
                router.push('/auth/login');
                return;
            }

            const data = await api.cart.get();
            setCart(data);
            setLoading(false);
        };

        fetchCart();
    }, [router]);

    if (loading) {
        return (
            <Center h="100vh">
                <Loader color="violet" size="xl" type="bars" />
            </Center>
        );
    }

    return (
        <Box className={layout.container}>
            <Box className={layout.shell} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <Title order={1} c="white">Your Shopping Cart</Title>

                <Card className={layout.card}>
                    <Box style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {cart?.items?.length ? (
                            cart.items.map((item) => (
                                <Group key={item.productId} justify="space-between">
                                    <Box>
                                        <Text fw={500} c="white">{item.name}</Text>
                                        <Text size="xs" c="gray.5">Quantity: {item.quantity}</Text>
                                    </Box>
                                    <Text fw={700} c="white">${item.price}</Text>
                                </Group>
                            ))
                        ) : (
                            <Text c="gray.5" ta="center" py="xl">Your cart is empty.</Text>
                        )}

                        <Divider my="sm" color="rgba(255,255,255,0.1)" />

                        <Group justify="space-between">
                            <Text size="lg" fw={700} c="white">Total</Text>
                            <Text size="lg" fw={700} c="cyan.4">${cart?.total}</Text>
                        </Group>

                        <Button
                            onClick={() => router.push("/checkout")}
                            fullWidth
                            size="md"
                            variant="gradient"
                            gradient={{ from: 'violet', to: 'cyan' }}
                            mt="md"
                            disabled={!cart?.items?.length}
                        >
                            Proceed to Checkout
                        </Button>
                    </Box>
                </Card>
            </Box>
        </Box>
    );
}