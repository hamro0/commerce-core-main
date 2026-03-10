'use client';

import Link from 'next/link';
import { Box, Title, Text, Button, Container, Stack, rem, Group } from '@mantine/core';
import { IconHome, IconGhost } from '@tabler/icons-react';
import layout from '@/src/app/components/layout/StoreLayout.module.css';

export default function NotFound() {
  return (
    <Box className={layout.container} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container size="sm">
        <Stack align="center" gap="xl">
          <Box style={{ 
            background: 'rgba(121, 80, 242, 0.1)', 
            padding: rem(30), 
            borderRadius: '100%', 
            border: '1px solid rgba(121, 80, 242, 0.2)' 
          }}>
            <IconGhost size={80} color="var(--mantine-color-violet-4)" stroke={1.5} />
          </Box>

          <Box style={{ textAlign: 'center' }}>
            <Title order={1} c="white" size={rem(60)} fw={900} mb="xs">
              404
            </Title>
            <Title order={2} c="gray.2" mb="md">
              Oops! Page Not Found
            </Title>
            <Text c="gray.5" size="lg" maw={500} mx="auto">
              The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </Text>
          </Box>

          <Group justify="center" mt="xl">
            <Button 
              component={Link} 
              href="/" 
              size="lg" 
              variant="gradient" 
              gradient={{ from: 'violet', to: 'cyan' }}
              leftSection={<IconHome size={20} />}
              radius="md"
            >
              Back to Home
            </Button>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}