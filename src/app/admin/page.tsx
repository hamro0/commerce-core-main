'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Title, SimpleGrid, Text, Card, Center, Loader, Stack, Group } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import { IconChartBar, IconTrendingUp } from '@tabler/icons-react';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

type DashboardStats = {
    totalSales: number;
    activeOrders: number;
    totalProducts: number;
    chartData: { date: string; Sales: number }[];
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
                const salesMap: Record<string, number> = {};
                ordersArray.forEach((order: any) => {
                    const date = new Date(order.date).toLocaleDateString('en-US', { weekday: 'short' }); 
                    salesMap[date] = (salesMap[date] || 0) + (order.total || 0);
                });
                const chartData = Object.entries(salesMap).map(([date, amount]) => ({
                    date,
                    Sales: amount
                }));

                setStatsData({ totalSales, activeOrders, totalProducts, chartData });
            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAndCalculateStats();
    }, [router]);

    if (loading) return <Center h="100vh"><Loader color="violet" /></Center>;

    const stats = [
        { label: 'Total Revenue', value: `$${statsData?.totalSales.toFixed(2)}`, color: 'green.4' },
        { label: 'Pending Orders', value: statsData?.activeOrders || 0, color: 'orange.4' },
        { label: 'In Inventory', value: statsData?.totalProducts || 0, color: 'cyan.4' },
    ];

    return (
        <Box className={layout.container}>
            <Container size="xl">
                <Group justify="space-between" mb="xl">
                    <Stack gap={0}>
                        <Title order={1} c="white">Admin Overview</Title>
                        <Text c="gray.5" size="sm">Real-time store performance and analytics</Text>
                    </Stack>
                    <IconTrendingUp size={32} color="var(--mantine-color-violet-5)" />
                </Group>
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mb={40}>
                    {stats.map((stat) => (
                        <Card key={stat.label} className={layout.card} radius="md" withBorder>
                            <Text size="xs" c="gray.5" fw={700} tt="uppercase" lts={1}>{stat.label}</Text>
                            <Title order={2} c={stat.color} mt="sm">{stat.value}</Title>
                        </Card>
                    ))}
                </SimpleGrid>
                <Card className={layout.card} p="xl" radius="lg" withBorder>
                    <Group mb="xl">
                        <IconChartBar color="var(--mantine-color-violet-4)" />
                        <Title order={3} c="white">Weekly Revenue Details</Title>
                    </Group>
                    <LineChart
                        h={325}
                        data={statsData?.chartData || []}
                        dataKey="date"
                        series={[{ name: 'Sales', color: 'violet.5' }]}
                        tickLine="none"
                        gridAxis="xy" 
                        withTooltip
                        valueFormatter={(value) => `$${value}`}
                        curveType="monotone"
                        strokeWidth={3} 
                        dotProps={{ r: 4, strokeWidth: 2, fill: '#1A1B1E' }} 
                        activeDotProps={{ r: 6, strokeWidth: 0 }}
                    />
                </Card>
            </Container>
        </Box>
    );
}