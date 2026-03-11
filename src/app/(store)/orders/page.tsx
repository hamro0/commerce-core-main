'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Card, Container, Stack, Text, Title, Badge, Group, Button, Center, Loader} from '@mantine/core';
import { IconPackage, IconChevronRight, IconReceipt2 } from '@tabler/icons-react';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

type OrderItem = { productId?: string; id?: string; name: string; price: number; quantity: number; };
type Order = {
    id: string;
    date?: string;
    status?: string;
    total: number;
    items?: OrderItem[]; 
};

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('user_token');
            if (!token) return router.push('/auth/login');

            try {
                const data = await api.orders.getAll(); 
                
                const sortedOrders = (data || []).sort((a: Order, b: Order) => {
                    const timeA = a.date ? new Date(a.date).getTime() : 0;
                    const timeB = b.date ? new Date(b.date).getTime() : 0;
                    return timeB - timeA;
                });
                
                setOrders(sortedOrders);
            } catch (error) {
                console.error("Fetch error:", error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [router]);

    const getStatusColor = (status?: string) => {
        if (!status) return 'orange.5';
        const s = status.toLowerCase();
        if (s.includes('delivered')) return 'teal.5';
        if (s.includes('shipped')) return 'blue.5';
        if (s.includes('processing')) return 'blue.4';
        if (s.includes('cancelled')) return 'red.5';
        return 'orange.5'; 
    };

    if (loading) return <Center h="100vh"><Loader color="violet" size="xl" type="bars" /></Center>;

    return (
        <Box className={layout.container} py={80}>
            <Container size="md" w="100%">
                <Group mb="xl" align="center" gap="sm">
                    <IconReceipt2 size={34} color="var(--mantine-color-violet-4)" />
                    <Title order={1} c="white" fw={800} lts={-0.5}>All Orders</Title>
                </Group>

                <Stack gap="lg">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <Card 
                                key={order.id} 
                                className={layout.glassCard} 
                                radius="xl" 
                                p="xl"
                            >
                                <Group justify="space-between" wrap="nowrap" align="flex-start">
                                    <Group gap="md" wrap="nowrap">
                                        <Center w={54} h={54} bg="rgba(255,255,255,0.05)" style={{ borderRadius: '14px' }}>
                                            <IconPackage size={28} color="#e9ecef" />
                                        </Center>
                                        <Stack gap={0}>
                                            <Text fw={700} fz="xl" c="white">
                                                Order #{String(order.id || 'N/A').slice(-6).toUpperCase()}
                                            </Text>
                                            <Text size="sm" c="gray.4" fw={500}>
                                                {order.date 
                                                    ? new Date(order.date).toLocaleDateString('en-US', { 
                                                        year: 'numeric', month: 'short', day: 'numeric',
                                                        hour: '2-digit', minute:'2-digit'
                                                    })
                                                    : 'Date not available'
                                                }
                                            </Text>
                                        </Stack>
                                    </Group>
                                    <Stack gap={8} align="flex-end">
                                        <Badge 
                                            variant="light" 
                                            color={getStatusColor(order.status)}
                                            size="lg"
                                            radius="sm"
                                        >
                                            {order.status || 'Pending'}
                                        </Badge>
                                        <Text fw={800} fz="xl" c="cyan.4">${(order.total || 0).toFixed(2)}</Text>
                                    </Stack>
                                </Group>
                                {order.items && order.items.length > 0 && (
                                    <Box mt="lg" bg="rgba(0,0,0,0.2)" p="md" style={{ borderRadius: '12px' }}>
                                        <Text size="sm" fw={600} c="gray.5" mb="sm">Order Items:</Text>
                                        <Stack gap="xs">
                                            {order.items.map((item, index) => (
                                                <Group key={index} justify="space-between" wrap="nowrap">
                                                    <Text size="sm" c="gray.3" fw={500} lineClamp={1}>
                                                        <Text component="span" c="violet.3" fw={700} mr={5}>{item.quantity}x</Text> 
                                                        {item.name}
                                                    </Text>
                                                    <Text size="sm" c="white" fw={600}>
                                                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                                    </Text>
                                                </Group>
                                            ))}
                                        </Stack>
                                    </Box>
                                )}
                                <Button 
                                    variant="subtle" 
                                    color="violet.4" 
                                    fullWidth
                                    mt="md"
                                    component={Link} 
                                    href={`/orders/${order.id}`}
                                    rightSection={<IconChevronRight size={16} />}
                                >
                                    View Full Order Details
                                </Button>
                            </Card>
                        ))
                    ) : (
                        <Card className={layout.glassCard} radius="xl" py={60}>
                            <Center>
                                <Stack align="center" gap="sm">
                                    <IconPackage size={60} color="#373A40" stroke={1.5} />
                                    <Title order={3} c="white">No Orders Found</Title>
                                    <Text c="gray.5" ta="center" maw={300}>
                                        There are no orders in the system right now.
                                    </Text>
                                    <Button variant="gradient" gradient={{ from: 'violet.6', to: 'cyan.5' }} mt="md" onClick={() => router.push('/products')}>
                                        Start Shopping
                                    </Button>
                                </Stack>
                            </Center>
                        </Card>
                    )}
                </Stack>
            </Container>
        </Box>
    );
}