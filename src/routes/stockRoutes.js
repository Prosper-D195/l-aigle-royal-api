const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route publique : la vitrine ou l'équipe peut consulter l'état des stocks
router.get('/', stockController.getAllStock);

// Routes protégées : Seul l'administrateur connecté peut modifier l'inventaire
router.post('/', authMiddleware, stockController.createStockItem);
router.put('/:id', authMiddleware, stockController.updateStockItem);

module.exports = router;