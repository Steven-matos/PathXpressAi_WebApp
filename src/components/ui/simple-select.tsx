"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SimpleSelectOption {
  value: string
  label: string
}

export interface SimpleSelectProps {
  value: string | undefined
  options: SimpleSelectOption[]
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function SimpleSelect({
  value,
  options,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  className,
}: SimpleSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const selectRef = React.useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div 
      ref={selectRef}
      className={cn(
        "relative w-full font-sans",
        className
      )}
    >
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        )}
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-20">
          <div className="py-1">
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                  option.value === value && "bg-accent text-accent-foreground"
                )}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 