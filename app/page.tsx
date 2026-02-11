import type { Metadata } from 'next';
import HomeClient from './_components/HomeClient';

export const metadata: Metadata = {
  title: '도서 목록',
  description: '도서 목록을 확인하고 검색하세요.',
  openGraph: {
    title: '도서 목록',
    description: '도서 목록을 확인하고 검색하세요.',
    type: 'website',
  },
};

export default function Page() {
  return <HomeClient />;
}
