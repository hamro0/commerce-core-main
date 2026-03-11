'use client';

import { useEffect, useState } from 'react';
import { Box, Container, Title, Table, Button, Group, ActionIcon, Card, Loader, Center } from '@mantine/core';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

type Category = {
    id: string;
    name: string;
};

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        const data = await api.categories.getAll();
        setCategories(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            await api.categories.delete(id);
            fetchCategories();
        }
    };

    if (loading) return <Center h="100vh"><Loader color="violet" /></Center>;

    return (
        <Box className={layout.container}>
            <Container size="md">
                <Group justify="space-between" mb="xl">
                    <Title order={1} c="white">Categories</Title>
                    <Button component={Link} href="/admin/categories/new" leftSection={<IconPlus size={18} />} variant="gradient" gradient={{ from: 'violet', to: 'cyan' }}>
                        Add Category
                    </Button>
                </Group>
                <Card className={layout.card} p={0} style={{ overflowX: 'auto' }}>
                    <Table verticalSpacing="md" variant="unstyled" c="white">
                        <Table.Thead style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <Table.Tr>
                                <Table.Th>ID</Table.Th>
                                <Table.Th>Category Name</Table.Th>
                                <Table.Th ta="right">Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {categories.map((category) => (
                                <Table.Tr key={category.id}>
                                    <Table.Td c="gray.5">{category.id}</Table.Td>
                                    <Table.Td fw={500}>{category.name}</Table.Td>
                                    <Table.Td>
                                        <Group justify="flex-end" gap="xs">
                                            <ActionIcon variant="subtle" color="blue" component={Link} href={`/admin/categories/edit/${category.id}`}>
                                                <IconEdit size={18} />
                                            </ActionIcon>
                                            <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(category.id)}>
                                                <IconTrash size={18} />
                                            </ActionIcon>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                            {!categories.length && (
                                <Table.Tr>
                                    <Table.Td colSpan={3} ta="center" py="xl" c="gray.5">No categories found.</Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </Card>
            </Container>
        </Box>
    );
}