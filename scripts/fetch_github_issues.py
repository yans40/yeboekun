#!/usr/bin/env python3
"""
Script Python pour récupérer les issues GitHub via l'API
Plus robuste que le script bash, fonctionne même sans jq
"""

import requests
import json
from datetime import datetime

REPO_OWNER = "yans40"
REPO_NAME = "gegeDot"
GITHUB_API_URL = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/issues"

def format_date(date_str):
    """Formate une date ISO en format lisible"""
    try:
        dt = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
        return dt.strftime('%Y-%m-%d %H:%M')
    except:
        return date_str

def fetch_issues(state='open', per_page=100):
    """Récupère les issues depuis l'API GitHub"""
    url = f"{GITHUB_API_URL}?state={state}&per_page={per_page}&sort=created&direction=desc"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ Erreur lors de la récupération: {e}")
        return []

def display_issues(issues, title):
    """Affiche les issues de manière formatée"""
    print(f"\n{'='*80}")
    print(f"  {title}")
    print(f"{'='*80}\n")
    
    if not issues:
        print("  Aucune issue trouvée.\n")
        return
    
    for issue in issues:
        number = issue.get('number', 'N/A')
        title_text = issue.get('title', 'Sans titre')
        state = issue.get('state', 'unknown')
        created = format_date(issue.get('created_at', ''))
        labels = [label['name'] for label in issue.get('labels', [])]
        labels_str = ', '.join(labels) if labels else 'Aucune'
        
        # URL de l'issue
        html_url = issue.get('html_url', '')
        
        print(f"  #{number} | {title_text}")
        print(f"    État: {state.upper()} | Créée: {created}")
        print(f"    Labels: {labels_str}")
        print(f"    URL: {html_url}")
        print()

def main():
    print(f"🔍 Récupération des issues de {REPO_OWNER}/{REPO_NAME}...\n")
    
    # Récupérer les issues ouvertes
    open_issues = fetch_issues(state='open', per_page=100)
    display_issues(open_issues, f"ISSUES OUVERTES ({len(open_issues)})")
    
    # Récupérer les issues fermées (10 dernières)
    closed_issues = fetch_issues(state='closed', per_page=10)
    display_issues(closed_issues, f"ISSUES FERMÉES (10 dernières)")
    
    # Statistiques
    print(f"{'='*80}")
    print("  STATISTIQUES")
    print(f"{'='*80}\n")
    print(f"  Issues ouvertes: {len(open_issues)}")
    print(f"  Issues fermées (dernières 10): {len(closed_issues)}")
    print()
    
    # Sauvegarder dans un fichier JSON
    output_file = "github_issues.json"
    all_issues = {
        'open': open_issues,
        'closed': closed_issues[:10],
        'fetched_at': datetime.now().isoformat()
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_issues, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Issues sauvegardées dans: {output_file}")
    print()
    print("Pour voir les détails d'une issue spécifique:")
    print(f"  python3 scripts/fetch_issue_details.py <NUMERO>")

if __name__ == "__main__":
    main()
