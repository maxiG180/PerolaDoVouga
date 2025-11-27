import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[80px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-[#D4AF37] focus-visible:ring-4 focus-visible:ring-[#D4AF37]/10 disabled:cursor-not-allowed disabled:opacity-50 hover:border-gray-300",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
