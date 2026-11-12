import type { Metadata } from 'next';
import { HomeVariantV1 } from '@/components/home-variant-v1';

export const metadata: Metadata = {
  title: 'HappyBirth · Wariant 1 (Klasyczny) · Szkoła Rodzenia Online',
  description:
    'Kompleksowy kurs edukacyjny online dla przyszłych mam i ojców. 52 filmowe lekcje e-learning VOD, sprawdzone patenty i edukacja rodzicielska dla dwojga.',
  robots: { index: false, follow: false },
};

export default function Wariant1Page() {
  return <HomeVariantV1 />;
}
