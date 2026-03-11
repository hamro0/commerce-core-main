'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Title, TextInput, Button, Card, Stack, Group, Center, Loader } from '@mantine/core';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [name, setName] = useState('');
    const [isFetching, setIsFetching] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchCategory = async () => {
            const data = await api.categories.getById(id);
            if (data) setName(data.name);
            setIsFetching(false);
        };
        fetchCategory();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await api.categories.update(id, { name });
        router.push('/admin/categories');
    };

    if (isFetching) return <Center h="100vh"><Loader color="violet" /></Center>;

    return (
        <Box className={layout.container}>
            <Container size="sm">
                <Title order={2} c="white" mb="xl">Edit Category</Title>
                <Card className={layout.card}>
                    <form onSubmit={handleSubmit}>
                        <Stack gap="md">
                            <TextInput 
                                label="Category Name" 
                                required 
                                value={name}
                                onChange={(e) => setName(e.target.value)} 
                                variant="filled" 
                            />
                            <Group justify="flex-end" mt="xl">
                                <Button variant="subtle" color="gray" onClick={() => router.back()} disabled={isSaving}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="gradient" gradient={{ from: 'violet', to: 'cyan' }} loading={isSaving}>
                                    Save Changes
                                </Button>
                            </Group>
                        </Stack>
                    </form>
                </Card>
            </Container>
        </Box>
    );
}