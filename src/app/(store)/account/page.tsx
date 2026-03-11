'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Card, Title, Text, Avatar, Button, Center, Loader, Stack } from '@mantine/core';
import { IconSettings, IconPackage, IconLogout, IconLayoutDashboard } from '@tabler/icons-react';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

type User = { id: string; fullName: string; email: string; role: string; avatar?: string | null };

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('user_token');
        const userData = localStorage.getItem('user_data');

        if (!token || !userData) return router.push('/auth/login');

        api.auth.getProfile(JSON.parse(userData).id)
            .then(setUser)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [router]);

    const handleLogout = () => {
        ['user_token', 'user_data'].forEach(k => localStorage.removeItem(k));
        router.push('/');
        router.refresh();
    };

    if (loading) return <Center h="100vh"><Loader color="violet" size="xl" type="bars" /></Center>;
    const isAdmin = user?.role === 'admin';
    
    return (
        <Box className={layout.container}>
            <Card maw={420} radius="24px" p={40} className={layout.glassCard}>
                <Stack align="center" gap="xs" mb={40}>
                    <Box pos="relative">
                        <Box className={layout.avatarGlow} />
                        <Avatar 
                            size={110} 
                            radius="100%" 
                            src={user?.avatar} 
                            color="violet" 
                            style={{ zIndex: 1, border: '2px solid rgba(255,255,255,0.1)' }} 
                        />
                    </Box>
                    <Box ta="center" mt="md">
                        <Title order={2} c="white" fw={800} fz={26} lts={-0.8}>{user?.fullName}</Title>
                        <Text c="gray.6" size="sm" fw={500}>{user?.email}</Text>
                    </Box>
                </Stack>
                <Stack gap="sm">
                    <Button 
                        variant="filled" size="lg" radius="md" 
                        onClick={() => router.push('/account/edit')}
                        leftSection={<IconSettings size={20} />} 
                        className={layout.darkBtn}
                    >
                        Account Settings
                    </Button>
                    <Button 
                        variant="filled" size="lg" radius="md" 
                        leftSection={isAdmin ? <IconLayoutDashboard size={20} /> : <IconPackage size={20} />}
                        onClick={() => router.push(isAdmin ? '/admin' : '/orders')}
                        className={isAdmin ? layout.adminBtn : layout.darkBtn}
                    >
                        {isAdmin ? 'Admin Dashboard' : 'Order History'}
                    </Button>
                </Stack>
                <Center mt={50}>
                    <Button 
                        variant="subtle" color="red.4" size="md" 
                        leftSection={<IconLogout size={20} />} 
                        onClick={handleLogout} 
                        fw={600}
                    >
                        Log out
                    </Button>
                </Center>
            </Card>
        </Box>
    );
}