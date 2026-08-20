import Link from "next/link";
import * as React from "react";

import NavMenuItem from "@/components/shared/nav-item";
import ProfileButton from "@/components/shared/profile-button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils"; 
import { SearchDialog } from "../../shared/search-dialog/search-dialog";
import { Sidebar } from "../../shared/sidebar/sidebar";

import { books } from "@/data/navbar";
import { NavBarProps } from "@/helpers/interfaces/navbar";

export default function NavBar() {
  return (
    <div className="border-b py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-bold">
            Bookshop
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Library</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Bookshop
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Open source digital library built with Next.js.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/docs" title="All Books">
                      Browse the entire collection.
                    </ListItem>
                    <ListItem href="/docs/recommendations" title="Recommendations">
                      Discover books tailored to your interests.
                    </ListItem>
                    <ListItem href="/docs/blog" title="Library Blog">
                      Articles, news, and reading guides.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {books.map((navItem: NavBarProps) => (
                <NavMenuItem key={navItem.id} item={navItem} />
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-4">
          <SearchDialog />
          <Sidebar />
          <ProfileButton />
        </div>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";