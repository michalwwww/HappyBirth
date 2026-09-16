'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';

export default function StrefaLicznikRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/strefa/plan-porodu');
  }, [router]);

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-[#FAE3EB] text-[#EC008C] flex items-center justify-center mx-auto">
        <FileText className="w-6 h-6" />
      </div>
      <h2 className="font-brand-display font-bold text-xl">Przenosimy do Planu Porodu...</h2>
      <p className="text-xs text-[#867A72]">
        Licznik skurczów został zastąpiony profesjonalnym Kreatorem Planu Porodu.
      </p>
      <Link
        href="/strefa/plan-porodu"
        className="inline-flex items-center gap-2 text-xs font-bold text-[#EC008C] hover:underline"
      >
        <span>Przejdź do Planu Porodu</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
