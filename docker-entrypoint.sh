#!/bin/sh
# docker-entrypoint.sh

# Auf Verfügbarkeit der Datenbank warten
echo "Warte auf Datenbank..."
npx wait-on $DATABASE_URL -t 60000

# Prisma-Migrationen ausführen
echo "Führe Datenbankmigrationen aus..."
npx prisma db push --accept-data-loss

# Anwendung starten
echo "Starte Inventarverwaltung..."
exec node server.js
