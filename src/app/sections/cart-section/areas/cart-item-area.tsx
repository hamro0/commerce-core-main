'use client';

import { Stack } from '@mantine/core';
import { useCart } from '@/src/app/state-management/cart/cart-items-provider';
import { CartItemCard } from '@/src/app/components/cart/cart-item-card/cart-item-card';

export const CartItemsArea = () => {
  const { cartItems } = useCart();

  return (
    <Stack gap="md">
      {cartItems.map((item) => (
        <CartItemCard key={item.id} item={item} />
      ))}
    </Stack>
  );
};