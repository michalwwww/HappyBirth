import type { Metadata } from 'next';
import { HomeVariantV1 } from '@/components/home-variant-v1';

export const metadata: Metadata = {
  title: 'HappyBirth · Landing Page · Szkoła Rodzenia Online',
  description:
    'Kompleksowy kurs edukacyjny online dla przyszłych mam i ojców. 52 filmowe lekcje e-learning VOD, sprawdzone patenty i edukacja rodzicielska dla dwojga.',
  robots: { index: false, follow: false },
};

export default function LandingPage() {
  return <HomeVariantV1 />;
}
