'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ meta, onPage }) {
  if (!meta || !meta.totalPages || meta.totalPages <= 1) return null;

  const { page, totalPages } = meta;

  return (
    <nav className="mt-8 flex items-center justify-between gap-4" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Previous
      </button>

      <span className="text-sm text-ink-soft">
        Page <strong className="font-semibold text-ink">{page}</strong> of {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPage(page + 1)}
        disabled={page >= totalPages}
        className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand/40 hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
