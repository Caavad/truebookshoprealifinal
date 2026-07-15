const DEFAULT_API_URL = "http://localhost:5130";

export function getApiBaseUrl(): string {
  return (
    process.env.API_HOST ||
    process.env.NEXT_PUBLIC_API_HOST ||
    process.env.NEXT_PUBLIC_API_URL ||
    DEFAULT_API_URL
  );
}

export function getApiCandidates(): string[] {
  const configured = getApiBaseUrl();
  return [...new Set([configured, DEFAULT_API_URL, "http://localhost:7000"])];
}
