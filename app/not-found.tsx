import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050507] px-6 text-center text-white">
      <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">404</p>
      <h1 className="mt-3 text-4xl font-bold">Story Not Found</h1>
      <p className="mt-3 max-w-md text-zinc-300">This report is no longer available or has moved to a new intelligence thread.</p>
      <Link href="/" className="mt-6 rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2 hover:bg-white/[0.1]">
        Back to Live Feed
      </Link>
    </div>
  );
}
