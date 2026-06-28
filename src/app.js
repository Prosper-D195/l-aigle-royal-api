require('dotenv').config();
const express = require('express');
const cors = require('cors');
const prisma = require('./prisma'); // Importation propre de l'instance isolée

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globaux
// Configuration explicite de CORS pour autoriser la Vitrine, le Dashboard local, Netlify et le nouveau Site Vitrine
app.use(cors({
  origin: [
    'http://localhost:3000',                            // Port du site vitrine local
    'http://localhost:5173',                            // Port du Dashboard Administrateur local
    'https://espace-admin-explo-griocole.netlify.app',   //  Le Dashboard Administrateur en ligne sur Netlify
    'https://prestige-agricole.netlify.app'             // Le Site Vitrine en ligne sur Netlify
  ],
  credentials: true
}));

app.use(express.json());

// Import et utilisation des routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const stockRoutes = require('./routes/stockRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/stock', stockRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Bienvenue sur l'API de L'AIGLE ROYAL - Spécialité Agrobusiness" });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur actif sur : http://localhost:${PORT}`);
});

module.exports = { app, prisma };