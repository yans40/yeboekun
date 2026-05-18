# Solution rapide pour voir Jean TestFamille

## Étape 1 : Exécuter le script de diagnostic et création

**Via phpMyAdmin (RECOMMANDÉ)** :
1. Ouvrez http://localhost:8080
2. Base `yeboekun` → onglet "SQL"
3. Copiez-collez le contenu de `scripts/diagnostic_jean.sql`
4. Cliquez sur "Exécuter"

**OU via terminal (nouveau terminal)** :
```bash
cd /Users/kassyimbadollou/Documents/yeboekun
docker exec -i yeboekun-mysql mysql -u root -ppassword yeboekun < scripts/diagnostic_jean.sql
```

## Étape 2 : Vérifier que le backend fonctionne

Testez l'API directement :
```bash
curl http://localhost:5001/api/persons | grep -i "testfamille"
```

Ou ouvrez dans votre navigateur :
http://localhost:5001/api/persons

Cherchez "Jean TestFamille" dans la réponse JSON.

## Étape 3 : Recharger dans le frontend

1. Retournez sur la page de la vue éventail
2. Cliquez sur **"🔄 Recharger les personnes"**
3. Cherchez "Jean TestFamille" dans le menu déroulant

## Si ça ne fonctionne toujours pas

Vérifiez la console du navigateur (F12) pour voir s'il y a des erreurs lors du chargement des personnes.

Vérifiez aussi que le backend est bien en cours d'exécution :
```bash
ps aux | grep "dotnet.*Yeboekun"
```
