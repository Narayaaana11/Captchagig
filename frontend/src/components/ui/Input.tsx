import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-11 w-full rounded-lg border-2 border-purple-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:border-purple-600 focus-visible:ring-2 focus-visible:ring-purple-500/20 focus-visible:ring-offset-0 transition-all disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  />
))
Input.displayName = "Input"

export { Input }
