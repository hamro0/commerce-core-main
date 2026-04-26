'use client';

import { Group, Text, Button, Divider, Stack } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/app/state-management/cart/cart-items-provider';
import styles from '../cart-section.module.scss';

export const CartSummaryArea = () => {
  const { totalPrice } = useCart();
  const router = useRouter();

  return (
    <Stack gap="md" className={styles.summaryWrapper}>
      <Divider color="rgba(255,255,255,0.05)" />
      
      <Group justify="space-between">
        <Text size="xl" fw={700} c="white">Total</Text>
        <Text size="xl" fw={800} c="cyan.4">
          ${totalPrice.toFixed(2)}
        </Text>
      </Group>

      <Button
        size="lg"
        radius="md"
        variant="gradient"
        gradient={{ from: 'violet.6', to: 'cyan.5' }}
        onClick={() => router.push('/checkout')}
        fullWidth
      >
        Proceed to Checkout
      </Button>
    </Stack>
  );
};