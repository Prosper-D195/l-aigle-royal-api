const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Toutes les routes de commentaires sont protégées
router.post('/', authMiddleware, commentController.createComment);
router.delete('/:id', authMiddleware, commentController.deleteComment);

module.exports = router;