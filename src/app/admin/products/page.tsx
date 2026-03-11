'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Container, Title, Button, Group, Table, Card, Center, Loader, ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

type Product = {
    id: string;
    name: string;
    price: number;
    stock: number;
};

export default function AdminProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('user_token');
            if (!token) return router.push('/auth/login');

            const data = await api.products.getAll();
            setProducts(data);
            setLoading(false);
        };
        fetchProducts();
    }, [router]);

    const handleDelete = async (id: string) => {
        await api.products.delete(id);
        setProducts(products.filter(p => p.id !== id));
    };

    if (loading) return <Center h="100vh"><Loader color="violet" /></Center>;

    return (
        <Box className={layout.container}>
            <Container size="xl">
                <Group justify="space-between" mb="xl">
                    <Title order={1} c="white">Products</Title>
                    <Button component={Link} href="/admin/products/new" variant="gradient" gradient={{ from: 'violet', to: 'cyan' }}>
                        Add New Product
                    </Button>
                </Group>
                <Card className={layout.card} p={0} style={{ overflowX: 'auto' }}>
                    <Table verticalSpacing="md" variant="unstyled" c="white">
                        <Table.Thead style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <Table.Tr>
                                <Table.Th>Product Name</Table.Th>
                                <Table.Th>Price</Table.Th>
                                <Table.Th>Stock</Table.Th>
                                <Table.Th ta="right">Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {products.map((product) => (
                                <Table.Tr key={product.id}>
                                    <Table.Td>{product.name}</Table.Td>
                                    <Table.Td>${product.price?.toFixed(2)}</Table.Td>
                                    <Table.Td>{product.stock} in stock</Table.Td>
                                    <Table.Td ta="right">
                                        <Group justify="flex-end" gap="sm">
                                            <Button variant="subtle" size="xs" component={Link} href={`/admin/products/${product.id}/edit`}>Edit</Button>
                                            <ActionIcon color="red" variant="subtle" onClick={() => handleDelete(product.id)}>
                                                <IconTrash size={16} />
                                            </ActionIcon>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Card>
            </Container>
        </Box>
    );
}