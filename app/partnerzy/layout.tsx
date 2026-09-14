import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Strefa Partnera · Program Afiliacyjny dla Położnych i Gabinetów — HappyBirth',
  description: 'Dołącz do Programu Partnerskiego HappyBirth. Dedykowana oferta i prowizje dla położnych, fizjoterapeutek uroginekologicznych i gabinetów.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PartnerzyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F4] text-[#1A1512]">
      {children}
    </div>
  );
}
