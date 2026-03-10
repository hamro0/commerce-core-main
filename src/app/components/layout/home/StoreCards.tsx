'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Button, Card, Text, ThemeIcon, Title } from '@mantine/core';

import classes from '@/src/app/components/layout/home/StoreHome.module.css';

export type GlowCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  href: string;
};

export type FeatureItemProps = {
  icon: React.ReactNode;
  title: string;
  desc: string;
};

export function GlowCard({ title, description, icon, buttonText, href }: GlowCardProps) {
  return (
    <Card
      radius="xl"
      p="xl"
      className={`${classes.glassCard} ${classes.glowHover}`}
    >
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%'
        }}
      >
        <Box>
          <ThemeIcon size={54} radius="lg" variant="light" color="violet" mb="xl">
            {icon}
          </ThemeIcon>
          <Title order={3} c="white" mb="sm">
            {title}
          </Title>
          <Text c="gray.4" size="sm" style={{ lineHeight: 1.6 }}>
            {description}
          </Text>
        </Box>

        <Button component={Link} href={href} variant="outline" color="violet.3" radius="md" fullWidth mt="xl">
          {buttonText}
        </Button>
      </Box>
    </Card>
  );
}

