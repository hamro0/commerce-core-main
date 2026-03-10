'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import { Box, Button, Card, PasswordInput, Text, TextInput, Title, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import layout from '@/src/app/components/layout/auth/AuthLayout.module.css';
import classes from '@/src/app/components/forms/auth/AuthForm.module.css';
import { api } from '@/src/app/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const form = useForm({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
    },
    validate: {
      fullName: (value) => (value.length < 2 ? 'Name is too short' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
  setLoading(true);
  setApiError('');
  const data = await api.auth.register(values);
  if (!data) {
    setApiError('Registration failed: Server returned 404. Please ensure your auth server is running.');
    setLoading(false);
    return;
  }
  localStorage.setItem('user_token', data.accessToken);
  localStorage.setItem('user_data', JSON.stringify(data.user));
  router.push('/auth/login');
  setLoading(false);
};

  return (
    <Box className={layout.container}>
      <Card className={layout.card}>
        <Text className={classes.subtitle}>Join us today</Text>
        <Title order={1} className={classes.title}>Create account</Title>
        <Text className={classes.description}>Fill in your details to get started.</Text>

        {apiError && (
          <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md" radius="md">
            {apiError}
          </Alert>
        )}

        <form className={classes.formWrapper} onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Full Name"
            placeholder="Your name"
            required
            {...form.getInputProps('fullName')}
            className={classes.inputField}
            disabled={loading}
          />

          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            {...form.getInputProps('email')}
            className={classes.inputField}
            disabled={loading}
          />

          <PasswordInput
            label="Password"
            placeholder="Create a strong password"
            required
            {...form.getInputProps('password')}
            className={classes.inputField}
            disabled={loading}
          />

          <Button type="submit" className={classes.submitBtn} loading={loading}> Sign up </Button>
        </form>

        <Box className={classes.footer}>
          <Text className={classes.footerText}>
            Already have an account?{' '}
            <Link href="/auth/login" className={classes.registerLink}> Log in </Link>
          </Text>
        </Box>
      </Card>
    </Box>
  );
}