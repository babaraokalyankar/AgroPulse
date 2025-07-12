"use client"

import { useEffect, useState, type ReactNode } from "react"

interface SafeHydrateProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function SafeHydrate({ children, fallback }: SafeHydrateProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return fallback || <div className="min-h-[50px] animate-pulse bg-gray-100 rounded-md"></div>
  }

  return <>{children}</>
}
