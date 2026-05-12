'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
        <div className="max-w-md w-full text-center">
          <h2 className="text-3xl font-bold mb-4">Critical System Error</h2>
          <p className="text-slate-400 mb-8">
            A critical error occurred that prevented the application from loading.
          </p>
          <button
            onClick={() => reset()}
            className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-200 transition-colors"
          >
            Try to Restart
          </button>
        </div>
      </body>
    </html>
  );
}
