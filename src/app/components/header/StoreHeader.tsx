'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ActionIcon, Anchor, Box, Button, Container, Group, Text, rem, Indicator, Menu } from '@mantine/core';
import { 
  IconSparkles, 
  IconShoppingCart, 
  IconUser, 
  IconLogout, 
  IconSettings, 
  IconLayoutDashboard, 
  IconPackage, 
  IconCategory 
} from '@tabler/icons-react';

import classes from './css/StoreHeader.module.css';

export default function StoreHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user_data');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    setUser(null);
    router.push('/');
  };

  return (
    <Box component="header" className={classes.header}>
      <Container size="xl" py="md">
        <Group justify="space-between">
          <Group gap="sm">
            <ActionIcon variant="light" radius="xl" size="lg" className={classes.logoIcon}>
              <IconSparkles style={{ width: rem(18), height: rem(18) }} />
            </ActionIcon>
            <Text fw={700} size="lg" c="white" component={Link} href="/" style={{ textDecoration: 'none' }}>
              MyStore
            </Text>
          </Group>

          <Group gap="lg" visibleFrom="sm">
            <Anchor component={Link} href="/" size="sm" c="gray.3" underline="never">Store</Anchor>
            <Anchor component={Link} href="/products" size="sm" c="gray.3" underline="never">Products</Anchor>
            
            {user?.role === 'user' && (
              <Anchor component={Link} href="/orders" size="sm" c="gray.3" underline="never">My Orders</Anchor>
            )}
          </Group>

          <Group gap="md">
            {user?.role === 'user' && (
              <Indicator label="2" size={16} color="violet" offset={2} withBorder>
                <ActionIcon component={Link} href="/cart" variant="subtle" c="gray.3" radius="xl" size="lg">
                  <IconShoppingCart style={{ width: rem(22), height: rem(22) }} />
                </ActionIcon>
              </Indicator>
            )}

            {user ? (
              <Menu shadow="md" width={220} position="bottom-end">
                <Menu.Target>
                  <Button variant="subtle" color="gray" leftSection={<IconUser size={16} />}>
                    {user.fullName || 'Account'}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Manage Account</Menu.Label>
                  <Menu.Item component={Link} href="/account" leftSection={<IconSettings size={14} />}>Profile Settings</Menu.Item>
                  {user.role === 'admin' && (
                    <>
                      <Menu.Divider />
                      <Menu.Label>Administration</Menu.Label>
                      <Menu.Item component={Link} href="/admin" leftSection={<IconLayoutDashboard size={14} />}>Admin Dashboard</Menu.Item>
                      <Menu.Item component={Link} href="/admin/products" leftSection={<IconPackage size={14} />}>Manage Products</Menu.Item>
                      <Menu.Item component={Link} href="/admin/categories" leftSection={<IconCategory size={14} />}>Manage Categories</Menu.Item>
                    </>
                  )}
                  <Menu.Divider />
                  <Menu.Item color="red" leftSection={<IconLogout size={14} />} onClick={handleLogout}>Log out</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Group gap="xs">
                <Button component={Link} href="/auth/login" variant="subtle" color="gray">Log in</Button>
                <Button component={Link} href="/products" radius="md" className={classes.exploreBtn}>Explore</Button>
              </Group>
            )}
          </Group>
        </Group>
      </Container>
    </Box>
  );
}