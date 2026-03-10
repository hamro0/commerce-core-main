'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Title, SimpleGrid, Text, Card, Center, Loader, Stack } from '@mantine/core';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

type DashboardStats = {
    totalSales: number;
    activeOrders: number;
    totalProducts: number;
};

export default function AdminDashboard() {
    const router = useRouter();
    const [statsData, setStatsData] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndCalculateStats = async () => {
            const token = localStorage.getItem('user_token');
            if (!token) return router.push('/auth/login');

            try {
                const [orders, products] = await Promise.all([
                    api.orders.getAll(),
                    api.products.getAll()
                ]);

                const ordersArray = orders || [];
                const productsArray = products || [];
                const totalSales = ordersArray.reduce((acc: number, order: any) => acc + (order.total || 0), 0);
                const activeOrders = ordersArray.filter((o: any) => o.status !== 'Delivered').length;
                const totalProducts = productsArray.length;

                setStatsData({
                    totalSales,
                    activeOrders,
                    totalProducts
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAndCalculateStats();
    }, [router]);

    if (loading) return <Center h="100vh"><Loader color="violet" /></Center>;

    const stats = [
        { label: 'Total Sales', value: `$${statsData?.totalSales}`, color: 'green' },
        { label: 'Orders', value: statsData?.activeOrders || 0, color: 'orange' },
        { label: 'Total Products', value: statsData?.totalProducts || 0, color: 'cyan' },
    ];

    return (
        <Box className={layout.container}>
            <Container size="xl">
                <Title order={1} c="white" mb="xl">Admin Dashboard Overview</Title>
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl">
                    {stats.map((stat) => (
                        <Card key={stat.label} className={layout.card}>
                            <Stack gap="xs">
                                <Text size="xs" c="gray.5" fw={700} style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    {stat.label}
                                </Text>
                                <Title order={2} c={stat.color}>
                                    {stat.value}
                                </Title>
                            </Stack>
                        </Card>
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
}