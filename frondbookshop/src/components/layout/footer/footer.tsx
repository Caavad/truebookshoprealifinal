import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SendHorizonal, Github, MoonStar } from "lucide-react";

export async function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="grid items-center gap-8 pb-8 pt-6 lg:py-6 container">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-20">
          <div>
            <Link href="/" className="text-lg font-bold">
              Skateshop
            </Link>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-10 xxs:grid-cols-2 sm:grid-cols-4">
            <div className="space-y-3">
              <h4 className="text-base font-medium">Credits</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href="https://onestopshop.jackblatch.com/"
                  >
                    OneStopShop
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href="https://acme-corp.jumr.dev/"
                  >
                    Acme Corp
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href="https://craft.mxkaske.dev/"
                  >
                    craft.mxkaske.dev
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href="https://tx.shadcn.com/"
                  >
                    Taxonomy
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href="https://ui.shadcn.com/"
                  >
                    shadcn/ui
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-base font-medium">Help</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href="/"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href="/"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href="/"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href="/"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-base font-medium">Social</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href="https://twitter.com/sadmann17"
                  >
                    X
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href="https://github.com/sadmann7"
                  >
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href="https://discord.com/users/sadmann7"
                  >
                    Discord
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href="https://cal.com/sadmann7"
                  >
                    cal.com
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-base font-medium">Lofi</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href="https://www.youtube.com/watch?v=jfKfPfyJRdk"
                  >
                    beats to study to
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href="https://www.youtube.com/watch?v=rUxyKA_-grg"
                  >
                    beats to chill to
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href="https://www.youtube.com/watch?v=rwionZbOryo"
                  >
                    a fresh start
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    href="https://www.youtube.com/watch?v=2gliGzb2_1I"
                  >
                    coffee to go
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-base font-medium">
              Subscribe to our newsletter
            </h4>
            <form className="grid w-full">
              <div className="relative space-y-0">
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-12"
                  type="text"
                  placeholder="skate@gmail.com"
                />
                <Button
                  size={"icon"}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 absolute right-[3.5px] top-[4px] z-20 size-7"
                >
                  <SendHorizonal />
                </Button>
              </div>
            </form>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-1 text-left text-sm leading-loose text-muted-foreground">
            Built by
            <span> </span>
            <Link
              className="font-semibold transition-colors hover:text-foreground"
              href="https://github.com/Emkaran500"
            >
              Emkaran500
            </Link>
            .
          </div>
          <div className="flex items-center space-x-1">
            <Link
              href="https://github.com/Emkaran500"
              className="mg- inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground size-9 "
            >
              <Github className="size-4" />
            </Link>
            <Button
              size={"icon"}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground size-9"
            >
              <MoonStar className="absolute scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}