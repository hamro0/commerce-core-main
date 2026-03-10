'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, Container, Title, TextInput, NumberInput, Textarea, Button, SimpleGrid, Card, Select, Group, Center, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconChevronLeft, IconDeviceFloppy } from '@tabler/icons-react';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

type EditProductProps = {
    params: Promise<{ id: string }>;
};

export default function EditProductPage({ params }: EditProductProps) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        const fetchProduct = async () => {
            const token = localStorage.getItem('user_token');
            if (!token) return router.push('/auth/login');

            const data = await api.products.getById(id);
            form.setValues(data);
            setLoading(false);
        };
        fetchProduct();
    }, [id, router]);

    const handleSubmit = async (values: typeof form.values) => {
        setSaving(true);
        await api.products.update(id, values);
        router.push('/admin/products');
        setSaving(false);
    };

    if (loading) return <Center h="100vh"><Loader color="violet" /></Center>;

    return (
        <Box className={layout.container}>
            <Container size="sm">
                <Box style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <Box>
                        <Button
                            component={Link}
                            href="/admin/products"
                            variant="subtle"
                            color="gray"
                            leftSection={<IconChevronLeft size={16} />}
                            px={0}
                            mb="sm"
                        >
                            Back to Inventory
                        </Button>
                        <Title order={1} c="white">Edit Product #{id}</Title>
                    </Box>

                    <Card className={layout.card}>
                        <form onSubmit={form.onSubmit(handleSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                                label="Product Description"
                                minRows={5}
                                variant="filled"
                                {...form.getInputProps('description')}
                            />

                            <SimpleGrid cols={2} spacing="md">
                                <NumberInput
                                    label="Price ($)"
                                    decimalScale={2}
                                    variant="filled"
                                    {...form.getInputProps('price')}
                                />
                                <NumberInput
                                    label="Current Stock"
                                    variant="filled"
                                    {...form.getInputProps('stock')}
                                />
                            </SimpleGrid>

                            <Group mt="xl" grow>
                                <Button
                                    type="submit"
                                    size="lg"
                                    radius="md"
                                    variant="gradient"
                                    gradient={{ from: 'violet', to: 'cyan' }}
                                    leftSection={<IconDeviceFloppy size={20} />}
                                    loading={saving}
                                >
                                    Save Changes
                                </Button>
                            </Group>
                        </form>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
}