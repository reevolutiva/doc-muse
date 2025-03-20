"use client"

import { AlertCircle } from "lucide-react"

interface BlockErrorProps {
  title?: string
  message?: string
  supportEmail?: string
}

export function BlockError({ 
  title = "Content Unavailable",
  message = "This content block appears to be empty or failed to load properly.",
  supportEmail = "support@kimfe.com"
}: BlockErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
      <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 max-w-md">
        {message} Try refreshing the page or checking your connection.
      </p>
      <p className="text-sm text-gray-500">
        If this issue persists, please contact{" "}
        <a href={`mailto:${supportEmail}`} className="text-blue-600 hover:text-blue-700 underline">
          our support team
        </a>
      </p>
    </div>
  )
}
