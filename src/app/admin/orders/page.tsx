'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Container, Title, Table, Badge, ActionIcon, Card, TextInput, Center, Loader, Text, Stack } from '@mantine/core';
import { IconEye, IconSearch, IconMoodEmpty } from '@tabler/icons-react';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

type Order = {
    id: string;
    customer?: string;
    date: string;
    total: number;
    status: string;
};

export default function AdminOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('user_token');
            if (!token) return router.push('/auth/login');

            try {
                const data = await api.orders.getAll();
                setOrders(data || []);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [router]);

    const filteredOrders = useMemo(() => {
        return orders.filter((order) =>
            order.id.toLowerCase().includes(search.toLowerCase())
        );
    }, [orders, search]);

    if (loading) return <Center h="100vh"><Loader color="violet" type="bars" /></Center>;

    return (
        <Box className={layout.container} py={60}>
            <Container size="xl">
                <Stack gap="xl">
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        <Title order={1} c="white" fw={800}>Admin Orders Control</Title>
                        <TextInput
                            placeholder="Search by Order ID (e.g. B19ft...)"
                            leftSection={<IconSearch size={18} color="#adb5bd" />}
                            value={search}
                            onChange={(e) => setSearch(e.currentTarget.value)}
                            size="md"
                            radius="md"
                            style={{ width: '350px' }}
                            styles={{ 
                                input: { 
                                    backgroundColor: 'rgba(255,255,255,0.05)', 
                                    color: 'white', 
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    transition: 'border-color 0.2s ease'
                                } 
                            }}
                        />
                    </Box>
                    <Card className={layout.glassCard} p={0} radius="xl" style={{ overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Box style={{ overflowX: 'auto' }}>
                            <Table verticalSpacing="md" horizontalSpacing="lg" variant="unstyled" c="white">
                                <Table.Thead style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Table.Tr>
                                        <Table.Th>Order ID</Table.Th>
                                        <Table.Th>Date</Table.Th>
                                        <Table.Th>Total</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                        <Table.Th ta="right">Actions</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => (
                                            <Table.Tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                                <Table.Td fw={700} c="violet.2">{order.id.toUpperCase()}</Table.Td>
                                                <Table.Td c="gray.5">
                                                    {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                                                </Table.Td>
                                                <Table.Td fw={800} c="cyan.4">${(order.total || 0).toFixed(2)}</Table.Td>
                                                <Table.Td>
                                                    <Badge
                                                        color={order.status === 'Delivered' ? 'teal' : order.status === 'Processing' ? 'blue' : 'orange'}
                                                        variant="light" 
                                                        radius="sm"
                                                        size="md"
                                                    >
                                                        {order.status || 'Pending'}
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td ta="right">
                                                    <ActionIcon 
                                                        variant="subtle" 
                                                        color="violet.3" 
                                                        radius="md" 
                                                        size="lg"
                                                        component={Link} 
                                                        href={`/admin/orders/${order.id}`}
                                                    >
                                                        <IconEye size={20} />
                                                    </ActionIcon>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))
                                    ) : (
                                        <Table.Tr>
                                            <Table.Td colSpan={5}>
                                                <Center py={60}>
                                                    <Stack align="center" gap="xs">
                                                        <IconMoodEmpty size={40} color="#5c5f66" />
                                                        <Text c="gray.6" fw={500}>No orders match "{search}"</Text>
                                                    </Stack>
                                                </Center>
                                            </Table.Td>
                                        </Table.Tr>
                                    )}
                                </Table.Tbody>
                            </Table>
                        </Box>
                    </Card>
                </Stack>
            </Container>
        </Box>
    );
}