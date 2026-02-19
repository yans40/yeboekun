#!/bin/bash
# Script pour récupérer les issues GitHub via l'API

REPO_OWNER="yans40"
REPO_NAME="gegeDot"
GITHUB_API_URL="https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues"

echo "🔍 Récupération des issues de ${REPO_OWNER}/${REPO_NAME}..."
echo ""

# Récupérer toutes les issues (ouvertes et fermées)
echo "=== ISSUES OUVERTES ==="
curl -s "${GITHUB_API_URL}?state=open&per_page=100" | \
  jq -r '.[] | "\(.number) | \(.title) | \(.state) | \(.created_at)"' 2>/dev/null || \
  curl -s "${GITHUB_API_URL}?state=open&per_page=100" | \
  python3 -m json.tool | grep -E '"number"|"title"|"state"|"created_at"' | head -40

echo ""
echo "=== ISSUES FERMÉES (10 dernières) ==="
curl -s "${GITHUB_API_URL}?state=closed&per_page=10" | \
  jq -r '.[] | "\(.number) | \(.title) | \(.state) | \(.created_at)"' 2>/dev/null || \
  curl -s "${GITHUB_API_URL}?state=closed&per_page=10" | \
  python3 -m json.tool | grep -E '"number"|"title"|"state"|"created_at"' | head -20

echo ""
echo "=== STATISTIQUES ==="
OPEN_COUNT=$(curl -s "${GITHUB_API_URL}?state=open&per_page=100" | jq '. | length' 2>/dev/null || echo "N/A")
CLOSED_COUNT=$(curl -s "${GITHUB_API_URL}?state=closed&per_page=100" | jq '. | length' 2>/dev/null || echo "N/A")
echo "Issues ouvertes: ${OPEN_COUNT}"
echo "Issues fermées (dernières 100): ${CLOSED_COUNT}"

echo ""
echo "✅ Récupération terminée!"
echo ""
echo "Pour voir les détails d'une issue spécifique:"
echo "  curl -s ${GITHUB_API_URL}/<NUMERO> | jq '.'"
