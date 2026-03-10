'use client';

import { use, useEffect, useState, cache } from 'react';
import { Box, Grid, Image, Title, Text, Button, Badge, Group, Stack, Card, Center, Loader } from '@mantine/core';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

type ProductDetail = {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl?: string;
    stock: number;
};

type PageProps = {
    params: Promise<{ id: string }>;
};

export default function ProductDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id || id === 'undefined') return;
            
            const data = await api.products.getById(id);
            setProduct(data);
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <Center h="100vh">
                <Loader color="violet" size="xl" type="bars" />
            </Center>
        );
    }

    if (!product) {
        return (
            <Center h="100vh">
                <Text c="white">Product not found</Text>
            </Center>
        );
    }

    return (
        <Box className={layout.container}>
            <Card className={`${layout.shell} ${layout.card}`}>
                <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Image
                            radius="md"
                            src={product.imageUrl || "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"}
                            alt={product.name}
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Stack gap="md">
                            <Badge variant="outline" color={product.stock > 0 ? "violet" : "red"}>
                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                            <Title order={1} c="white">{product.name}</Title>
                            <Text size="xl" fw={700} c="violet.3">${product.price?.toFixed(2) || '0.00'}</Text>
                            <Text c="gray.4">
                                {product.description}
                            </Text>
                            
                            <Group mt="xl">
                                <Button size="md" variant="gradient" gradient={{ from: 'violet', to: 'cyan' }} flex={1}>
                                    Add to Cart
                                </Button>
                                <Button size="md" variant="default">Wishlist</Button>
                            </Group>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Card>
        </Box>
    );
}