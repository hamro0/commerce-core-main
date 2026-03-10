import '@mantine/core/styles.css';
import './globals.css';
import { Inter } from 'next/font/google';
import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core';
import StoreHeader from '@/src/app/components/header/StoreHeader';
import StoreFooter from '@/src/app/components/footer/StoreFooter';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const theme = createTheme({
  primaryColor: 'violet',
  defaultRadius: 'md',
  fontFamily: inter.style.fontFamily,
  components: {
    Container: {
      defaultProps: {
        size: 'xl',
      },
    },
  },
});

export const metadata = {
  title: 'MyStore | Futuristic E-commerce',
  description: 'A premium, glassmorphic shopping experience.',
};

export const viewport = {
  themeColor: '#06050d',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body className={inter.className}>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <StoreHeader />
          {children}
          <StoreFooter />
        </MantineProvider>
      </body>
    </html>
  );
}