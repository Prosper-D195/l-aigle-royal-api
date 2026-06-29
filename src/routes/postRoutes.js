const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController'); // 1. On importe le contrôleur des commentaires
const authMiddleware = require('../middlewares/authMiddleware');

// Routes publiques (Lecture)
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.get('/:id/comments', commentController.getCommentsByPost); // 2. NOUVELLE ROUTE PUBLIQUE POUR LES COMMENTAIRES

// Routes protégées (Écriture / Modification / Suppression)
router.post('/', authMiddleware, postController.createPost);
router.put('/:id', authMiddleware, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);

module.exports = router;