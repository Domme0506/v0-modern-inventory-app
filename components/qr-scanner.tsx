"use client"

import { useState, useEffect } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Camera, StopCircle } from "lucide-react"

interface QrScannerProps {
  onScan: (data: string | null) => void
  onError: (error: Error) => void
}

export function QrScanner({ onScan, onError }: QrScannerProps) {
  const [scanning, setScanning] = useState(false)
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null)

  useEffect(() => {
    // Initialize scanner
    const qrCodeScanner = new Html5Qrcode("qr-reader")
    setHtml5QrCode(qrCodeScanner)

    // Cleanup on unmount
    return () => {
      if (qrCodeScanner.isScanning) {
        qrCodeScanner.stop().catch(console.error)
      }
    }
  }, [])

  const startScanner = async () => {
    if (!html5QrCode) return

    setScanning(true)

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Success callback
          onScan(decodedText)
          stopScanner()
        },
        (errorMessage) => {
          // Error callback is called continuously while scanning
          // We don't want to spam the user with errors
          console.log(errorMessage)
        },
      )
    } catch (err) {
      setScanning(false)
      onError(err instanceof Error ? err : new Error("Failed to start scanner"))
    }
  }

  const stopScanner = async () => {
    if (html5QrCode && html5QrCode.isScanning) {
      try {
        await html5QrCode.stop()
      } catch (err) {
        console.error("Error stopping scanner:", err)
      }
      setScanning(false)
    }
  }

  return (
    <div className="space-y-4">
      <div id="qr-reader" className="w-full max-w-md mx-auto overflow-hidden rounded-lg"></div>

      <div className="flex justify-center">
        {scanning ? (
          <Button variant="destructive" onClick={stopScanner}>
            <StopCircle className="mr-2 h-4 w-4" />
            Stop Scanning
          </Button>
        ) : (
          <Button onClick={startScanner}>
            <Camera className="mr-2 h-4 w-4" />
            Start Scanning
          </Button>
        )}
      </div>
    </div>
  )
}
