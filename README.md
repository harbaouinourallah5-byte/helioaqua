# HelioAqua – Vue du Ciel (Simulation 3D Interactive)
> *« L'eau du soleil pour une agriculture durable »*  
> **Projet de Startup Étudiante – Section 4ème Économie et Gestion**  
> Équipe : **Ela Guesmi, Imen Bouali, Maram Khaloufi, Lina Ghars**  
> 🌐 **Démonstration en Ligne :** [https://harbaouinourallah5-byte.github.io/helioaqua/](https://harbaouinourallah5-byte.github.io/helioaqua/)  
> 📦 **Dépôt GitHub :** [https://github.com/harbaouinourallah5-byte/helioaqua](https://github.com/harbaouinourallah5-byte/helioaqua)

---

## 🚀 Comment lancer la simulation ?

### Option 1 : Démonstration en direct en ligne
Rendez-vous simplement sur : **[https://harbaouinourallah5-byte.github.io/helioaqua/](https://harbaouinourallah5-byte.github.io/helioaqua/)**

### Option 2 : Directement sans aucun serveur (100% hors-ligne)
Ouvrez simplement le fichier **`dist/index.html`** (ou **`docs/index.html`**) en double-cliquant dessus dans l'explorateur de fichiers de Windows.  
Il s'agit d'une version autonome tout-en-un (HTML + CSS + Three.js intégrés), **100% hors-ligne**, sans besoin d'internet ni de Node.js.

### Option 3 : Mode Développement (Vite Dev Server)
Si vous souhaitez modifier le code ou lancer le serveur de développement :
```bash
# Dans le dossier c:\Users\harba\Downloads\ela
npm.cmd run dev
# Ou avec PowerShell si autorisé : npm run dev
```
Puis ouvrez l'adresse locale affichée (ex: `http://localhost:5173/`).

### Option 3 : Recompiler le projet
```bash
npm.cmd run build
```
Le fichier autonome sera regénéré instantanément dans `dist/index.html`.

---

## 🎯 Fonctionnalités Clés pour la Présentation

1. **Caméra « Vue du ciel / Drone » (60-70°)** :
   - Clic gauche + glisser pour pivoter autour de la ferme.
   - Molette pour zoomer / dézoomer sur chaque élément.
   - Clic droit pour déplacer la vue (pan).
   - Bouton **« 🔄 Vue Drone »** pour réinitialiser la vue d'ensemble.

2. **Repères 3D Flottants (Hotspots)** :
   - Cliquez sur n'importe quel repère (☀️ *Panneaux*, ⚙️ *Pompe*, 💧 *Réservoir*, 🌿 *Goutte-à-Goutte*, 🍅 *Cultures*) pour que la caméra vole automatiquement vers la zone correspondante.

3. **Visite Guidée Automatisée (35s)** :
   - Cliquez sur **« ▶ Visite Guidée »** : le drone survole successivement les 7 étapes clés du projet en affichant des explications claires et synthétiques.

4. **Comparatif Économique & Écologique (Solaire vs Diesel)** :
   - Basculez le switch **Mode d'énergie** : observez la fumée noire et le compteur de carburant qui grimpe en diesel, contre le coût fixe à **0 DT** et l'eau préservée en solaire.

5. **Visualisation 3D de la Croissance Économique** :
   - Déplacez le curseur **« Installations vendues (1 à 20) »** : de nouvelles rangées de panneaux solaires et de nouvelles parcelles agricoles irriguées apparaissent en direct sur la carte 3D !
   - Le tableau de bord calcule en temps réel le Chiffre d'Affaires, les Charges Totales et le Résultat Net selon les chiffres officiels du projet (Point mort à 8 unités, résultat de +22 740 DT en An 1).
