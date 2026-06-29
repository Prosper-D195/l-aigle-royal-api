const prisma = require('../prisma');

// 1. Ajouter un commentaire sur un article (Sécurisé)
exports.createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;

    if (!content || !postId) {
      return res.status(400).json({ error: "Le contenu et l'ID de l'article sont requis." });
    }

    // 1. Aller chercher l'utilisateur en BDD pour récupérer ses infos
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }

    // 2. Créer le commentaire avec uniquement les champs acceptés par ton schéma Prisma
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorName: user.username, 
        email: user.email          
      }
    });

    res.status(201).json({ message: "Commentaire ajouté avec succès !", comment: newComment });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout du commentaire : " + error.message });
  }
};

// 2. Supprimer un commentaire (Sécurisé)
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ error: "Commentaire introuvable." });

    // On récupère l'utilisateur actuel pour vérifier si c'est lui l'auteur
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user || comment.email !== user.email) {
      return res.status(403).json({ error: "Action non autorisée. Vous n'êtes pas l'auteur de ce commentaire." });
    }

    await prisma.comment.delete({ where: { id } });
    res.json({ message: "Le commentaire a été supprimé." });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression : " + error.message });
  }
};

// 3. Récupérer les commentaires d'une note (Public - Pour la vitrine)
exports.getCommentsByPost = async (req, res) => {
  try {
    const { id } = req.params; // L'ID du post passe par l'URL (:id/comments)

    const comments = await prisma.comment.findMany({
      where: { postId: id },
      orderBy: { createdAt: 'asc' } // Les plus anciens d'abord pour suivre le fil de discussion
    });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des commentaires : " + error.message });
  }
};