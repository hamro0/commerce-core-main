'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from '@mantine/form';
import { Box, Button, Card, Text, TextInput, Title, Alert, Center, Stack, Anchor,Divider } from '@mantine/core';
import { IconAlertCircle, IconCheck, IconMail, IconArrowLeft } from '@tabler/icons-react';
import layout from '@/src/app/components/layout/auth/AuthLayout.module.css';
import { api } from '@/src/app/lib/api';

export default function ForgotPasswordPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const form = useForm({
        initialValues: { email: '' },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);
        setApiError('');
        try {
            const response = await api.auth.resetPassword('1', values); 
            if (response) {
                setSubmitted(true);
            } else {
                setApiError('Email not found. Please check and try again.');
            }
        } catch (error) {
            setApiError('Service temporarily unavailable. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className={layout.container}>
            <Card className={layout.card} radius="24px" p={40}>
                {!submitted ? (
                    <Stack gap="xl">
                        <Stack gap="xs" ta="center">
                            <Text fw={600} c="violet.4">Recover Access</Text>
                            <Title order={1} c="white">Forgot Password?</Title>
                            <Text c="gray.5" size="sm">
                                Enter your email address and we'll send you instructions to reset your password.
                            </Text>
                        </Stack>

                        {apiError && (
                            <Alert icon={<IconAlertCircle size="1rem" />} color="red" radius="md" variant="light">
                                {apiError}
                            </Alert>
                        )}

                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <Stack gap="md">
                                <TextInput
                                    label="Email Address"
                                    placeholder="you@example.com"
                                    leftSection={<IconMail size={16} />}
                                    required
                                    {...form.getInputProps('email')}
                                    disabled={loading}
                                    styles={{ input: { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' } }}
                                />
                                <Button 
                                    type="submit" 
                                    size="lg" 
                                    radius="md" 
                                    fullWidth 
                                    variant="gradient"
                                    gradient={{ from: 'violet.6', to: 'cyan.5' }}
                                    loading={loading}
                                >
                                    Send Reset Link
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                ) : (
                    <Stack align="center" ta="center" gap="lg" py={20}>
                        <Box className={layout.avatarGlow} style={{ width: 80, height: 80, opacity: 0.5 }} />
                        <IconCheck size={60} color="var(--mantine-color-teal-4)" />
                        <Title order={2} c="white">Check your email</Title>
                        <Text c="gray.5">
                            Instructions have been sent to <b>{form.values.email}</b>. If you don't see them, check your spam folder.
                        </Text>
                        <Button variant="subtle" color="violet.3" onClick={() => setSubmitted(false)}>
                            Didn't receive it? Try again
                        </Button>
                    </Stack>
                )}
                <Divider my="xl" style={{ opacity: 0.1 }} />
                <Center>
                    <Anchor 
                        component={Link} 
                        href="/auth/login" 
                        c="gray.5" 
                        size="sm" 
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <IconArrowLeft size={16} /> Back to login
                    </Anchor>
                </Center>
            </Card>
        </Box>
    );
}