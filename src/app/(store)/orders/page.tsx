'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Card, Container, Stack, Text, Title, Badge, Group, Button, Center, Loader } from '@mantine/core';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

type Order = {
    id: string;
    date: string;
    status: string;
    total: number;
};

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
    const userData = localStorage.getItem('user_data');
    if (!userData) return router.push('/auth/login');

    try {
        const user = JSON.parse(userData);
        const userId = user.id || user._id; // سطر الأمان
        
        console.log("Fetching orders for user ID:", userId); // افحص هاد بالمتصفح
        
        const data = await api.orders.getUserOrders(userId);
        console.log("Data received from server:", data);
        
        setOrders(data || []);
    } catch (error) {
        console.error("Fetch error:", error);
        setOrders([]);
    } finally {
        setLoading(false);
    }
};

        fetchOrders();
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
            <Container size="xl">
                <Title order={1} c="white" mb="xl">Your Orders</Title>

                <Stack gap="md">
                    {orders && orders.length > 0 ? (
                        orders.map((order) => (
                            <Card key={order.id} className={layout.card}>
                                <Group justify="space-between">
                                    <Stack gap={4}>
                                        <Text fw={700} c="white">Order #{order.id}</Text>
                                        <Text size="sm" c="gray.5">
                                            {new Date(order.date).toLocaleDateString()}
                                        </Text>
                                    </Stack>

                                    <Group gap="xl">
                                        <Stack gap={4} align="flex-end">
                                            <Badge variant="light" color={order.status === 'Delivered' ? 'green' : 'violet'}>
                                                {order.status}
                                            </Badge>
                                            <Text fw={700} c="white">${order.total?.toFixed(2)}</Text>
                                        </Stack>
                                        <Button variant="outline" color="gray" component={Link} href={`/orders/${order.id}`}>
                                            Details
                                        </Button>
                                    </Group>
                                </Group>
                            </Card>
                        ))
                    ) : (
                        <Card className={layout.card} py="xl">
                            <Text c="gray.5" ta="center">You have no orders yet.</Text>
                        </Card>
                    )}
                </Stack>
            </Container>
        </Box>
    );
}