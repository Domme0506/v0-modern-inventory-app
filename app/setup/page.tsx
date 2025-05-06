"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function SetupPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [isRunningMigration, setIsRunningMigration] = useState(false)

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch("/api/setup-db")
      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage(`Database is set up correctly. Item count: ${data.itemCount}`)
      } else {
        setStatus("error")
        setMessage(data.error || "Unknown error")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Failed to check database status")
      console.error("Error checking database:", error)
    }
  }

  const runMigration = async () => {
    setIsRunningMigration(true)
    try {
      // This is a simplified approach - in a real app, you'd use Prisma Migrate
      const response = await fetch("/api/setup-db/migrate", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage("Migration completed successfully")
      } else {
        setStatus("error")
        setMessage(data.error || "Migration failed")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Failed to run migration")
      console.error("Error running migration:", error)
    } finally {
      setIsRunningMigration(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>Check and configure your database connection</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "loading" ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : status === "success" ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">{message}</AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={checkDatabaseStatus}>
            Check Status
          </Button>
          <Button onClick={runMigration} disabled={isRunningMigration || status === "success"}>
            {isRunningMigration ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              "Run Migration"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
