'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import { Box, Button, Checkbox, Card, PasswordInput, Text, TextInput, Title, Alert, Center, Stack ,Anchor} from '@mantine/core';
import { IconAlertCircle, IconMail, IconLock } from '@tabler/icons-react';
import layout from '@/src/app/components/layout/auth/AuthLayout.module.css';
import classes from '@/src/app/components/forms/auth/AuthForm.module.css';
import { api } from '@/src/app/lib/api';
import bcrypt from 'bcryptjs';
export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    bcrypt.hash("Admin@123", 10).then(console.log);
    const form = useForm({
        initialValues: { email: '', password: '' },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email format'),
            password: (value) => (value.length < 6 ? 'Password is too short' : null),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
      console.log("Sending to API:", values); 
        setLoading(true);
        setApiError('');
          
        try {
            const data = await api.auth.login(values);
            if (data && data.accessToken) {
                localStorage.setItem('user_token', data.accessToken);
                localStorage.setItem('user_data', JSON.stringify(data.user));
                router.push('/');
                router.refresh();
            } else {
                setApiError('Invalid credentials. Please try again.');
            }
        } catch (error) {
            setApiError('Login failed. Please check your connection.');

     
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className={layout.container}>
            <Card className={layout.card} radius="24px" p={40}>
                <Stack gap="xs" mb={30} ta="center">
                    <Text className={classes.subtitle} fw={600} c="violet.4">Welcome Back</Text>
                    <Title order={1} className={classes.title} c="white">Log in</Title>
                    <Text c="gray.5" size="sm">Enter your account details to continue.</Text>
                </Stack>

                {apiError && (
                    <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md" radius="md" variant="light">
                        {apiError}
                    </Alert>
                )}
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="md">
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
                            placeholder="Enter your password"
                            leftSection={<IconLock size={16} />}
                            required
                            {...form.getInputProps('password')}
                            disabled={loading}
                            styles={{ input: { backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' } }}
                        />
                        <Center>
                            <Checkbox label="Remember me" color="violet" size="sm" c="gray.4" />
                        </Center>
                        <Button 
                            type="submit" 
                            size="lg" 
                            radius="md" 
                            fullWidth 
                            variant="gradient"
                            gradient={{ from: 'violet.6', to: 'cyan.5' }}
                            loading={loading}
                        >
                            Log in
                        </Button>
                    </Stack>
                </form>
                <Stack gap="sm" mt={30} ta="center">
                    <Anchor component={Link} href="/auth/forgot" size="xs" c="gray.5">Forgot password?</Anchor>
                    <Text size="sm" c="gray.4">
                        Don't have an account?{' '}
                        <Anchor component={Link} href="/auth/register" fw={700} c="violet.3">Create one</Anchor>
                    </Text>
                </Stack>
            </Card>
        </Box>
    );
}