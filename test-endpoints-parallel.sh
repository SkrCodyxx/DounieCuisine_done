#!/bin/bash
# Script de test parallèle des endpoints HTTP du projet
# Usage: bash test-endpoints-parallel.sh

BASE_URL="http://localhost" # À adapter si besoin
LOG_FILE="test-endpoints-parallel.log"

endpoints=(
  "/" 
  "/login" 
  "/register" 
  "/menu" 
  "/contact" 
  "/not-found" 
  "/mentions" 
  "/cgu" 
  "/reservation" 
  "/gallery" 
  "/about" 
  "/app" 
  "/admin" 
  "/admin/login" 
  "/admin/dashboard" 
  "/admin/clients" 
  "/admin/menu" 
  "/admin/orders" 
  "/admin/quotes" 
  "/admin/calendar" 
  "/admin/staff" 
  "/admin/settings" 
  "/api/ping" 
  "/api/users" 
  "/api/menu" 
)

# Token d'API pour l'authentification (à remplacer par un vrai token)
API_TOKEN="your-api-token-here"

function test_endpoint() {
  url="$1"
  full_url="$BASE_URL$url"
  
  # Ajout des headers d'authentification pour les endpoints API
  if [[ "$url" == "/api/"* ]]; then
    result=$(curl -s -w "CODE:%{http_code} TIME:%{time_total}\n" -H "Authorization: Bearer $API_TOKEN" -o tmp_curl_out "$full_url")
  else
    result=$(curl -s -w "CODE:%{http_code} TIME:%{time_total}\n" -o tmp_curl_out "$full_url")
  fi
  
  code=$(echo "$result" | grep 'CODE:' | sed 's/.*CODE:\([0-9]*\).*/\1/')
  time=$(echo "$result" | grep 'TIME:' | sed 's/.*TIME:\([0-9.]*\).*/\1/')
  body=$(head -c 200 tmp_curl_out | tr '\n' ' ')
  rm -f tmp_curl_out
  if [[ "$code" == "200" ]]; then
    status="OK"
  elif [[ "$code" == "301" || "$code" == "302" ]]; then
    status="REDIRECT"
  else
    status="FAIL"
  fi
  echo "[$status] $full_url ($code, ${time}s) -> $body" >> "$LOG_FILE"
}

# Nettoyage du log précédent
rm -f "$LOG_FILE"
echo "--- Test parallèle des endpoints du projet ---" > "$LOG_FILE"

for ep in "${endpoints[@]}"; do
  test_endpoint "$ep" &
done

wait
echo "--- Fin des tests ---" >> "$LOG_FILE"
