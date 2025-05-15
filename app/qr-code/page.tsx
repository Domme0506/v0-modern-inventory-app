import { QRCodeGenerator } from "@/components/qr-code-generator"

export default function QRCodePage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">QR-Code Generator</h1>
      <QRCodeGenerator />
    </div>
  )
}
