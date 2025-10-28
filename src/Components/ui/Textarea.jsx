import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-19.5 w-full rounded-md border border-[1.2px] border-black bg-transparent px-3 py-2 text-sm transition-[color,box-shadow] outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
         "focus-visible:border-blue-500",
        // "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        className
      )}
      {...props} />
  );
}
Textarea.displayName = "Textarea"

export { Textarea }
