// The development launcher starts the ASP.NET API on port 7000. Keeping this
// default in sync prevents authentication failures from being reported as
// invalid credentials when the API is simply being contacted on the wrong port.
const DEFAULT_API_URL = "http://localhost:7000";

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
  return [...new Set([configured, DEFAULT_API_URL, "http://localhost:5130"])];
}
