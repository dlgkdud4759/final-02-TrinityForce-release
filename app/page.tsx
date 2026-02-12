import HomeClient from './_components/HomeClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trinity Force - 책 교환 커뮤니티',
  description: '안 읽는 책들을 쉽게 교환하는 커뮤니티',
  openGraph: {
    title: 'Trinity Force',
    description: '안 읽는 책들을 쉽게 교환하는 커뮤니티',
    url: 'https://trinityforce.vercel.app/',
    siteName: 'Trinity Force',
    images: [
      {
        url: '/images/og.png',
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trinity Force',
    description: '안 읽는 책들을 쉽게 교환하는 커뮤니티',
    images: ['/images/og.png'],
  },
};

export default function Page() {
  return <HomeClient />;
}
