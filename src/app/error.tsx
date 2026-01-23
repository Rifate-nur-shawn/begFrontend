"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 px-4 text-center">
      <h2 className="font-display text-4xl md:text-5xl text-black mb-4">
        Something went wrong.
      </h2>
      <p className="font-utility text-zinc-600 mb-8 max-w-md">
        We apologize for the inconvenience. Our team has been notified.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-black text-white font-utility text-xs tracking-[0.15em] uppercase hover:bg-zinc-800 transition-colors"
        >
          Try again
        </button>
        <Link
          href={ROUTES.HOME}
          className="px-6 py-3 border border-black text-black font-utility text-xs tracking-[0.15em] uppercase hover:bg-zinc-100 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
