import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface BreadcrumbsProps extends React.HTMLAttributes<HTMLDivElement> {
  links: { name: string; href: string }[];
  separator?: React.ReactNode;
}

const Breadcrumbs = React.forwardRef<HTMLDivElement, BreadcrumbsProps>(
  ({ className, links, separator = "/", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center space-x-2 text-sm", className)}
        {...props}
      >
        {links.map((link, index) => (
          <React.Fragment key={link.href}>
            {index > 0 && (
              <span className="text-muted-foreground mx-1">{separator}</span>
            )}
            <Link 
              href={link.href}
              className={cn(
                "text-muted-foreground transition-colors hover:text-foreground",
                index === links.length - 1 && "font-medium text-foreground pointer-events-none"
              )}
            >
              {link.name}
            </Link>
          </React.Fragment>
        ))}
      </div>
    );
  }
);

Breadcrumbs.displayName = "Breadcrumbs";

export default Breadcrumbs;
