"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { QRCodeSVG } from "qrcode.react"
import { Download, Printer } from "lucide-react"

export default function GenerateQRPage() {
  const [cabinet, setCabinet] = useState("Schrank 1")
  const [position, setPosition] = useState("oben")
  const [side, setSide] = useState("links")

  // Schränke, Positionen und Seiten definieren
  const cabinets = Array.from({ length: 9 }, (_, i) => `Schrank ${i + 1}`)
  const positions = ["oben", "mitte", "unten"]
  const sides = ["links", "rechts"]

  // Standort aus den Einzelteilen zusammensetzen
  const location = `${cabinet}, ${side} ${position}`

  // QR-Code als PNG herunterladen
  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
      const downloadLink = document.createElement("a")
      downloadLink.href = pngUrl
      downloadLink.download = `qrcode-${location.replace(/\s+/g, "-").toLowerCase()}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  // QR-Code drucken
  const printQRCode = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement
      if (canvas) {
        const pngUrl = canvas.toDataURL("image/png")
        printWindow.document.write(`
          <html>
            <head>
              <title>QR-Code für ${location}</title>
              <style>
                body {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
                  font-family: Arial, sans-serif;
                }
                .container {
                  text-align: center;
                }
                img {
                  max-width: 300px;
                  height: auto;
                }
                h2 {
                  margin-top: 20px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <img src="${pngUrl}" alt="QR-Code">
                <h2>${location}</h2>
              </div>
              <script>
                window.onload = function() {
                  window.print();
                  window.setTimeout(function() {
                    window.close();
                  }, 500);
                }
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">QR-Codes für Schränke erstellen</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Standort auswählen</CardTitle>
            <CardDescription>Wählen Sie den Schrank und die Position aus</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cabinet">Schrank</Label>
              <Select value={cabinet} onValueChange={setCabinet}>
                <SelectTrigger id="cabinet">
                  <SelectValue placeholder="Schrank auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {cabinets.map((cab) => (
                    <SelectItem key={cab} value={cab}>
                      {cab}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Position</Label>
              <RadioGroup value={position} onValueChange={setPosition} className="flex flex-col space-y-1">
                {positions.map((pos) => (
                  <div key={pos} className="flex items-center space-x-2">
                    <RadioGroupItem value={pos} id={`position-${pos}`} />
                    <Label htmlFor={`position-${pos}`}>{pos.charAt(0).toUpperCase() + pos.slice(1)}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Seite</Label>
              <RadioGroup value={side} onValueChange={setSide} className="flex flex-row space-x-4">
                {sides.map((s) => (
                  <div key={s} className="flex items-center space-x-2">
                    <RadioGroupItem value={s} id={`side-${s}`} />
                    <Label htmlFor={`side-${s}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>QR-Code</CardTitle>
            <CardDescription>QR-Code für: {location}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <div className="border p-4 rounded-lg bg-white">
              <QRCodeSVG id="qr-canvas" value={location} size={200} level="H" includeMargin={true} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={downloadQRCode}>
              <Download className="mr-2 h-4 w-4" />
              Herunterladen
            </Button>
            <Button onClick={printQRCode}>
              <Printer className="mr-2 h-4 w-4" />
              Drucken
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
