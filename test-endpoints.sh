#!/bin/bash
# Script avancé de test des endpoints HTTP du projet
# Usage: bash test-endpoints.sh

BASE_URL="http://localhost" # À adapter si besoin

# Liste exhaustive des endpoints à tester (ajoutez ici toutes les routes connues)
endpoints=(
  "/"                # Accueil public
  "/login"           # Page de login publique
  "/register"        # Page d'inscription
  "/menu"            # Menu public
  "/contact"         # Contact
  "/not-found"       # Page 404
  "/mentions"        # Mentions légales (si existe)
  "/cgu"             # CGU (si existe)
  "/reservation"     # Page de réservation
  "/gallery"         # Galerie
  "/about"           # À propos
  "/app"             # Frontend alternatif
  "/admin"           # Accueil admin
  "/admin/login"     # Login admin
  "/admin/dashboard" # Dashboard admin
  "/admin/clients"   # Gestion clients
  "/admin/menu"      # Gestion menu
  "/admin/orders"    # Gestion commandes
  "/admin/quotes"    # Gestion devis
  "/admin/calendar"  # Gestion calendrier
  "/admin/staff"     # Gestion staff
  "/admin/settings"  # Paramètres système
  "/api/ping"        # API test (si existe)
  "/api/users"       # API users (si existe)
  "/api/menu"        # API menu (si existe)
)

# Fonction de test avancée
function test_endpoint() {
  url="$1"
  full_url="$BASE_URL$url"
  # On récupère code, temps, et 200 premiers caractères du body
  result=$(curl -s -w "CODE:%{http_code} TIME:%{time_total}\n" -o tmp_curl_out "$full_url")
  code=$(echo "$result" | grep 'CODE:' | sed 's/.*CODE:\([0-9]*\).*/\1/')
  time=$(echo "$result" | grep 'TIME:' | sed 's/.*TIME:\([0-9.]*\).*/\1/')
  body=$(head -c 200 tmp_curl_out | tr '\n' ' ')
  rm -f tmp_curl_out
  # Coloration
  if [[ "$code" == "200" ]]; then
    color="\033[1;32m" # vert
    status="OK"
  elif [[ "$code" == "301" || "$code" == "302" ]]; then
    color="\033[1;33m" # jaune
    status="REDIRECT"
  else
    color="\033[1;31m" # rouge
    status="FAIL"
  fi
  echo -e "${color}[$status] $full_url ($code, ${time}s)\033[0m"
  if [[ "$status" == "FAIL" ]]; then
    echo "  → Extrait: $body"
  fi
}

echo "--- Test avancé des endpoints du projet ---"
for ep in "${endpoints[@]}"; do
  test_endpoint "$ep"
done
