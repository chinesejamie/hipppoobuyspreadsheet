import Link from 'next/link';
import { ArrowLeft, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#3B82F6] to-red-700 flex items-center justify-center">
          <SearchX className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#3B82F6] to-red-700 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </Link>
      </div>
    </div>
  );
}
