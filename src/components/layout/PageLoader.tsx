export function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] items-center justify-center px-6 text-center"
    >
      <div>
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border border-white/10 border-t-cyan" />
        <p className="ecl-label">Loading simulation module</p>
      </div>
    </div>
  );
}
