# Guide : Implémenter des Visualisations Bilingues (Python ↔ React)

Ce guide documente la méthodologie utilisée pour créer des graphiques Matplotlib et des GIFs entièrement bilingues (ex: Français / Anglais) avec de grandes polices, et comment les intégrer dynamiquement dans un site web Next.js/React.

C'est un motif d'architecture extrêmement utile pour vos futurs projets de recherche ou d'IA qui nécessitent des interfaces multilingues.

---

## 1. Côté Python : Scripts Paramétrables

Le but est d'éviter de dupliquer le code Python. Au lieu de cela, on ajoute un argument CLI (Command Line Interface) à votre script pour déterminer la langue au moment de l'exécution.

### A. Gérer l'argument de langue et la taille des polices

Dans votre fichier principal (ex: `main.py`), utilisez `argparse` pour récupérer la langue, et ajustez massivement la taille des polices (`rcParams`) pour que le texte soit lisible sur le web.

```python
import argparse
import matplotlib.pyplot as plt
import os

# 1. Configurer les arguments
parser = argparse.ArgumentParser()
parser.add_argument('--lang', type=str, default='fr', choices=['fr', 'en'])
args = parser.parse_args()
LANG = args.lang

# 2. Augmenter drastiquement les tailles de police globales
plt.rcParams.update({
    'font.size': 14,
    'axes.labelsize': 16,
    'axes.titlesize': 18,
    'legend.fontsize': 14,
    'xtick.labelsize': 12,
    'ytick.labelsize': 12
})

# 3. Créer des dossiers de sortie séparés par langue
OUTPUT_DIR = os.path.join("outputs", LANG)
os.makedirs(OUTPUT_DIR, exist_ok=True)
```

### B. Traductions Dynamiques (Inline)

Partout où vous générez un texte ou un titre dans Matplotlib, utilisez des conditions `if/else` en ligne pour injecter la bonne langue.

```python
# Exemple de traduction de titre et légende
title = "Land Use Map" if LANG == 'en' else "Carte d'Occupation des Sols"
ax.set_title(title, fontsize=18, fontweight='bold')

xlabel = "Compactness C (Min)" if LANG == 'en' else "Compacité C (Min)"
ax.set_xlabel(xlabel)
```

### C. Exécution et Génération

Vous exécutez alors le script autant de fois que vous avez de langues pour générer les jeux d'images distincts :
```bash
python3 main.py --lang fr
python3 main.py --lang en
```
Vous obtiendrez vos graphiques et GIFs sauvegardés dans `outputs/fr/` et `outputs/en/`.

---

## 2. Côté Web (Next.js / React) : Assets Dynamiques

Une fois vos dossiers d'images `fr/` et `en/` copiés dans le dossier `public/assets/` de votre site Next.js, l'astuce consiste à lier les chemins d'images à l'état global de la langue du site.

### A. Détecter la langue actuelle

Dans vos composants React, utilisez votre hook personnalisé de langue (ou i18n) pour savoir quelle langue est active.

```tsx
import { useLang } from '../hooks/useLang'; // (ou équivalent)

export default function MyDataComponent() {
  const { lang } = useLang();
  const isEn = lang === 'en';

  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### B. Lier les `src` dynamiquement

Au lieu d'utiliser un chemin d'image en dur (`/assets/mon_image.png`), utilisez des *Template Literals* (backticks) JavaScript pour y injecter le code de la langue :

```tsx
{/* L'image changera TOUTE SEULE quand l'utilisateur cliquera sur le bouton EN/FR du site ! */}
<img 
  src={`/assets/${isEn ? 'en' : 'fr'}/mon_image.png`} 
  alt={isEn ? "My awesome plot" : "Mon super graphique"}
  className="w-full h-auto rounded-lg shadow-md"
/>
```

Pour les modales de plein écran (zoom), faites de même dans les événements `onClick` :
```tsx
<div onClick={() => openZoomModal(`/assets/${isEn ? 'en' : 'fr'}/mon_image.png`)}>
    <img src={`/assets/${isEn ? 'en' : 'fr'}/mon_image.png`} />
</div>
```

---

## Conclusion
Avec cette technique, **l'interface et les rendus Python scientifiques sont découplés**. L'algorithme se concentre sur la génération de visuels qualitatifs dans toutes les langues, et React se contente d'afficher dynamiquement le bon dossier sans logique complexe.
