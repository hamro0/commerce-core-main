'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Card, Container, Text, Title, Group, Divider, Badge, Center, Loader } from '@mantine/core';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

type OrderItem = {
    id?: string;
    productId?: string;
    name: string;
    price: number;
    quantity: number;
};

type Order = {
    id: string;
    status: string;
    total: number;
    items: OrderItem[];
};

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function OrderDetailsPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            const token = localStorage.getItem('user_token');
            if (!token) return router.push('/auth/login');

            const data = await api.orders.getById(id);
            setOrder(data);
            setLoading(false);
        };
        fetchOrder();
    }, [id, router]);

    if (loading) return <Center h="100vh"><Loader color="violet" /></Center>;
    if (!order) return <Center h="100vh"><Text c="white">Order not found</Text></Center>;

    return (
        <Box className={layout.container}>
            <Container size="sm">
                <Card className={layout.card}>
                    <Box style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <Group justify="space-between">
                            <Title order={2} c="white">Order #{order.id}</Title>
                            <Badge size="lg" color={order.status === 'Delivered' ? 'green' : 'violet'} variant="light">
                                {order.status}
                            </Badge>
                        </Group>
                        <Divider color="rgba(255,255,255,0.08)" />
                        <Box style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <Text fw={700} c="white">Order Items</Text>
                            {order.items?.map((item, index) => (
                                <Group key={item.id || item.productId || `item-${index}`} justify="space-between">
                                    <Text c="gray.4">{item.name} x {item.quantity}</Text>
                                    <Text c="white" fw={500}>${(item.price * item.quantity).toFixed(2)}</Text>
                                </Group>
                            ))}
                        </Box>
                        <Divider color="rgba(255,255,255,0.08)" />
                        <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Group justify="space-between">
                                <Text fw={700} size="lg" c="white">Total Amount</Text>
                                <Text fw={700} size="lg" c="violet.3">${order.total?.toFixed(2) || '0.00'}</Text>
                            </Group>
                        </Box>
                    </Box>
                </Card>
            </Container>
        </Box>
    );
}