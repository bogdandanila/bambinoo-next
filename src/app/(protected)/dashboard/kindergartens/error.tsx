"use client"

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Error loading kindergartens</h3>
        <p className="mt-1 text-sm text-gray-500">{error.message}</p>
        <div className="mt-6 flex items-center justify-center gap-x-6">
          <button
            onClick={reset}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Try again
          </button>
          <Link href="/dashboard" className="text-sm font-semibold text-gray-900">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 