# 🦅 L'AIGLE ROYAL - API

##L'AIGLE ROYAL 
Une application de gestion de prestige pour exploitation agricole. Ce back-end Node.js / Express gère l'authentification sécurisée, le cahier de suivi agronomique (notes de culture) et l'état des réserves d'intrants.

---

## 🏗️ Architecture du Système

L'écosystème complet de l'application est composé de 3 modules distincts :
1. **L'AIGLE ROYAL API (Ce projet)** : Hébergé sur **Railway**, connecté à une base de données PostgreSQL sur **Neon.tech**.
2. **Dashboard Admin (Front-end)** : Interface de gestion connectée à cette API, hébergée sur **Netlify**.
3. **Site Vitrine (Front-end)** : Site public de l'exploitation, hébergé sur **Netlify**.

---

## 🛠️ Technologies Utilisées

- **Runtime** : Node.js
- **Framework** : Express.js
- **Base de données** : PostgreSQL (Hébergé sur Neon Serverless Postgres)
- **Authentification** : JSON Web Tokens (JWT) & Bcrypt (Hachage des mots de passe)
- **Gestion des requêtes** : CORS, Body-parser

