export const BOOK_PLACEHOLDER = "/book-placeholder.svg";

const ALLOWED_REMOTE_HOSTS = new Set([
  "covers.openlibrary.org",
  "via.placeholder.com",
  "images.unsplash.com",
  "cdn-icons-png.flaticon.com",
  "upload.wikimedia.org",
]);

export function resolveBookCoverSrc(url?: string | null): string {
  if (!url?.trim()) {
    return BOOK_PLACEHOLDER;
  }

  const trimmed = url.trim();

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  try {
    const { hostname, protocol } = new URL(trimmed);
    if (protocol === "https:" && ALLOWED_REMOTE_HOSTS.has(hostname)) {
      return trimmed;
    }
  } catch {
    // Invalid URL — use placeholder.
  }

  return BOOK_PLACEHOLDER;
}
