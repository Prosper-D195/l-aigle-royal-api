const prisma = require('../prisma');

// 1. Récupérer TOUS les articles (Public)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        _count: {
          select: { comments: true } // Renvoie le nombre de commentaires sans charger tout le détail
        }
      },
      orderBy: { createdAt: 'desc' } // Du plus récent au plus ancien
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des notes : " + error.message });
  }
};

// 2. Récupérer un article UNIQUE avec ses commentaires (Public)
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    // Gestion d'un ID mal formaté avant de requêter Prisma
    if (!id || id.length < 10) {
      return res.status(400).json({ error: "Identifiant de la note technique invalide." });
    }
    
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ error: "Note technique introuvable." });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération de la note : " + error.message });
  }
};

// 3. Créer un article (Sécurisé - Publication directe forcée)
exports.createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Le titre et le contenu sont requis." });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        category: category || "GENERAL",
        published: true, // 👈 CORRECTION : Assure la visibilité immédiate sur le site public
        authorId: req.user.id // Injecté par le middleware d'authentification
      }
    });

    res.status(201).json({ message: "Note de culture enregistrée !", post: newPost });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de la note : " + error.message });
  }
};

// 4. Modifier un article (Sécurisé - Auteur uniquement)
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, published } = req.body;

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: "Note technique introuvable." });
    }

    // Sécurité : Vérification que l'utilisateur connecté est bien l'auteur
    if (post.authorId !== req.user.id) {
      return res.status(403).json({ error: "Action non autorisée. Vous n'êtes pas l'auteur de cette note." });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { title, content, category, published }
    });

    res.json({ message: "Note technique mise à jour !", post: updatedPost });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour : " + error.message });
  }
};

// 5. Supprimer un article (Sécurisé - Auteur uniquement)
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: "Note technique introuvable." });
    }

    // Sécurité : Vérification que l'utilisateur connecté est bien l'auteur
    if (post.authorId !== req.user.id) {
      return res.status(403).json({ error: "Action non autorisée. Vous n'êtes pas l'auteur de cette note." });
    }

    // On supprime d'abord les commentaires associés pour éviter les erreurs de clé étrangère
    await prisma.comment.deleteMany({ where: { postId: id } });
    
    // Puis on supprime l'article
    await prisma.post.delete({ where: { id } });

    res.json({ message: "La note technique et ses commentaires ont été supprimés." });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression : " + error.message });
  }
};