type ApiUnavailableProps = {
  message?: string;
};

export function ApiUnavailable({
  message = "API is not running. Start it with: npm run dev:api (or npm run dev from the project root).",
}: ApiUnavailableProps) {
  return (
    <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-amber-200">
      {message}
    </div>
  );
}
