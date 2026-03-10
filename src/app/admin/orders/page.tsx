'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Container, Title, Table, Badge, ActionIcon, Card, TextInput, Center, Loader } from '@mantine/core';
import { IconEye, IconSearch } from '@tabler/icons-react';
import layout from '@/src/components/layout/StoreLayout.module.css';
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

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('user_token');
            if (!token) return router.push('/auth/login');

            const data = await api.orders.getAll();
            setOrders(data);
            setLoading(false);
        };
        fetchOrders();
    }, [router]);

    if (loading) return <Center h="100vh"><Loader color="violet" /></Center>;

    return (
        <Box className={layout.container}>
            <Container size="xl">
                <Box style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        <Title order={1} c="white">Admin Orders Control</Title>
                        <TextInput
                            placeholder="Search by Order ID..."
                            leftSection={<IconSearch size={16} />}
                            style={{ width: '300px' }}
                            variant="unstyled"
                            className={layout.actionBtn}
                        />
                    </Box>

                    <Card className={layout.card} p={0} style={{ overflowX: 'auto' }}>
                        <Table verticalSpacing="md" variant="unstyled" c="white">
                            <Table.Thead style={{ background: 'rgba(255,255,255,0.03)' }}>
                                <Table.Tr>
                                    <Table.Th>Order ID</Table.Th>
                                    <Table.Th>Date</Table.Th>
                                    <Table.Th>Total</Table.Th>
                                    <Table.Th>Status</Table.Th>
                                    <Table.Th ta="right">Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {orders.map((order) => (
                                    <Table.Tr key={order.id}>
                                        <Table.Td fw={700} c="violet.2">{order.id}</Table.Td>
                                        <Table.Td c="gray.5">{new Date(order.date).toLocaleDateString()}</Table.Td>
                                        <Table.Td fw={700}>${order.total?.toFixed(2)}</Table.Td>
                                        <Table.Td>
                                            <Badge
                                                color={order.status === 'Delivered' ? 'green' : order.status === 'Processing' ? 'blue' : 'orange'}
                                                variant="light" radius="sm">
                                                {order.status}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td ta="right">
                                            <ActionIcon variant="subtle" color="gray" radius="md" component={Link} href={`/admin/orders/${order.id}`}>
                                                <IconEye size={18} />
                                            </ActionIcon>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
}