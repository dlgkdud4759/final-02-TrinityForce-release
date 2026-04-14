import BookDetailClient from './BookDetailClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

interface ProductData {
  _id: number;
  seller_id: number;
  name: string;
  content: string;
  mainImages?: { path: string; name: string }[];
  createdAt: string;
  updatedAt: string;
  seller?: {
    _id: number;
    name: string;
    image?: string;
  };
  bookmarks?: number;
  likes?: number;
  extra?: {
    isBook?: boolean;
    author?: string;
    condition?: '최상' | '상' | '중';
    category?: string;
  };
}

async function fetchProduct(id: string): Promise<ProductData | null> {
  if (!API_URL) return null;

  const res = await fetch(`${API_URL}/products/${id}`, {
    headers: {
      'client-id': CLIENT_ID || '',
    },
    next: {
      revalidate: 30,
    },
  });

  if (!res.ok) return null;

  const data = await res.json();
  if (!data?.item) return null;

  return data.item as ProductData;
}

export default async function Page({ params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id);

  if (!product) {
    return null;
  }

  return <BookDetailClient initialProduct={product} />;
}
