import HomeClient from './_components/HomeClient';
import { Metadata } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL('https://trinityforce.vercel.app'),
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

interface Product {
  _id: number;
  seller_id: number;
  name: string;
  content: string;
  mainImages?: { path: string; name: string }[];
  createdAt: string;
  seller?: {
    _id: number;
    name: string;
    image?: string;
  };
  extra?: {
    isBook?: boolean;
    author?: string;
    condition?: string;
    category?: string;
    location?: string | null;
  };
  bookmarks?: number;
}

async function fetchProducts(): Promise<Product[]> {
  if (!API_URL) return [];
  const res = await fetch(`${API_URL}/products`, {
    headers: {
      'client-id': CLIENT_ID || '',
    },
    next: {
      revalidate: 30,
    },
  });

  if (!res.ok) return [];

  const data = await res.json();
  const books = (data.item || []).filter((item: Product) => item.extra?.isBook);
  return books;
}

export default async function Page() {
  const initialProducts = await fetchProducts();

  return <HomeClient initialProducts={initialProducts} />;
}
