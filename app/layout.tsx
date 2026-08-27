import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Matheus de Souza | Data Science',
  description: 'Portfólio de Matheus de Souza: Data Science, Machine Learning e Analytics.',
  metadataBase: new URL(process.env.SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'Matheus de Souza | Data Science',
    description: 'Dados em decisões. Projetos de Machine Learning e Analytics.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Matheus de Souza | Data Science',
    description: 'Dados em decisões. Projetos de Machine Learning e Analytics.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
