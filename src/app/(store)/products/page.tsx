'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, SimpleGrid, Title, Text, Card, Image, Button, Group, Container, Center, Loader } from '@mantine/core';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

type Product = {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl?: string;
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await api.products.getAll();
            setProducts(data);
            setLoading(false);
        };

        fetchProducts();
    }, []);

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
                <Title order={1} c="white" mb="xl">Featured Products</Title>

                {products && products.length > 0 ? (
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
                        {products.map((product) => (
                            <Card key={product.id} className={layout.card}>
                                <Card.Section>
                                    <Image
                                        src={product.imageUrl || "/cobra-pro.webp"}
                                        height={200}
                                        alt={product.name}
                                    />
                                </Card.Section>

                                <Group justify="space-between" mt="md" mb="xs">
                                    <Text fw={500} c="white">{product.name}</Text>
                                    <Text c="violet.3" fw={700}>${product.price?.toFixed(2)}</Text>
                                </Group>

                                <Text size="sm" c="gray.5" mb="md" lineClamp={2}>
                                    {product.description}
                                </Text>

                                <Button
                                    fullWidth
                                    variant="gradient"
                                    gradient={{ from: 'violet', to: 'cyan' }}
                                    component={Link}
                                    href={`/products/${product.id}`}
                                >
                                    View Details
                                </Button>
                            </Card>
                        ))}
                    </SimpleGrid>
                ) : (
                    <Text c="gray.5" ta="center" py="xl" size="lg">
                        No products found at the moment.
                    </Text>
                )}
            </Container>
        </Box>
    );
}