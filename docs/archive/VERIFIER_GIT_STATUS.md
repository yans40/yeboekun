# Vérifier l'état Git et pousser vers GitHub

## Vérification de l'état

Exécutez ce script pour vérifier l'état :
```bash
./scripts/check_git_status.sh
```

Ou manuellement :
```bash
cd /Users/kassyimbadollou/Documents/gegeDot

# Vérifier les remotes
git remote -v

# Vérifier les derniers commits
git log --oneline -10

# Vérifier le statut
git status

# Vérifier les commits non pushés
git log origin/main..HEAD --oneline
```

## Si le remote n'est pas configuré

Si vous voyez que le remote n'est pas configuré vers https://github.com/yans40/gegeDot, configurez-le :

```bash
git remote add origin https://github.com/yans40/gegeDot.git
```

## Pour pousser vos commits

Une fois le remote configuré et après avoir créé le commit des optimisations :

```bash
# Pousser vers GitHub
git push origin main
```

Ou si votre branche s'appelle différemment :
```bash
git push origin master
```

## Si vous avez des commits non pushés

Si le script montre qu'il y a des commits locaux non pushés, vous pouvez les pousser avec :
```bash
git push origin main
```
