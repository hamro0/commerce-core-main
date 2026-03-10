'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Card, Container, Grid, Text, TextInput, Title, Divider, Center, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import classes from '@/src/app/components/forms/auth/AuthForm.module.css';
import { api } from '@/src/app/lib/api';

type CheckoutFormValues = {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
};

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

type CartData = {
    items: CartItem[];
    total: number;
};

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<CartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const form = useForm({
        initialValues: {
            fullName: '',
            address: '',
            city: '',
            zipCode: '',
        },
    });

    useEffect(() => {
        const prepareCheckout = async () => {
            const token = localStorage.getItem('user_token');

            if (!token) {
                router.push('/auth/login');
                return;
            }
            const data = await api.cart.get();
            setCart(data);
            setLoading(false);
        };

        prepareCheckout();
    }, [router]);

    const handleSubmit = async (values: CheckoutFormValues) => {
        setSubmitting(true);
        await api.orders.create(values);
        router.push('/orders');
        setSubmitting(false);
    };

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
                <Title order={1} c="white" mb="xl">Checkout</Title>

                <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Card className={layout.card}>
                            <Text className={classes.subtitle} ta="left">Shipping Information</Text>

                            <form className={classes.formWrapper} onSubmit={form.onSubmit(handleSubmit)}>
                                <TextInput
                                    label="Full Name"
                                    placeholder="Enter your name"
                                    required
                                    {...form.getInputProps('fullName')}
                                    className={classes.inputField}
                                    disabled={submitting}
                                />

                                <TextInput
                                    label="Address"
                                    placeholder="Street name and number"
                                    required
                                    {...form.getInputProps('address')}
                                    className={classes.inputField}
                                    disabled={submitting}
                                />

                                <Grid>
                                    <Grid.Col span={8}>
                                        <TextInput
                                            label="City"
                                            placeholder="Your city"
                                            required
                                            {...form.getInputProps('city')}
                                            className={classes.inputField}
                                            disabled={submitting}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={4}>
                                        <TextInput
                                            label="ZIP"
                                            placeholder="00000"
                                            required
                                            {...form.getInputProps('zipCode')}
                                            className={classes.inputField}
                                            disabled={submitting}
                                        />
                                    </Grid.Col>
                                </Grid>

                                <Button
                                    type="submit"
                                    className={classes.submitBtn}
                                    mt="xl"
                                    loading={submitting}
                                >
                                    Confirm Shipping
                                </Button>
                            </form>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Card className={layout.card}>
                            <Text fw={700} c="white" mb="md">Order Summary</Text>

                            <Box style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text c="gray.4">Subtotal</Text>
                                    <Text c="white">${cart?.total}</Text>
                                </Box>

                                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text c="gray.4">Shipping</Text>
                                    <Text c="green.4">Free</Text>
                                </Box>

                                <Divider my="sm" color="rgba(255,255,255,0.1)" />

                                <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text fw={700} size="lg" c="white">Total</Text>
                                    <Text fw={700} size="lg" c="violet.3">${cart?.total}</Text>
                                </Box>
                            </Box>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Container>
        </Box>
    );
}