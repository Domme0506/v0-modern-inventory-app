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
      // Annahme: Der QR-Code enthält einen Standort-String
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
        Zurück
      </Button>

      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold mb-6">QR-Code scannen</h1>
        <div className="max-w-md mx-auto">
          <QrScanner onScan={handleScan} onError={handleError} />

          {error && <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">Fehler: {error}</div>}

          <p className="mt-4 text-sm text-gray-500">
            Scannen Sie einen QR-Code, um alle Artikel an diesem Standort anzuzeigen.
          </p>
        </div>
      </div>
    </div>
  )
}
