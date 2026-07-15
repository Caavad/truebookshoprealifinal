import Image from "next/image";

import { resolveBookCoverSrc } from "@/lib/book-cover";

type BookCoverProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
};

export function BookCover({
  src,
  alt,
  className,
  fill,
  width,
  height,
}: BookCoverProps) {
  const resolved = resolveBookCoverSrc(src);

  return (
    <Image
      src={resolved}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
    />
  );
}
