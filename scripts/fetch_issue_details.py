#!/usr/bin/env python3
"""
Script pour récupérer les détails d'une issue spécifique
"""

import requests
import json
import sys
from datetime import datetime

REPO_OWNER = "yans40"
REPO_NAME = "gegeDot"

def fetch_issue(issue_number):
    """Récupère les détails d'une issue spécifique"""
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/issues/{issue_number}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ Erreur: {e}")
        return None

def display_issue(issue):
    """Affiche les détails d'une issue"""
    if not issue:
        print("❌ Issue non trouvée")
        return
    
    print(f"\n{'='*80}")
    print(f"  ISSUE #{issue['number']}: {issue['title']}")
    print(f"{'='*80}\n")
    
    print(f"  État: {issue['state'].upper()}")
    print(f"  Créée: {issue['created_at']}")
    if issue.get('closed_at'):
        print(f"  Fermée: {issue['closed_at']}")
    
    # Labels
    labels = [label['name'] for label in issue.get('labels', [])]
    if labels:
        print(f"  Labels: {', '.join(labels)}")
    
    # Assignés
    assignees = [assignee['login'] for assignee in issue.get('assignees', [])]
    if assignees:
        print(f"  Assignés à: {', '.join(assignees)}")
    
    # Auteur
    if issue.get('user'):
        print(f"  Auteur: {issue['user']['login']}")
    
    # URL
    print(f"  URL: {issue['html_url']}")
    
    # Corps de l'issue
    if issue.get('body'):
        print(f"\n  Description:")
        print(f"  {'-'*76}")
        body_lines = issue['body'].split('\n')
        for line in body_lines[:50]:  # Limiter à 50 lignes
            print(f"  {line}")
        if len(body_lines) > 50:
            print(f"  ... ({len(body_lines) - 50} lignes supplémentaires)")
    
    # Commentaires (si disponibles)
    if issue.get('comments', 0) > 0:
        print(f"\n  Commentaires: {issue['comments']}")
        print(f"  URL des commentaires: {issue['comments_url']}")
    
    print(f"\n{'='*80}\n")

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/fetch_issue_details.py <NUMERO_ISSUE>")
        print("Exemple: python3 scripts/fetch_issue_details.py 1")
        sys.exit(1)
    
    issue_number = sys.argv[1]
    issue = fetch_issue(issue_number)
    display_issue(issue)
    
    # Sauvegarder en JSON
    if issue:
        output_file = f"issue_{issue_number}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(issue, f, indent=2, ensure_ascii=False)
        print(f"✅ Détails sauvegardés dans: {output_file}")

if __name__ == "__main__":
    main()
