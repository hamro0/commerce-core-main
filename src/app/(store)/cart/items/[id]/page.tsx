'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Card, Title, Text, Stack, Group, ActionIcon, Button, Center, Loader, Divider } from '@mantine/core';
import { IconArrowLeft, IconTrash, IconPlus, IconMinus } from '@tabler/icons-react';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { useCart } from '@/src/app/state-management/cart/cart-items-provider'; 
import { ICartItemDTO } from '@/src/app/models/cart';

type PageProps = { params: Promise<{ id: string }> };

export default function CartItemDetailPage({ params }: PageProps) {
    const router = useRouter();
    const { id } = use(params);
    const { cartItems, loading, updateQuantity, removeFromCart } = useCart();
    const [updating, setUpdating] = useState(false);
    const item: ICartItemDTO | null = cartItems.find((i) => String(i.id) === String(id)) || null;

    const handleUpdate = async (newQty: number) => {
        if (newQty < 1 || !item) return;
        setUpdating(true);
        try {
            await updateQuantity(String(id), newQty);
        } catch (error) {
            console.error("Error updating cart:", error);
        } finally {
            setUpdating(false);
        }
    };

    const handleRemove = async () => {
        if (!item) return;
        setUpdating(true);
        try {
            await removeFromCart(String(id));
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
                        <ActionIcon size="xl" radius="md" variant="light" color="gray" onClick={() => handleUpdate(item.quantity + 1)} disabled={updating || item.quantity >= (item.stockQuantity || 99)}>
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