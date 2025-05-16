import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QrCode } from "lucide-react"

export default function QrScanButton() {
  return (
    <Button variant="outline" asChild>
      <Link href="/scan">
        <QrCode className="mr-2 h-4 w-4" />
        QR-Code scannen
      </Link>
    </Button>
  )
}
