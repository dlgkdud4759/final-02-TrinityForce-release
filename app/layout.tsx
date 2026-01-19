import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <p className="font-normal">Regular</p> {/* 400 */}
        <p className="font-medium">Medium</p> {/* 500 - 기본값 */}
        <p className="font-semibold">SemiBold</p> {/* 600 */}
        <p className="font-bold">Bold</p> {/* 700 */}
        {children}
      </body>
    </html>
  );
}
