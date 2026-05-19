# 🛡️ AZUR+ : Système de Détection de Fraude Bancaire Temps Réel

AZURE+ est un système distribué basé sur des microservices conçu pour la détection de fraude bancaire en temps réel. Il intègre une logique hybride (Règles Déterministes + Machine Learning), une architecture temps réel (WebSockets) et des interfaces de monitoring avancées pour garantir une boucle de feedback parfaite entre l'agent de sécurité et l'utilisateur final.

## 🏗️ Architecture du Projet

Le système est composé de 6 applications distinctes :

### 🔙 Backends (API & Moteurs)
1. **API Gateway** (`NestJS`) : Point d'entrée principal, gestion des WebSockets (`events.gateway.ts`), et routage vers les autres services.
2. **Transaction Service** (`NestJS`) : Service "Core Ledger", gère les comptes clients, enregistre l'historique et valide les soldes.
3. **Fraud Engine** (`Python FastAPI`) : Moteur d'intelligence artificielle et logique déterministe qui score chaque transaction en moins de 100ms.

### 💻 Frontends (Interfaces Utilisateur)
4. **SOC Dashboard** (`React + Vite`) : Interface "War Room" pour les agents de sécurité (Monitoring mondial, Triage des alertes, Blocage direct).
5. **Mobile PWA** (`React + Vite`) : L'application bancaire du client final (Flux de transactions en direct, Réception d'OTP, Notifications de blocage).
6. **Attack Simulator** (`React + Vite`) : Outil de test pour générer du trafic normal ou déclencher des attaques de fraude massives.

---

## 🛠️ Prérequis

- **Node.js** (v18 ou supérieur)
- **Python** (v3.10 ou supérieur) avec `pip`
- **npm** (inclus avec Node.js)
- Un compte **Render** (pour héberger l'infrastructure backend)
- Un compte **Vercel** (pour héberger les applications frontend)

---

## 💻 Installation & Lancement en Local

Pour tester le projet sur votre machine, vous devez démarrer les composants indépendamment.

### 1. Démarrer le Fraud Engine (Python)
```bash
cd fraud-engine
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Démarrer les Services Core (NestJS)
Dans deux terminaux séparés :
```bash
# Terminal 1 : API Gateway
cd api-gateway
npm install
npm run start:dev
# Tourne sur http://localhost:3000

# Terminal 2 : Transaction Service
cd transaction-service
npm install
npm run start:dev
# Tourne sur http://localhost:3001
```

### 3. Démarrer les Frontends (React / Vite)
Les frontends communiquent via WebSockets. Par défaut en local, ils pointeront vers `http://localhost:3000` (API Gateway) si les variables d'environnement de production ne sont pas définies.
```bash
# Terminal 3 : SOC Dashboard
cd soc-dashboard
npm install --legacy-peer-deps
npm run dev

# Terminal 4 : Mobile PWA
cd mobile-pwa
npm install --legacy-peer-deps
npm run dev

# Terminal 5 : Attack Simulator
cd attack-simulator
npm install --legacy-peer-deps
npm run dev
```
*(⚠️ L'utilisation de `--legacy-peer-deps` est obligatoire pour résoudre les conflits de version avec React 19 et certaines dépendances comme Recharts ou Leaflet).*

---

## 🚀 Déploiement en Production

Le projet est préconfiguré pour être déployé **gratuitement** à des fins de soutenance via l'écosystème Render / Vercel.

### 1. Hébergement des Backends (Render)
Un fichier "Blueprint" (`render.yaml`) est présent à la racine du dépôt. Il déploie automatiquement les 3 backends sur le plan `free` de Render.
1. Connectez-vous sur [Render Dashboard](https://dashboard.render.com).
2. Allez dans **Blueprints** > **New Blueprint Instance**.
3. Liez votre dépôt GitHub `Projet-AZURE-`.
4. Render lira le fichier `render.yaml` et déploiera l'API Gateway, le Transaction Service et le Fraud Engine.
> **Note Importante :** Les serveurs gratuits de Render s'endorment après 15 minutes d'inactivité. Prévoyez de charger vos pages 2 minutes avant votre soutenance pour absorber le "Cold Start" (délai de réveil d'environ 50 secondes).

### 2. Hébergement des Frontends (Vercel)
Les 3 interfaces doivent être créées en tant que projets séparés sur Vercel.
1. Connectez-vous sur [Vercel](https://vercel.com).
2. Cliquez sur **Add New...** > **Project** et importez votre dépôt GitHub.
3. Dans **Framework Preset**, sélectionnez `Vite`.
4. Dans **Root Directory**, sélectionnez le dossier cible (ex: `soc-dashboard`).
5. Dans la section **Environment Variables**, ajoutez les clés de production (voir ci-dessous).
6. Cliquez sur **Deploy**.
7. Répétez l'opération pour `mobile-pwa` et `attack-simulator`.

---

## 🔐 Variables d'Environnement (Vercel)

Pour lier les Frontends déployés sur Vercel à vos Backends sur Render, définissez ces variables dans les paramètres Vercel de **chaque projet frontend** :

- `VITE_API_GATEWAY_URL` = `https://azur-api-gateway.onrender.com`
- `VITE_TRANSACTION_SERVICE_URL` = `https://azur-transaction-service.onrender.com`
- `VITE_GATEWAY_URL` = `https://azur-api-gateway.onrender.com`

*(Pensez à remplacer les URLs si vos services Render portent des noms différents).*

---

## 💡 Déroulement de la Boucle de Démonstration (Soutenance)

1. Ouvrez le **SOC Dashboard** sur l'écran principal (présentation au jury).
2. Ouvrez la **Mobile PWA** sur votre smartphone (testBANK).
3. Ouvrez l'**Attack Simulator** dans un onglet séparé et déclenchez le *Scénario 2 (Vol de carte à l'étranger)*.
4. Sur le Dashboard, observez l'alerte apparaître en rouge.
5. L'agent SOC (vous) clique sur **Exiger OTP**.
6. La PWA sur le téléphone affiche instantanément l'overlay de fraude exigeant une validation.
7. Saisissez le code PIN (`1234`) sur la PWA et confirmez.
8. **Feedback Loop :** L'alerte disparaît automatiquement du SOC Dashboard, l'interface affiche "Transaction Validée", et la PWA redirige vers l'accueil bancaire mis à jour en temps réel.
