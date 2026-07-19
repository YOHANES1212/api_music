export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      {[0, 1].map((section) => (
        <div key={section}>
          <div className="mb-3 h-6 w-40 animate-pulse rounded bg-zinc-800" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-md bg-zinc-900"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
