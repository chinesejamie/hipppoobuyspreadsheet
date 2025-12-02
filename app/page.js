import { Suspense } from 'react';
import PageContent from './page-content';
import { Loader2 } from 'lucide-react';

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-[#FF186B] animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-lg font-medium">Loading OOPBuy Spreadsheet...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PageContent />
    </Suspense>
  );
}
