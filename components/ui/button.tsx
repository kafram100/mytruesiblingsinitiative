import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/** Button styles: use `primary` | `secondary` | `tertiary` across the app; `muted`/`destructive` reserved for special cases; `default`/`outline`/`ghost`/`link` mirror those for legacy shadcn usage. */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-tight ring-offset-background motion-safe:transition-[transform,box-shadow,background-color,color,border-color,opacity] motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border border-transparent bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/88 hover:shadow-lg hover:shadow-primary/35",
        secondary:
          "border-2 border-primary/38 bg-background text-foreground shadow-sm hover:border-primary/58 hover:bg-primary/[0.08] hover:shadow-md",
        tertiary:
          "border border-transparent bg-transparent text-primary shadow-none hover:bg-primary/12 hover:shadow-none",
        muted:
          "border border-transparent bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/85 hover:shadow-md",
        destructive:
          "border border-transparent bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/88 hover:shadow-lg",
        // Legacy aliases (prefer primary / secondary / tertiary in new UI)
        default:
          "border border-transparent bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/88 hover:shadow-lg hover:shadow-primary/35",
        outline:
          "border-2 border-primary/38 bg-background text-foreground shadow-sm hover:border-primary/58 hover:bg-primary/[0.08] hover:shadow-md",
        ghost:
          "border border-transparent bg-transparent text-primary hover:bg-accent hover:text-accent-foreground shadow-none hover:shadow-none motion-safe:hover:translate-y-0",
        link: "border-transparent bg-transparent text-primary underline-offset-4 shadow-none hover:underline hover:bg-transparent hover:shadow-none motion-safe:hover:translate-y-0",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-full px-3 text-xs",
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10 rounded-full p-0 [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
