import Link from 'next/link';
import { Card, Image, Text, Group, Button, Stack } from '@mantine/core';
import { IProductDTO } from '@/src/app/models/products/product-response-models';
import styles from './product-box.module.scss';

interface IProps {
  product: IProductDTO;
}

export const ProductCard = ({ product }: IProps) => {
  return (
    <Card className={styles.productCard} radius="md" p="md">
      <Card.Section>
        <Image
          src={product.imageUrl || "/cobra-pro.webp"}
          height={220}
          alt={product.name}
          className={styles.cardImage}
        />
      </Card.Section>

      <Stack gap="xs" mt="md">
        <Group justify="space-between">
          <Text className={styles.productName}>{product.name}</Text>
          <Text className={styles.productPrice}>${product.price}</Text>
        </Group>
        
        <Text className={styles.description} lineClamp={2}>
          {product.description}
        </Text>

        <Button
          fullWidth
          variant="gradient"
          gradient={{ from: 'violet', to: 'cyan' }}
          component={Link}
          href={`/products/${product.id}`}
        >
          View Details
        </Button>
      </Stack>
    </Card>
  );
};