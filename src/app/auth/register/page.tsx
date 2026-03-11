'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import { Box, Button, Card, PasswordInput, Text, TextInput, Title, Alert, Stack, Anchor, Switch, Group} from '@mantine/core';
import { IconAlertCircle, IconUser, IconMail, IconLock, IconShieldLock } from '@tabler/icons-react';
import layout from '@/src/app/components/layout/auth/AuthLayout.module.css';
import { api } from '@/src/app/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const form = useForm({
        initialValues: { fullName: '', email: '', password: '', role: 'user' },
        validate: {
            fullName: (value) => (value.length < 2 ? 'Name is too short' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => (value.length < 6 ? 'Min 6 characters' : null),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        setApiError('');
        try {
            const data = await api.auth.register(values);
            if (data) {
                router.push('/auth/login');
            } else {
                setApiError('Registration failed. Please try again.');
            }
        } catch (error) {
            setApiError('Server error. Ensure the auth service is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className={layout.container}>
            <Card className={layout.card} radius="24px" p={40}>
                <Stack gap="xs" mb={30} ta="center">
                    <Text fw={600} c="violet.4">Join Us Today</Text>
                    <Title order={1} c="white">Create Account</Title>
                    <Text c="gray.5" size="sm">Fill in your details to get started.</Text>
                </Stack>

                {apiError && (
                    <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md" radius="md">
                        {apiError}
                    </Alert>
                )}

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="md">
                        <TextInput
                            label="Full Name"
                            placeholder="Your name"
                            leftSection={<IconUser size={16} />}
                            required
                            {...form.getInputProps('fullName')}
                            disabled={loading}
                            styles={{ input: { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' } }}
                        />
                        <TextInput
                            label="Email"
                            placeholder="you@example.com"
                            leftSection={<IconMail size={16} />}
                            required
                            {...form.getInputProps('email')}
                            disabled={loading}
                            styles={{ input: { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' } }}
                        />
                        <PasswordInput
                            label="Password"
                            placeholder="Create a strong password"
                            leftSection={<IconLock size={16} />}
                            required
                            {...form.getInputProps('password')}
                            disabled={loading}
                            styles={{ input: { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' } }}
                        />
                        <Group justify="space-between" mt="xs" p="sm" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Group gap="sm">
                                <IconShieldLock size={20} color="#adb5bd" />
                                <Box>
                                    <Text size="sm" fw={600} c="white">Register as Admin</Text>
                                    <Text size="xs" c="gray.5">Enable full dashboard access</Text>
                                </Box>
                            </Group>
                            <Switch 
                                color="violet" 
                                size="md"
                                checked={form.values.role === 'admin'}
                                onChange={(event) => form.setFieldValue('role', event.currentTarget.checked ? 'admin' : 'user')}
                                disabled={loading}
                            />
                        </Group>
                        <Button 
                            type="submit" 
                            size="lg" 
                            radius="md" 
                            fullWidth 
                            variant="gradient"
                            gradient={{ from: 'violet.6', to: 'cyan.5' }}
                            loading={loading}
                            mt="sm"
                        >
                            Sign up
                        </Button>
                    </Stack>
                </form>
                <Text size="sm" c="gray.4" mt={30} ta="center">
                    Already have an account?{' '}
                    <Anchor component={Link} href="/auth/login" fw={700} c="violet.3">Log in</Anchor>
                </Text>
            </Card>
        </Box>
    );
}