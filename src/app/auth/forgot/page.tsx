'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import { Box, Button, Card, Text, TextInput, Title, Alert } from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import layout from '@/src/app/components/layout/auth/AuthLayout.module.css';
import classes from '@/src/app/components/forms/auth/AuthForm.module.css';
import { api } from '@/src/app/lib/api';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const router = useRouter();
  const form = useForm({
    initialValues: { email: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
  setLoading(true);
  setApiError('');

  const data = await api.auth.resetPassword(values);

  if (!data) {
    setApiError('Failed to reset password. Please verify your details and try again.');
    setLoading(false);
    return;
  }

  if (data.accessToken) 
    localStorage.setItem('user_token', data.accessToken);
  
  if (data.user) 
    localStorage.setItem('user_data', JSON.stringify(data.user));
  
  setSubmitted(true);
  router.push('/auth/login');
  setLoading(false);
};
  return (
    <Box className={layout.container}>
      <Card className={layout.card}>
        {!submitted ? (
          <>
            <Text className={classes.subtitle}>Recover access</Text>
            <Title order={1} className={classes.title}>Forgot Password?</Title>
            <Text className={classes.description}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>

            {apiError && (
              <Alert icon={<IconAlertCircle size="1rem" />} color="red" mb="md" radius="md">
                {apiError}
              </Alert>
            )}

            <form className={classes.formWrapper} onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                label="Email Address"
                placeholder="you@example.com"
                required
                {...form.getInputProps('email')}
                className={classes.inputField}
                disabled={loading}
              />

              <Button type="submit" className={classes.submitBtn} loading={loading}>
                Send Reset Link
              </Button>
            </form>
          </>
        ) : (
          <Box style={{ textAlign: 'center' }}>
            <IconCheck size={50} color="var(--mantine-color-green-6)" style={{ marginBottom: '1rem' }} />
            <Title order={2} className={classes.title}>Check your email</Title>
            <Text className={classes.description}>
              Instructions have been sent. If you don't see them, check your spam folder.
            </Text>
            <Button variant="subtle" className={classes.registerLink} onClick={() => setSubmitted(false)} mt="md">
              Didn't receive it? Try again
            </Button>
          </Box>
        )}

        <Box className={classes.footer}>
          <Link href="/auth/login" className={classes.link}> ← Back to login </Link>
        </Box>
      </Card>
    </Box>
  );
}