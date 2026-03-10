'use client';

import Link from 'next/link';
import { Box, Container, Text, Group, ActionIcon, Title, rem } from '@mantine/core';
import { IconBrandTwitter, IconBrandGithub, IconBrandInstagram, IconSparkles } from '@tabler/icons-react';
import classes from './StoreFooter.module.css';



const FOOTER_DATA = {
    shop: [
        { label: 'All Products', href: '/products' },
        { label: 'Featured', href: '/#featured' },
        { label: 'New Arrivals', href: '/products' },
    ],
    support: [
        { label: 'Order Tracking', href: '/orders' },
        { label: 'Shipping Policy', href: '/' },
        { label: 'Contact Us', href: '/' },
    ],
    company: [
        { label: 'About Us', href: '/' },
        { label: 'Careers', href: '/' },
        { label: 'Privacy Policy', href: '/' },
    ],
};

export default function StoreFooter() {
    return (
        <Box component="footer" className={classes.footerWrapper}>
            <Container size="xl">
                <Box className={classes.footerGrid}>

                    <Box className={classes.brandColumn}>
                        <Group gap="xs">
                            <ActionIcon variant="gradient" gradient={{ from: 'violet', to: 'cyan' }} radius="md">
                                <IconSparkles style={{ width: rem(18), height: rem(18) }} />
                            </ActionIcon>
                            <Text fw={800} size="xl" c="white">MySTORE</Text>
                        </Group>
                        <Text size="sm" c="gray.5" maw={300}>
                            Redefining the digital storefront with glassmorphism and high-performance developer tools.
                        </Text>
                    </Box>

                    <Box className={classes.linksColumn}>
                        <Text className={classes.columnTitle}>Shop</Text>
                        {FOOTER_DATA.shop.map((link) => (
                            <Link key={link.label} href={link.href} className={classes.footerLink}>
                                {link.label}
                            </Link>
                        ))}
                    </Box>

                    <Box className={classes.linksColumn}>
                        <Text className={classes.columnTitle}>Support</Text>
                        {FOOTER_DATA.support.map((link) => (
                            <Link key={link.label} href={link.href} className={classes.footerLink}>
                                {link.label}
                            </Link>
                        ))}
                    </Box>

                    <Box className={classes.linksColumn}>
                        <Text className={classes.columnTitle}>Company</Text>
                        {FOOTER_DATA.company.map((link) => (
                            <Link key={link.label} href={link.href} className={classes.footerLink}>
                                {link.label}
                            </Link>
                        ))}
                    </Box>
                </Box>

                <Box className={classes.bottomBar}>
                    <Text className={classes.copyright}>
                        © 2026 MyStore. All rights reserved. Built with Next.js & Mantine.
                    </Text>

                    <Group gap="sm" className={classes.socialGroup}>
                        <ActionIcon variant="subtle" color="gray" radius="xl">
                            <IconBrandTwitter size={18} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="gray" radius="xl">
                            <IconBrandGithub size={18} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="gray" radius="xl">
                            <IconBrandInstagram size={18} />
                        </ActionIcon>
                    </Group>
                </Box>
            </Container>
        </Box>
    );
}