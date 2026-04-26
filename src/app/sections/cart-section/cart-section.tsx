'use client';

import React, { useMemo, Profiler, ProfilerOnRenderCallback } from 'react';
import { Box, Title, Stack, Container } from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';
import { CartProvider } from '@/src/app/state-management/cart/cart-items-provider';
import { CartItemsArea } from './areas/cart-item-area';
import { CartSummaryArea } from './areas/cart-summary-area';
import styles from './cart-section.module.scss';

const onRenderCallback: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration) => {
  console.log(`%c[Performance] ${id}`, 'color: #9b59b6; font-weight: bold', {
    phase,
    actualDuration: `${actualDuration.toFixed(2)}ms`,
    baseDuration: `${baseDuration.toFixed(2)}ms`
  });
};

const CartInnerContent = () => {
  return (
    <CartProvider>
      <Profiler id="CartProvider_Content" onRender={onRenderCallback}>
        <Stack gap="xl">
          <Profiler id="ItemsArea" onRender={onRenderCallback}>
            <CartItemsArea />
          </Profiler>
          
          <Profiler id="SummaryArea" onRender={onRenderCallback}>
            <CartSummaryArea />
          </Profiler>
        </Stack>
      </Profiler>
    </CartProvider>
  );
};

export const CartManagementSection = () => {
  const memoizedSection = useMemo(() => (
    <Box className={styles.sectionWrapper}>
      <Container size="sm">
        <Title order={2} className={styles.sectionTitle} mb="xl">
          <IconShoppingCart size={28} />
          Cart Management
        </Title>
        <CartInnerContent />
      </Container>
    </Box>
  ), []); 

  return (
    <Profiler id="Total_CartSection_Root" onRender={onRenderCallback}>
      {memoizedSection}
    </Profiler>
  );
};

export default CartManagementSection;