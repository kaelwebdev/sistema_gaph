import * as React from "react"
import { cn } from "@/lib/utils"

const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select"> & {
  children: React.ReactNode
}>(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-lg border border-border bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
})
Select.displayName = "Select"

const SelectItem = ({
  value,
  children,
  ...props
}: { value: string; children: React.ReactNode } & React.OptionHTMLAttributes<HTMLOptionElement>) => {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  )
}

export { Select, SelectItem }
