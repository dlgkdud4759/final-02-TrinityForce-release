import './globals.css';
import HeaderMain from '@/components/layout/HeaderMain';
import Navigation from '@/components/layout/Navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <HeaderMain />
        {children}
        <Navigation />
      </body>
    </html>
  );
}
