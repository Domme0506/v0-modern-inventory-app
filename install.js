const { execSync } = require("child_process")
const fs = require("fs")

// Überprüfen, ob Yarn installiert ist
try {
  execSync("yarn --version", { stdio: "ignore" })
  console.log("Yarn ist installiert, verwende Yarn...")
  execSync("yarn install --frozen-lockfile", { stdio: "inherit" })
} catch (e) {
  // Wenn Yarn nicht installiert ist, verwende npm
  console.log("Yarn ist nicht installiert, verwende npm...")
  try {
    execSync("npm install --no-package-lock --no-audit --no-fund", { stdio: "inherit" })
  } catch (npmError) {
    console.error("npm-Installation fehlgeschlagen, versuche minimale Installation...")

    // Minimale Installation für kritische Pakete
    try {
      execSync("npm install --no-package-lock --no-audit --no-fund next react react-dom @prisma/client", {
        stdio: "inherit",
      })
      console.log("Minimale Installation erfolgreich.")
    } catch (minError) {
      console.error("Alle Installationsversuche fehlgeschlagen.")
      process.exit(1)
    }
  }
}

// Prisma generieren
try {
  console.log("Generiere Prisma-Client...")
  if (fs.existsSync("./node_modules/.bin/prisma")) {
    execSync("./node_modules/.bin/prisma generate", { stdio: "inherit" })
  } else {
    execSync("npx prisma generate", { stdio: "inherit" })
  }
  console.log("Prisma-Client erfolgreich generiert.")
} catch (prismaError) {
  console.error("Fehler beim Generieren des Prisma-Clients:", prismaError)
  process.exit(1)
}
