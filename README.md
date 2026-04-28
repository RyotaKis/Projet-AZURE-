# Projet AZURE+ : Système de Détection de Fraude Bancaire en Temps Réel

AZURE+ est un système distribué basé sur des microservices conçu pour la détection de fraude bancaire en temps réel. Il intègre une logique hybride (Règles Déterministes + Machine Learning), une architecture temps réel (WebSockets) et des interfaces de monitoring avancées.

## 🏗️ Architecture

Le système est composé des éléments suivants :

1.  **API Gateway** (`NestJS`) : Point d'entrée unique, routage, authentification JWT, WebSockets.
2.  **Transaction Service / Core Ledger** (`NestJS`) : Gestion des comptes et de l'historique des transactions.
3.  **Fraud Engine Service** (`Python FastAPI`) : Moteur de scoring de fraude (Règles + ML).
4.  **SOC Dashboard** (`React + Vite`) : Interface "War Room" pour les analystes.
5.  **Mobile PWA** (`React + Vite`) : Interface client simulée pour la boucle de validation.
6.  **Attack Simulator** (`React + Vite`) : Outil de génération de trafic et d'injection de fraude.
7.  **Infrastructure** : MariaDB (données), Redis (cache/sessions), RabbitMQ (messaging).

## 🚀 Démarrage Rapide

*Documentation en cours de rédaction.*
