"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}

      {/* 👇 This is the part that matters */}
      <ToastViewport
        className="
          fixed
          right-0
          top-[64px]          /* 👈 offset below navbar height */
          z-[100]
          flex
          w-full
          max-h-screen
          flex-col-reverse
          p-4
          sm:top-[64px]       /* for small screens too */
          sm:right-0
          sm:flex-col
        "
      />
    </ToastProvider>
  )
}
