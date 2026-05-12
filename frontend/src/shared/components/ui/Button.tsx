import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/utils/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200 active:scale-95 transition-all duration-300 rounded-2xl",
        destructive:
          "bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-100 active:scale-95 transition-all rounded-2xl",
        outline:
          "border-2 border-slate-200 bg-transparent hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-bold active:scale-95 transition-all rounded-2xl",
        secondary:
          "bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold active:scale-95 transition-all rounded-2xl",
        ghost: "hover:bg-slate-50 text-slate-600 font-bold rounded-2xl",
        link: "text-blue-600 underline-offset-4 hover:underline font-bold",
        premium: "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl shadow-blue-200 hover:shadow-blue-300 hover:scale-[1.02] active:scale-95 transition-all duration-500 rounded-2xl border-none font-black tracking-tight",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 active:scale-95 transition-all rounded-2xl font-bold",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-9 rounded-xl px-4 text-xs",
        lg: "h-14 rounded-[1.5rem] px-10 text-base",
        xl: "h-16 rounded-[2rem] px-12 text-lg",
        icon: "h-12 w-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
