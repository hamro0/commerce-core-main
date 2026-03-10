'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Card, Title, Text, Avatar, Button, Center, Loader } from '@mantine/core';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

type User = {
    fullName: string;
    email: string;
    avatar?: string | null;
};

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('user_token');
            const userData = localStorage.getItem('user_data');

            if (!token || !userData) {
                router.push('/auth/login');
                return;
            }

            try {
                const loggedInUser = JSON.parse(userData);
                const userId = loggedInUser.id;
                const data = await api.auth.getProfile(userId);
                setUser(data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_data');
        router.push('/auth/login');
    };

    if (loading) {
        return (
            <Center h="100vh">
                <Loader color="violet" size="xl" type="bars" />
            </Center>
        );
    }

    return (
        <Box className={`${layout.container} ${layout.accountWrapper}`}>
            <Card className={`${layout.shell} ${layout.card}`} maw={500} mx="auto">
                <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <Avatar size={120} radius="100%" src={user?.avatar || null} color="violet" variant="light" />

                    <Box style={{ textAlign: 'center' }}>
                        <Title order={2} c="white">{user?.fullName}</Title>
                        <Text c="gray.5" size="sm">{user?.email}</Text>
                    </Box>
                </Box>

                <Box mt="xl" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>


              {/*
             
                <Button variant="light" color="gray" fullWidth> Account Settings </Button>

                <Button variant="light" color="gray" fullWidth onClick={() => router.push('/orders')}>
                        Order History
                </Button>
             
              */}
                    <Button variant="outline" color="red" fullWidth onClick={handleLogout}>
                        Log out
                    </Button>
                </Box>
            </Card>
        </Box>
    );
}