'use client';

import Link from 'next/link';
import { Box, Button, Card, Container, Group, SimpleGrid, Stack, Text, ThemeIcon, Title, Badge, Paper } from '@mantine/core';
import { IconCode, IconShoppingBag } from '@tabler/icons-react';
import layout from '@/src/app/components/layout/StoreLayout.module.css';

export default function StoreHomePage() {
  return (
    <Box className={layout.container}>
      <Container size="xl">
        <Stack gap={100}>
          <Paper className={layout.card} p={{ base: 'xl', md: 80 }} radius={40}>
            <Stack align="center" ta="center" gap="xl">
              <Badge size="lg" variant="filled" color="violet" radius="sm">
                New Version 2026
              </Badge>

              <Title order={1} style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 900, lineHeight: 1.1 }}>
                Experience the{' '}
                <Text span variant="gradient" gradient={{ from: 'violet.3', to: 'cyan.3' }} inherit>
                  Future of Commerce
                </Text>
              </Title>

              <Text maw={640} size="xl" c="gray.4">
                Building premium storefronts shouldn't be hard. Our ecosystem provides
                the speed of light with the beauty of glass.
              </Text>

              <Group mt="lg" gap="md">
                <Button size="lg" radius="xl" px={40} variant="white" c="black" component={Link} href="/products">
                  Start Shopping
                </Button>
                <Button size="lg" radius="xl" px={40} variant="outline" color="gray.4" component={Link} href="/auth/register">
                  Get Started
                </Button>
              </Group>
            </Stack>
          </Paper>

         {/*
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={40}>
            <Card className={layout.card} radius="xl" p="xl">
              <Stack justify="space-between" h="100%">
                <Box>
                  <ThemeIcon size={54} radius="lg" variant="light" color="violet" mb="xl">
                    <IconShoppingBag size={28} />
                  </ThemeIcon>
                  <Title order={3} c="white" mb="sm">Consumer Tech</Title>
                  <Text c="gray.4" size="sm">Explore our curated list of high-end hardware and minimalist workstations.</Text>
                </Box>
                <Button component={Link} href="/products" variant="outline" color="violet.3" radius="md" mt="xl">
                  Browse Inventory
                </Button>
              </Stack>
            </Card>

            <Card className={layout.card} radius="xl" p="xl">
              <Stack justify="space-between" h="100%">
                <Box>
                  <ThemeIcon size={54} radius="lg" variant="light" color="violet" mb="xl">
                    <IconCode size={28} />
                  </ThemeIcon>
                  <Title order={3} c="white" mb="sm">Developer Tools</Title>
                  <Text c="gray.4" size="sm">Power your workflow with the same tools we used to build this store.</Text>
                </Box>
                <Button component={Link} href="/auth/register" variant="outline" color="violet.3" radius="md" mt="xl">
                  Get Started
                </Button>
              </Stack>
            </Card>
          </SimpleGrid>
         */}
        </Stack>
      </Container>
    </Box>
  );
}