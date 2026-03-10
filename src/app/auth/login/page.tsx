'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import { Box, Button, Checkbox, Card, PasswordInput, Text, TextInput, Title, Alert, Center } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import layout from '@/src/app/components/layout/auth/AuthLayout.module.css';
import classes from '@/src/app/components/forms/auth/AuthForm.module.css';
import { api } from '@/src/app/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email format'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
  setLoading(true);
  setApiError('');
  const data = await api.auth.login(values);
  if (!data) {
    setApiError('Invalid email or password. Please try again.');
    setLoading(false);
    return;
  }
  localStorage.setItem('user_token', data.accessToken);
  localStorage.setItem('user_data', JSON.stringify(data.user));
  router.push('/');
  router.refresh();
};

  return (
    <Box className={layout.container}>
      <Card className={layout.card}>

        <Text className={classes.subtitle}>Welcome back</Text>
        <Title order={1} className={classes.title}>Log in</Title>
        <Text className={classes.description}>Enter your account details to continue.</Text>

        {apiError && (
          <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md" radius="md">
            {apiError}
          </Alert>
        )}

        <form className={classes.formWrapper} onSubmit={form.onSubmit(handleSubmit)}>
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
            placeholder="Enter your password"
            required
            {...form.getInputProps('password')}
            className={classes.inputField}
            disabled={loading}
          />

          <Center className={classes.checkboxCenter}>
            <Checkbox label="Remember me" className={classes.checkboxControl} />
          </Center>

          <Button type="submit" className={classes.submitBtn} loading={loading}>
            Log in
          </Button>
        </form>

        <Box className={classes.footer}>
          <Link href="/auth/forgot" className={classes.link}> Forgot password? </Link>

          <Text className={classes.footerText}>
            Don't have an account?{' '}
            <Link href="/auth/register" className={classes.registerLink}> Create one </Link>
          </Text>
        </Box>
      </Card>
    </Box>
  );
}