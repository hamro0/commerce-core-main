'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ActionIcon, Anchor, Box, Button, Container, Group, Text, rem, Indicator, Menu, Divider } from '@mantine/core';
import { IconShoppingCart, IconUser, IconLogout, IconSettings, IconLayoutDashboard, IconPackage, IconCategory,IconChevronDown, Icon3dCubeSphere } from '@tabler/icons-react';
import classes from './css/StoreHeader.module.css';
import { api } from '@/src/app/lib/api';

type User = { id: string; fullName: string; role: string; avatar?: string };

export default function StoreHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [cartCount, setCartCount] = useState(0);

    const refreshCartCount = useCallback(async () => {
        try {
            const data = await api.cart.get();
            setCartCount(data?.items?.length || 0);
        } catch (error) {
            setCartCount(0);
        }
    }, []);

    useEffect(() => {
        const savedUserData = localStorage.getItem('user_data');
        if (savedUserData) {
            const parsedUser = JSON.parse(savedUserData);
            setUser(parsedUser);
            if (parsedUser.role === 'user') refreshCartCount();
        } else {
            setUser(null);
            setCartCount(0);
        }
    }, [pathname, refreshCartCount]);

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        setCartCount(0);
        router.push('/');
        router.refresh();
    };

    const NavLinks = () => (
        <Group gap="lg" visibleFrom="sm">
            <Anchor component={Link} href="/" size="sm" c="gray.3" underline="never">Store</Anchor>
            <Anchor component={Link} href="/products" size="sm" c="gray.3" underline="never">Products</Anchor>
            {user?.role === 'user' && <Anchor component={Link} href="/orders" size="sm" c="gray.3" underline="never">My Orders</Anchor>}
            {user?.role === 'admin' && <Anchor component={Link} href="/admin/orders" size="sm" c="gray.3" underline="never">Manage Orders</Anchor>}
        </Group>
    );

    const UserDropdown = () => (
        <Menu shadow="md" width={220} position="bottom-end" transitionProps={{ transition: 'pop-top-right' }}>
            <Menu.Target>
                <Button variant="subtle" color="gray.3" leftSection={<IconUser size={18} />} rightSection={<IconChevronDown size={14} />}>
                    {user?.fullName.split(' ')[0]}
                </Button>
            </Menu.Target>
            <Menu.Dropdown style={{ backgroundColor: 'rgba(26, 27, 30, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Menu.Label c="gray.5">Settings</Menu.Label>
                <Menu.Item component={Link} href="/account" leftSection={<IconSettings size={16} />} c="white">Profile Settings</Menu.Item>
                {user?.role === 'admin' && (
                    <>
                        <Divider my="xs" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                        <Menu.Label c="gray.5">Administration</Menu.Label>
                        <Menu.Item component={Link} href="/admin" leftSection={<IconLayoutDashboard size={16} />} c="white">Dashboard</Menu.Item>
                        <Menu.Item component={Link} href="/admin/products" leftSection={<IconPackage size={16} />} c="white">Products</Menu.Item>
                        <Menu.Item component={Link} href="/admin/categories" leftSection={<IconCategory size={16} />} c="white">Categories</Menu.Item>
                    </>
                )}
                <Divider my="xs" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                <Menu.Item color="red.5" leftSection={<IconLogout size={16} />} onClick={handleLogout} fw={600}>Log out</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );

    return (
        <Box component="header" className={classes.header}>
            <Container size="xl" py="md">
                <Group justify="space-between">
                    <Group gap="sm">
                        <ActionIcon variant="light" radius="xl" size="lg" className={classes.logoIcon} component={Link} href="/">
                            <Icon3dCubeSphere style={{ width: rem(18), height: rem(18) }} />
                        </ActionIcon>
                        <Text fw={700} size="lg" c="white" component={Link} href="/" style={{ textDecoration: 'none' }}>MyStore</Text>
                    </Group>
                    <NavLinks />
                    <Group gap="md">
                        {user?.role === 'user' && (
                            <Indicator label={cartCount} size={18} color="violet" offset={2} withBorder disabled={cartCount === 0}>
                                <ActionIcon component={Link} href="/cart" variant="subtle" c="gray.3" radius="xl" size="lg">
                                    <IconShoppingCart style={{ width: rem(22), height: rem(22) }} />
                                </ActionIcon>
                            </Indicator>
                        )}
                        {user ? <UserDropdown /> : (
                            <Group gap="xs">
                                <Button component={Link} href="/auth/login" variant="subtle" color="gray.3">Log in</Button>
                                <Button component={Link} href="/products" radius="md" variant="gradient" gradient={{ from: 'violet.6', to: 'cyan.5' }}>Explore</Button>
                            </Group>
                        )}
                    </Group>
                </Group>
            </Container>
        </Box>
    );
}