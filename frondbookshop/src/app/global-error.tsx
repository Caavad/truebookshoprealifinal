'use client'

import { Button } from "@/components/ui/button"

export default function GlobalError({
//  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col w-full min-h-screen justify-center items-center gap-5">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Application Error!</h2>
            <p className="text-gray-600 mb-6">
              A critical error occurred in the application
            </p>
            <Button
              onClick={() => reset()}
              variant="outline"
            >
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
