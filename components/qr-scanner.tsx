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
    // Scanner initialisieren
    const qrCodeScanner = new Html5Qrcode("qr-reader")
    setHtml5QrCode(qrCodeScanner)

    // Aufräumen beim Unmount
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
          // Erfolgs-Callback
          onScan(decodedText)
          stopScanner()
        },
        (errorMessage) => {
          // Fehler-Callback wird kontinuierlich während des Scannens aufgerufen
          // Wir wollen den Benutzer nicht mit Fehlern überhäufen
          console.log(errorMessage)
        },
      )
    } catch (err) {
      setScanning(false)
      onError(err instanceof Error ? err : new Error("Fehler beim Starten des Scanners"))
    }
  }

  const stopScanner = async () => {
    if (html5QrCode && html5QrCode.isScanning) {
      try {
        await html5QrCode.stop()
      } catch (err) {
        console.error("Fehler beim Stoppen des Scanners:", err)
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
            Scannen beenden
          </Button>
        ) : (
          <Button onClick={startScanner}>
            <Camera className="mr-2 h-4 w-4" />
            Scannen starten
          </Button>
        )}
      </div>
    </div>
  )
}
