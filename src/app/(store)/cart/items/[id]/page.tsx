'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Card, Title, Text, Stack, Group, ActionIcon, Button, Center, Loader, Divider } from '@mantine/core';
import { IconArrowLeft, IconTrash, IconPlus, IconMinus } from '@tabler/icons-react';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

type PageProps = { params: Promise<{ id: string }> };

export default function CartItemDetailPage({ params }: PageProps) {
    const router = useRouter();
    const { id } = use(params);
    const [item, setItem] = useState<any>(null);
    const [fullCart, setFullCart] = useState<any>(null); 
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        api.cart.get()
            .then((data) => {
                setFullCart(data); 
                const cartArray = data?.items || [];
                const found = cartArray.find((i: any) => String(i.id) === String(id));
                setItem(found || null);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const handleUpdate = async (newQty: number) => {
        if (newQty < 1 || !fullCart) return;
        setUpdating(true);
        try {
            const updatedItems = fullCart.items.map((i: any) => 
                String(i.id) === String(id) ? { ...i, quantity: newQty } : i
            );
            const newTotal = updatedItems.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0);
            const updatedCartObj = { items: updatedItems, total: newTotal };
            await api.cart.sync(updatedCartObj);
            setItem({ ...item, quantity: newQty });
            setFullCart(updatedCartObj);
        } catch (error) {
            console.error("Error updating cart:", error);
        } finally {
            setUpdating(false);
        }
    };

    const handleRemove = async () => {
        if (!fullCart) return;
        setUpdating(true);
        try {
            const remainingItems = fullCart.items.filter((i: any) => String(i.id) !== String(id));
            const newTotal = remainingItems.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0);
            await api.cart.sync({ items: remainingItems, total: newTotal });
            router.push('/cart'); 
        } catch (error) {
            console.error("Error removing item:", error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <Center h="100vh"><Loader color="violet" type="bars" /></Center>;
    if (!item) return <Center h="100vh"><Text c="white">Item not found in cart</Text></Center>;

    return (
        <Box className={layout.container} py={60}>
            <Card maw={450} mx="auto" className={layout.glassCard} p={40} radius="24px">
                <Button 
                    variant="transparent" 
                    color="gray" 
                    leftSection={<IconArrowLeft size={18} />} 
                    onClick={() => router.back()}
                    mb="xl"
                    p={0}
                >
                    Back to Cart
                </Button>
                <Stack align="center" ta="center" gap="xs">
                    <Title order={2} c="white">{item.name || 'Unknown Product'}</Title>
                    <Text fz="h1" fw={900} c="violet.4">${item.price}</Text>
                    <Text c="gray.5">Unit Price</Text>
                </Stack>
                <Divider my={30} color="rgba(255,255,255,0.05)" />
                <Stack gap="md">
                    <Text fw={600} c="white" ta="center">Adjust Quantity</Text>
                    <Group justify="center" gap="xl">
                        <ActionIcon size="xl" radius="md" variant="light" color="gray" onClick={() => handleUpdate(item.quantity - 1)} disabled={updating || item.quantity <= 1}>
                            <IconMinus size={20} />
                        </ActionIcon>
                        <Text fz="xl" fw={800} c="white" w={40} ta="center">{item.quantity}</Text>
                        <ActionIcon size="xl" radius="md" variant="light" color="gray" onClick={() => handleUpdate(item.quantity + 1)} disabled={updating || item.quantity >= (item.stock || 99)}>
                            <IconPlus size={20} />
                        </ActionIcon>
                    </Group>
                    <Button 
                        mt="xl"
                        fullWidth 
                        size="lg" 
                        color="red.8" 
                        variant="light" 
                        leftSection={<IconTrash size={20} />}
                        onClick={handleRemove}
                        loading={updating}
                    >
                        Remove from Cart
                    </Button>
                </Stack>
            </Card>
        </Box>
    );
}