// Fallback for any photo slot when the real asset is null — monochrome
// initials, never a broken image or empty box.
export function Monogram({
  initials,
  className,
}: {
  initials: string;
  className?: string;
}) {
  return (
    <div
      className={
        "grain flex items-center justify-center bg-surface-2 " +
        (className ?? "")
      }
    >
      <span className="font-mono text-4xl font-semibold tracking-tight text-muted">
        {initials}
      </span>
    </div>
  );
}
