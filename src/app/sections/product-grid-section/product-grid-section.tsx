'use client';

// ضفنا useState و useEffect هون
import { useState, useEffect } from 'react';
import { TextInput, Select, Group, Title, Stack, Container, Center, Loader } from '@mantine/core';
import { IconSearch, IconSortDescending } from '@tabler/icons-react';
import { useProductsList } from '../../state-management/product/products-list-provider';
import { ProductGridArea } from './areas/product-card-area';
import styles from './product-grid-section.module.scss';

export const ProductGridSection = () => {
    const { loading, search, setSearch, sortBy, setSortBy } = useProductsList();

    // 1. State محلي سريع جداً عشان الـ Input ما يعلق تحت إيد اليوزر
    const [localSearch, setLocalSearch] = useState(search);

    // 2. هاد الـ Effect هو "الفرامل" (Debounce). 
    // ما ببعث الكلمة للكونتكت إلا بعد ما اليوزر يوقف كتابة بـ 400 ملي ثانية
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(localSearch);
        }, 650);

        // تنظيف التايمر إذا اليوزر كمل كتابة قبل ما تخلص الـ 400 ملي ثانية
        return () => clearTimeout(timer);
    }, [localSearch, setSearch]);

    if (loading) return (
        <Center className={styles.loaderContainer}>
            <Loader color="violet" type="bars" />
        </Center>
    );

    return (
        <Container size="xl" className={styles.sectionContainer}>
            <Stack gap="xl" className={styles.headerStack}>
                <Title order={1} className={styles.title}>Explore Collection</Title>

                <Group justify="space-between" align="flex-end" className={styles.filterGroup}>
                    <TextInput
                        placeholder="Search products..."
                        leftSection={<IconSearch size={16} />}
                        value={localSearch} // 👈 صرنا نقرأ من الستيت المحلي
                        onChange={(e) => setLocalSearch(e.target.value)} // 👈 بنحدث الستيت المحلي فوراً
                        className={styles.searchInput}
                        variant="filled"
                    />
                    <Select
                        placeholder="Sort by"
                        value={sortBy} // الـ Select ما بده Debounce لأنه كبسة وحدة
                        onChange={setSortBy}
                        leftSection={<IconSortDescending size={16} />}
                        data={[
                            { value: 'newest', label: 'Default' },
                            { value: 'name-asc', label: 'A-Z' },
                            { value: 'price-low', label: 'Price: Low-High' },
                            { value: 'price-high', label: 'Price: High-Low' },
                        ]}
                        className={styles.sortSelect}
                        variant="filled"
                    />
                </Group>
            </Stack>
            
            <ProductGridArea />

        </Container>
    );
};