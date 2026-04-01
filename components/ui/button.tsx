import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-bold transition-all duration-200 ease-bounce focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.95]",
  {
    variants: {
      variant: {
        default: "rounded-2xl bg-accent text-background shadow-neon hover:shadow-neon-lg hover:brightness-110",
        secondary: "rounded-2xl bg-surface-raised text-foreground neon-border hover:bg-surface-raised/80",
        outline: "rounded-2xl border-2 border-accent/40 text-accent hover:bg-accent/10 hover:border-accent",
        ghost: "rounded-2xl text-foreground-muted hover:text-foreground hover:bg-surface",
        destructive: "rounded-2xl bg-red-500/15 text-red-400 hover:bg-red-500/25"
      },
      size: {
        default: "h-11 px-6 py-2.5 text-sm",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-13 px-8 py-3 text-base",
        icon: "h-10 w-10 rounded-full"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
