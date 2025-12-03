'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton({ returnUrl }) {
  const router = useRouter();

  const handleBack = (e) => {
    e.preventDefault();

    // Check if there's history to go back to
    if (window.history.length > 1 && document.referrer.includes(window.location.origin)) {
      router.back();
    } else {
      // Fallback to constructed URL if no history or external referrer
      router.push(returnUrl);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-gray-600 hover:text-[#C92910] mb-6 transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="font-medium">Back to Products</span>
    </button>
  );
}
