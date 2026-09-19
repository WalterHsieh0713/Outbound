import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span aria-hidden className="text-xl">
            ✈️
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            AbroadReady
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-semibold">
          <Link
            href="/guide"
            className="rounded-md px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Guide
          </Link>
          <Link
            href="/checklist"
            className="rounded-md px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Checklist
          </Link>
        </nav>
      </div>
    </header>
  );
}
