'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Title, Card, TextInput, Button, Stack,Group, Avatar, Center, Loader, Divider, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconUser, IconDeviceFloppy, IconArrowLeft } from '@tabler/icons-react';
import layout from '@/src/app/components/layout/StoreLayout.module.css';
import { api } from '@/src/app/lib/api';

export default function EditAccountPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string>('');

    const form = useForm({
        initialValues: {
            fullName: '',
            email: '',
            avatar: '',
        },
        validate: {
            fullName: (value) => (value.length < 2 ? 'Name is too short' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
        },
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const storedData = localStorage.getItem('user_data');
                if (!storedData) {
                    router.push('/auth/login');
                    return;
                }
                const userData = JSON.parse(storedData);
                const userId = userData.id;
                setCurrentUserId(userId);

                const data = await api.auth.getProfile(userId);
                form.setValues({
                    fullName: data.fullName || '',
                    email: data.email || '',
                    avatar: data.avatar || '',
                });
            } catch (error) {
                console.error("Fetch error:", error);
                notifications.show({ 
                    title: 'Error', 
                    message: 'Failed to load profile data', 
                    color: 'red' 
                });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [router]);

    const handleUpdateProfile = async () => {
        setUpdating(true);
        try {
            const currentUserData = await api.auth.getProfile(currentUserId);
            const updatedData = {
                ...currentUserData,
                ...form.values
            };
            await api.auth.updateProfile(currentUserId, updatedData);
            localStorage.setItem('user_data', JSON.stringify(updatedData));
            notifications.show({
                title: 'Success',
                message: 'Your account has been updated successfully!',
                color: 'teal',
            });
            router.push('/account');
            
        } catch (error) {
            console.error(error);
            notifications.show({ 
                title: 'Update Failed', 
                message: 'An error occurred while saving changes', 
                color: 'red' 
            });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <Center h="100vh"><Loader color="violet" size="xl" type="bars" /></Center>;

    return (
        <Box className={layout.container} py={60}>
            <Container size="sm">
                 <Button 
                    variant="subtle" color="gray" 
                    leftSection={<IconArrowLeft size={18} />} 
                    onClick={() => router.push('/account')}
                    mb="xl"
                >
                    Back to Profile
                </Button>

                <Card className={layout.glassCard} radius="24px" p={40}>
                    <Stack gap="xl">
                        <Box>
                            <Title order={1} c="white" fz={32} fw={800}>Edit Account</Title>
                            <Text c="gray.5">Update your personal information below</Text>
                        </Box>
                        <Divider color="rgba(255,255,255,0.08)" />
                        <Group gap="xl">
                            <Avatar src={form.values.avatar} size={80} radius="xl" color="violet">
                                {form.values.fullName.charAt(0)}
                            </Avatar>
                            <Box>
                                <Text fw={700} c="white" fz="lg">{form.values.fullName || 'User Name'}</Text>
                                <Text size="sm" c="gray.5">{form.values.email || 'Email Address'}</Text>
                            </Box>
                        </Group>
                        <Stack gap="md">
                            <TextInput
                                label={<Text c="gray.4" size="sm" mb={5}>Full Name</Text>}
                                placeholder="Enter your full name"
                                leftSection={<IconUser size={16} color="#adb5bd" />}
                                {...form.getInputProps('fullName')}
                                styles={{ input: { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', height: '48px' } }}
                            />
                            <TextInput
                                label={<Text c="gray.4" size="sm" mb={5}>Avatar URL</Text>}
                                placeholder="https://example.com/photo.jpg"
                                {...form.getInputProps('avatar')}
                                styles={{ input: { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', height: '48px' } }}
                            />
                            <Button 
                                onClick={handleUpdateProfile} 
                                loading={updating} 
                                variant="gradient" 
                                gradient={{ from: 'violet.6', to: 'cyan.5' }}
                                size="lg"
                                radius="md"
                                mt="md"
                                leftSection={<IconDeviceFloppy size={20} />}
                            >
                                Save Changes
                            </Button>
                        </Stack>
                    </Stack>
                </Card>
            </Container>
        </Box>
    );
}