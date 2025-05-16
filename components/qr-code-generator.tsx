"use client"

import { useState, useRef } from "react"
import { QRCode } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Download, Printer, RefreshCw } from "lucide-react"
import { useReactToPrint } from "react-to-print"

export function QRCodeGenerator() {
  const [qrValue, setQrValue] = useState("")
  const [qrSize, setQrSize] = useState(256)
  const qrRef = useRef<HTMLDivElement>(null)

  // Handle printing
  const handlePrint = useReactToPrint({
    content: () => qrRef.current,
    documentTitle: "QR Code",
    removeAfterPrint: true,
  })

  // Handle download
  const handleDownload = () => {
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement
    if (!canvas) return

    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")

    const downloadLink = document.createElement("a")
    downloadLink.href = pngUrl
    downloadLink.download = `qrcode-${qrValue.substring(0, 20)}.png`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>QR-Code Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="qr-content">Inhalt</Label>
          <Input
            id="qr-content"
            placeholder="Text oder URL eingeben"
            value={qrValue}
            onChange={(e) => setQrValue(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="qr-size">Größe</Label>
          <Input
            id="qr-size"
            type="range"
            min="128"
            max="512"
            step="32"
            value={qrSize}
            onChange={(e) => setQrSize(Number(e.target.value))}
          />
          <div className="text-sm text-muted-foreground text-right">{qrSize}px</div>
        </div>

        <div ref={qrRef} className="flex justify-center p-4 bg-white rounded-md">
          {qrValue ? (
            <QRCode id="qr-code" value={qrValue} size={qrSize} level="H" includeMargin renderAs="canvas" />
          ) : (
            <div
              className="flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-md"
              style={{ width: qrSize, height: qrSize }}
            >
              <p className="text-sm text-muted-foreground text-center p-4">
                Geben Sie einen Text ein, um einen QR-Code zu generieren
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setQrValue("")} disabled={!qrValue}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Zurücksetzen
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handlePrint} disabled={!qrValue}>
            <Printer className="mr-2 h-4 w-4" />
            Drucken
          </Button>
          <Button onClick={handleDownload} disabled={!qrValue}>
            <Download className="mr-2 h-4 w-4" />
            Herunterladen
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
