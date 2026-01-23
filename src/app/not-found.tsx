import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="font-display text-8xl md:text-9xl text-neutral-100 mb-2">
        404
      </h1>
      <h2 className="font-display text-3xl md:text-4xl text-black mb-6">
        Page Not Found
      </h2>
      <p className="font-utility text-zinc-500 mb-10 max-w-md text-sm tracking-wide">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        href={ROUTES.HOME}
        className="px-8 py-4 bg-black text-white font-utility text-xs tracking-[0.2em] uppercase hover:bg-zinc-800 transition-all duration-300"
      >
        Back to Home
      </Link>
    </div>
  );
}
