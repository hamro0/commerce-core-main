'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Card, Container, Grid, Text, TextInput, Title, Divider, Center, Loader, Stack, Group, Radio } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

type CheckoutFormValues = {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    paymentMethod: string;
};

type CartItem = { id: string; name: string; price: number; quantity: number; };
type CartData = { items: CartItem[]; total: number; };

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
            paymentMethod: 'cash' 
        },
    });

    useEffect(() => {
        const prepareCheckout = async () => {
            const token = localStorage.getItem('user_token');
            if (!token) return router.push('/auth/login');

            try {
                const data = await api.cart.get();
                const cartItems = Array.isArray(data) ? data : (data?.items || []);
                const cartTotal = data?.total || cartItems.reduce((acc: number, i: any) => acc + (i.price * i.quantity), 0);

                if (!cartItems.length) {
                    router.push('/cart'); 
                    return;
                }
                setCart({ items: cartItems, total: cartTotal });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        prepareCheckout();
    }, [router]);

    const handleSubmit = async (values: CheckoutFormValues) => {
        setSubmitting(true);
        try {
            const newOrder = {
                ...values,
                items: cart?.items,
                total: cart?.total,
                date: new Date().toISOString(),
                status: 'Processing',
                userId: localStorage.getItem('user_token') 
            };
            await api.orders.create(newOrder);
            await api.cart.sync({ items: [], total: 0 }); 

            notifications.show({
                title: 'Order Placed!',
                message: 'Your order has been submitted successfully.',
                color: 'teal',
            });
            router.push('/orders');

        } catch (error) {
            console.error("Checkout failed:", error);
            notifications.show({
                title: 'Error',
                message: 'Failed to place the order. Please try again.',
                color: 'red',
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Center h="100vh"><Loader color="violet" size="xl" type="bars" /></Center>;

    return (
        <Box className={layout.container} py={60}>
            <Container size="xl">
                <Title order={1} c="white" mb="xl">Secure Checkout</Title>

                <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
                        <Card className={layout.glassCard} radius="xl" p={30}>
                            <Title order={3} c="white" mb="lg">Shipping & Payment</Title>

                            <form onSubmit={form.onSubmit(handleSubmit)}>
                                <Stack gap="lg">
                                    <Stack gap="md">
                                        <TextInput
                                            label={<Text c="gray.4" size="sm" mb={5}>Full Name</Text>}
                                            placeholder="Enter your name"
                                            required
                                            {...form.getInputProps('fullName')}
                                            disabled={submitting}
                                            styles={{ input: { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', height: '48px' } }}
                                        />

                                        <TextInput
                                            label={<Text c="gray.4" size="sm" mb={5}>Address</Text>}
                                            placeholder="Street name and number"
                                            required
                                            {...form.getInputProps('address')}
                                            disabled={submitting}
                                            styles={{ input: { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', height: '48px' } }}
                                        />

                                        <Grid>
                                            <Grid.Col span={8}>
                                                <TextInput
                                                    label={<Text c="gray.4" size="sm" mb={5}>City</Text>}
                                                    placeholder="Your city"
                                                    required
                                                    {...form.getInputProps('city')}
                                                    disabled={submitting}
                                                    styles={{ input: { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', height: '48px' } }}
                                                />
                                            </Grid.Col>
                                            <Grid.Col span={4}>
                                                <TextInput
                                                    label={<Text c="gray.4" size="sm" mb={5}>ZIP</Text>}
                                                    placeholder="00000"
                                                    required
                                                    {...form.getInputProps('zipCode')}
                                                    disabled={submitting}
                                                    styles={{ input: { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', height: '48px' } }}
                                                />
                                            </Grid.Col>
                                        </Grid>
                                    </Stack>
                                    <Divider color="rgba(255,255,255,0.05)" />
                                    <Radio.Group
                                        label={<Text c="gray.4" size="sm" mb={5}>Payment Method</Text>}
                                        required
                                        {...form.getInputProps('paymentMethod')}
                                    >
                                        <Group mt="xs" gap="xl">
                                            <Radio 
                                                value="cash" 
                                                label={<Text c="white" fw={500}>Cash on Delivery</Text>} 
                                                color="violet"
                                                styles={{ radio: { borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'transparent' } }} 
                                            />
                                            <Radio 
                                                value="visa" 
                                                label={<Text c="white" fw={500}>Credit Card (Visa/MC)</Text>} 
                                                color="violet" 
                                                styles={{ radio: { borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'transparent' } }} 
                                            />
                                        </Group>
                                    </Radio.Group>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        radius="md"
                                        variant="gradient"
                                        gradient={{ from: 'violet.6', to: 'cyan.5' }}
                                        mt="md"
                                        loading={submitting}
                                    >
                                        Confirm & Place Order
                                    </Button>
                                </Stack>
                            </form>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 5, lg: 4 }}>
                        <Card className={layout.glassCard} radius="xl" p={30}>
                            <Title order={3} c="white" mb="lg">Order Summary</Title>
                            <Stack gap="xs" mb="lg">
                                {cart?.items?.map((item, index) => (
                                    <Group key={index} justify="space-between" wrap="nowrap" align="flex-start">
                                        <Box style={{ flex: 1 }}>
                                            <Text size="sm" c="white" fw={600} lineClamp={2}>{item.name}</Text>
                                            <Text size="xs" c="gray.5">Qty: {item.quantity}</Text>
                                        </Box>
                                        <Text size="sm" fw={700} c="violet.3">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </Text>
                                    </Group>
                                ))}
                            </Stack>
                            <Divider mb="sm" color="rgba(255,255,255,0.05)" />
                            <Stack gap="sm">
                                <Group justify="space-between">
                                    <Text c="gray.4">Subtotal</Text>
                                    <Text c="white" fw={600}>${cart?.total?.toFixed(2)}</Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text c="gray.4">Shipping</Text>
                                    <Text c="cyan.4" fw={600}>Free</Text>
                                </Group>
                                <Divider my="xs" color="rgba(255,255,255,0.05)" />
                                <Group justify="space-between">
                                    <Text fw={800} size="xl" c="white">Total</Text>
                                    <Text fw={800} size="xl" c="violet.4">${cart?.total?.toFixed(2)}</Text>
                                </Group>
                            </Stack>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Container>
        </Box>
    );
}