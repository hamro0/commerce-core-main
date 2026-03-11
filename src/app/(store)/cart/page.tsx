'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Card, Title, Text, Stack, Group, Button, Center, Loader, Divider } from '@mantine/core';
import { IconChevronRight, IconShoppingCart } from '@tabler/icons-react';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

type CartItem = {
    id?: string;
    productId?: string;
    name: string;
    price: number;
    quantity: number;
    [key: string]: any;
};

export default function CartItemsPage() {
    const router = useRouter();
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        api.cart.get()
            .then((data) => {
                const rawItems = Array.isArray(data) ? data : (data.items || []);
                const validItems = rawItems.filter((item: CartItem) => item && (item.id || item.productId));
                setItems(validItems);
                const calcTotal = validItems.reduce((sum: number, item: CartItem) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
                setTotal(calcTotal);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Center h="100vh"><Loader color="violet" type="bars" /></Center>;

    return (
    <Box className={layout.container} py={60}>
        <Box maw={600} mx="auto" w="100%">
            <Title order={2} c="white" mb="xl" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <IconShoppingCart size={28} color="var(--mantine-color-violet-5)" />
                Cart Management
            </Title>

            <Stack gap="md">
                {items.length > 0 ? (
                    <>
                        {items.map((item: CartItem) => (
                            <Card key={item.id || item.productId} className={layout.glassCard} p="lg" radius="xl">
                                <Group justify="space-between" align="center">
                                    <Stack gap={4}>
                                        <Text fw={700} c="white" fz="lg">{item.name || 'Unknown Product'}</Text>
                                        <Text size="md" c="violet.3" fw={600}>
                                            Qty: {item.quantity} • ${(item.price * item.quantity).toFixed(2)}
                                        </Text>
                                    </Stack>
                                    <Button
                                        variant="light"
                                        color="violet"
                                        radius="md"
                                        component={Link}
                                        href={`/cart/items/${item.id || item.productId}`}
                                        rightSection={<IconChevronRight size={16} />}
                                    >
                                        Manage
                                    </Button>
                                </Group>
                            </Card>
                        ))}                        
                        <Divider my="sm" color="rgba(255,255,255,0.05)" />                  
                        <Group justify="space-between">
                            <Text size="xl" fw={700} c="white">Total</Text>
                            <Text size="xl" fw={800} c="cyan.4">${total.toFixed(2)}</Text>
                        </Group>
                        <Button 
                            size="lg" radius="md" 
                            variant="gradient" gradient={{ from: 'violet.6', to: 'cyan.5' }} 
                            onClick={() => router.push('/checkout')}
                        >
                            Proceed to Checkout
                        </Button>
                    </>
                ) : (
                    <Card className={layout.glassCard} p="xl" radius="xl">
                        <Center py={40}>
                            <Stack align="center" gap="sm">
                                <IconShoppingCart size={48} color="#373A40" />
                                <Text c="gray.5" fz="lg" ta="center">Your cart is empty.</Text>
                                <Button variant="subtle" color="violet" onClick={() => router.push('/products')}>
                                    Browse Products
                                </Button>
                            </Stack>
                        </Center>
                    </Card>
                )}
            </Stack>
        </Box>
    </Box>
);
}