import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F4F1EA] px-6 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-[#009FAF]">
        404
      </p>
      <h1 className="mt-2 max-w-md text-2xl font-bold tracking-tight text-[#1a1a1a]">
        This page could not be found
      </h1>
      <p className="mt-3 max-w-md text-sm text-[#666]">
        The link may be broken or the page may have been moved. If you were trying to
        reach the admin console, sign in first. Nested admin URLs require an active
        session.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex rounded-xl border border-[#E6E1D6] bg-white px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] shadow-sm transition-colors hover:bg-[#FAFAFA]"
        >
          Back to home
        </Link>
        <Link
          href="/admin/login"
          className="inline-flex rounded-xl bg-[#009FAF] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:opacity-95"
        >
          Admin sign in
        </Link>
      </div>
    </div>
  );
}
