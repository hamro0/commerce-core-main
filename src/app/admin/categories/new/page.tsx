'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Title, TextInput, Button, Card, Stack, Group } from '@mantine/core';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

export default function AddCategoryPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const categories = await api.categories.getAll();
            const nextId = categories && categories.length > 0 
                ? (Math.max(...categories.map((c: any) => parseInt(c.id) || 0)) + 1).toString() 
                : "1";
            await api.categories.create({ id: nextId, name });
            router.push('/admin/categories');
        } catch (error) {
            console.error("Failed to create category:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className={layout.container}>
            <Container size="sm">
                <Title order={2} c="white" mb="xl">Add New Category</Title>
                <Card className={layout.card}>
                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput 
                                label="Category Name" 
                                placeholder="e.g. Laptops" 
                                required 
                                value={name}
                                onChange={(e) => setName(e.target.value)} 
                                variant="filled" 
                            />
                            <Group justify="flex-end" mt="xl">
                                <Button variant="subtle" color="gray" onClick={() => router.back()} disabled={loading}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="gradient" gradient={{ from: 'violet', to: 'cyan' }} loading={loading}>
                                    Create Category
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Card>
            </Container>
        </Box>
    );
}