'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Container, Title, TextInput, NumberInput, Textarea, Button, SimpleGrid, Card, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

export default function NewProductPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const form = useForm({
        initialValues: {
            name: '',
            category: '',
            description: '',
            price: 0,
            stock: 0,
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setSaving(true);
        await api.products.create(values);
        router.push('/admin/products');
        setSaving(false);
    };

    return (
        <Box className={layout.container}>
            <Container size="sm">
                <Box style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <Box>
                        <Button component={Link} href="/admin/products" variant="subtle" color="gray" size="xs" mb="sm">
                            ← Back to Inventory
                        </Button>
                        <Title order={1} c="white">Create New Product</Title>
                    </Box>

                    <Card className={layout.card}>
                        <form onSubmit={form.onSubmit(handleSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <TextInput
                                label="Product Name"
                                variant="filled"
                                required
                                {...form.getInputProps('name')}
                            />

                            <Select
                                label="Category"
                                data={['Tech', 'Accessories', 'Software']}
                                variant="filled"
                                {...form.getInputProps('category')}
                            />

                            <Textarea
                                label="Description"
                                minRows={4}
                                variant="filled"
                                {...form.getInputProps('description')}
                            />

                            <SimpleGrid cols={2}>
                                <NumberInput
                                    label="Price"
                                    prefix="$"
                                    decimalScale={2}
                                    variant="filled"
                                    {...form.getInputProps('price')}
                                />
                                <NumberInput
                                    label="Initial Stock"
                                    variant="filled"
                                    {...form.getInputProps('stock')}
                                />
                            </SimpleGrid>

                            <Box style={{ marginTop: '20px' }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    size="lg"
                                    radius="md"
                                    variant="gradient"
                                    gradient={{ from: 'violet', to: 'cyan' }}
                                    loading={saving}
                                >
                                    Publish Product
                                </Button>
                            </Box>
                        </form>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
}