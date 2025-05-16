"use client"

import { useState } from "react"
import { QrScanner } from "@/components/qr-scanner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ScanPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleScan = (data: string | null) => {
    if (data) {
      // Assuming the QR code contains a location string
      router.push(`/items?location=${encodeURIComponent(data)}`)
    }
  }

  const handleError = (err: Error) => {
    setError(err.message)
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Scan QR Code</h1>
        <div className="max-w-md mx-auto">
          <QrScanner onScan={handleScan} onError={handleError} />

          {error && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">Error: {error}</div>}

          <p className="mt-4 text-sm text-gray-500">Scan a QR code to view all items at that location.</p>
        </div>
      </div>
    </div>
  )
}
