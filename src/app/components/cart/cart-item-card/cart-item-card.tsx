'use client';

import { Card, Image, Text, Group, Button, Stack, ActionIcon, NumberInput } from '@mantine/core';
import { IconTrash, IconPlus, IconMinus } from '@tabler/icons-react';
import { ICartItemDTO } from '@/src/app/models/cart';
import { useCart } from '@/src/app/state-management/cart/cart-items-provider';
import styles from './cart-item-card.module.scss';

interface IProps {
  item: ICartItemDTO;
}

export const CartItemCard = ({ item }: IProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrement = () => updateQuantity(item.id, item.quantity + 1);
  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  return (
    <Card className={styles.cartCard} radius="md" p="md">
      <Group justify="space-between" align="center" wrap="nowrap">
        <Group gap="md">
          <Image
            src={item.imageUrl || "/cobra-pro.webp"}
            width={80}
            height={80}
            alt={item.name}
            className={styles.itemImage}
            radius="md"
          />
          <Stack gap={2}>
            <Text className={styles.itemName} fw={600}>{item.name}</Text>
            <Text className={styles.itemPrice} size="sm" c="dimmed">
              ${item.price.toFixed(2)} / unit
            </Text>
          </Stack>
        </Group>
        <Group gap="xl">
          <Group gap="xs" className={styles.quantityControls}>
            <ActionIcon 
              variant="light" 
              color="violet" 
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
            >
              <IconMinus size={16} />
            </ActionIcon>
            
            <Text fw={700} w={30} ta="center">{item.quantity}</Text>
            
            <ActionIcon 
              variant="light" 
              color="violet" 
              onClick={handleIncrement}
            >
              <IconPlus size={16} />
            </ActionIcon>
          </Group>

          <Stack gap={0} align="flex-end" w={100}>
            <Text fw={800} size="lg" c="cyan.4">
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
            <ActionIcon 
              variant="subtle" 
              color="red" 
              onClick={() => removeFromCart(item.id)}
              mt="xs"
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Stack>
        </Group>
      </Group>
    </Card>
  );
};