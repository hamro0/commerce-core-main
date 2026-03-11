'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Card, Container, Text, Title, Group, Divider, Badge, Center, Loader, Stack, ActionIcon } from '@mantine/core';
import { IconArrowLeft, IconReceipt, IconPackage, IconCreditCard } from '@tabler/icons-react';
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
    paymentMethod?: string;
    date?: string;
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

            try {
                const data = await api.orders.getById(id);
                setOrder(data);
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, router]);

    if (loading) return <Center h="100vh"><Loader color="violet" type="bars" /></Center>;
    if (!order) return <Center h="100vh"><Text c="white">Order not found</Text></Center>;

    return (
        <Box className={layout.container} py={60}>
            <Container size="sm">
                <Group mb="lg">
                    <ActionIcon 
                        variant="subtle" 
                        color="gray" 
                        onClick={() => router.back()}
                        size="lg"
                    >
                        <IconArrowLeft size={20} />
                    </ActionIcon>
                    <Text c="gray.5" fw={500}>Back to Orders</Text>
                </Group>
                <Card className={layout.glassCard} radius="24px" p={40}>
                    <Stack gap="xl">
                        <Group justify="space-between" align="flex-start">
                            <Stack gap={4}>
                                <Group gap="xs">
                                    <IconReceipt size={24} color="var(--mantine-color-violet-4)" />
                                    <Title order={2} c="white" lts={-0.5}>Order Details</Title>
                                </Group>
                                <Text c="gray.5" size="sm">ID: #{order.id}</Text>
                            </Stack>
                            <Badge 
                                size="xl" 
                                color={order.status === 'Delivered' ? 'teal' : 'violet'} 
                                variant="light"
                                radius="md"
                            >
                                {order.status}
                            </Badge>
                        </Group>
                        <Divider color="rgba(255,255,255,0.08)" />
                        <Stack gap="md">
                            <Group gap="xs">
                                <IconPackage size={20} color="#adb5bd" />
                                <Text fw={700} c="white" fz="lg">Items Summary</Text>
                            </Group>
                            <Stack gap="xs">
                                {order.items?.map((item, index) => (
                                    <Group key={item.productId || item.id || index} justify="space-between" p="sm" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                                        <Box>
                                            <Text fw={600} c="white">{item.name}</Text>
                                            <Text size="sm" c="gray.5">Quantity: {item.quantity}</Text>
                                        </Box>
                                        <Text fw={700} c="violet.3">${(item.price * item.quantity).toFixed(2)}</Text>
                                    </Group>
                                ))}
                            </Stack>
                        </Stack>
                        <Divider color="rgba(255,255,255,0.08)" />
                        <Stack gap="sm">
                            <Group justify="space-between">
                                <Group gap="xs">
                                    <IconCreditCard size={20} color="#adb5bd" />
                                    <Text c="gray.4">Payment Method</Text>
                                </Group>
                                <Text c="white" fw={600} tt="capitalize">{order.paymentMethod || 'Cash'}</Text>
                            </Group>
                            <Group justify="space-between" mt="md">
                                <Text fw={800} fz={24} c="white">Total Amount</Text>
                                <Text fw={900} fz={28} c="cyan.4">
                                    ${order.total?.toFixed(2) || '0.00'}
                                </Text>
                            </Group>
                        </Stack>
                    </Stack>
                </Card>
            </Container>
        </Box>
    );
}