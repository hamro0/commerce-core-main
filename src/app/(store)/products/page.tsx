'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {Box, SimpleGrid, Title, Text, Card, Image, Button, Group, Container, Center, Loader, Select, TextInput, Stack} from '@mantine/core';
import { IconSearch, IconSortDescending } from '@tabler/icons-react';
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
    const [sortBy, setSortBy] = useState<string | null>('newest');
    const [search, setSearch] = useState('');

    useEffect(() => {
        api.products.getAll()
            .then((data: Product[]) => setProducts(data))
            .finally(() => setLoading(false));
    }, []);

    const filteredAndSorted = useMemo(() => {
        if (!products) return [];
            let list = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        
        return [...list].sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
            return 0;
        });
    }, [products, sortBy, search]);

    if (loading) return <Center h="100vh"><Loader color="violet" type="bars" /></Center>;

    return (
        <Box className={layout.container}>
            <Container size="xl">
                <Stack gap="xl" mb={40}>
                    <Title order={1} c="white">Explore Collection</Title>
                    <Group justify="space-between" align="flex-end">
                        <TextInput
                            placeholder="Search products..."
                            leftSection={<IconSearch size={16} />}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            variant="filled"
                            style={{ flex: 1, maxWidth: 400 }}
                        />
                        <Select
                            placeholder="Sort by"
                            value={sortBy}
                            onChange={setSortBy}
                            leftSection={<IconSortDescending size={16} />}
                            data={[
                                { value: 'newest', label: 'Default' },
                                { value: 'name-asc', label: 'A-Z' },
                                { value: 'price-low', label: 'Price: Low-High' },
                                { value: 'price-high', label: 'Price: High-Low' },
                            ]}
                            variant="filled"
                            w={180}
                        />
                    </Group>
                </Stack>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
                    {filteredAndSorted.map((product) => (
                        <Card key={product.id} className={layout.card} radius="md" p="md">
                            <Card.Section>
                                <Image 
                                    src={product.imageUrl || "/cobra-pro.webp"} 
                                    height={220} 
                                    alt={product.name} 
                                />
                            </Card.Section>
                            <Stack gap="xs" mt="md">
                                <Group justify="space-between">
                                    <Text fw={600} c="white">{product.name}</Text>
                                    <Text c="violet.3" fw={700}>${product.price}</Text>
                                </Group>
                                <Text size="sm" c="gray.5" lineClamp={2}>{product.description}</Text>
                                <Button 
                                    fullWidth 
                                    variant="gradient" 
                                    gradient={{ from: 'violet', to: 'cyan' }} 
                                    component={Link} 
                                    href={`/products/${product.id}`}
                                >
                                    View Details
                                </Button>
                            </Stack>
                        </Card>
                    ))}
                </SimpleGrid>
                {filteredAndSorted.length === 0 && (
                    <Text ta="center" mt={50} c="gray.6">No products match your search.</Text>
                )}
            </Container>
        </Box>
    );
}