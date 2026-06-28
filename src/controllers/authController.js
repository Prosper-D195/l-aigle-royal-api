const prisma = require('../prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Inscription (Utile pour créer ton premier compte administrateur)
exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (userExists) {
      return res.status(400).json({ error: "L'email ou le nom d'utilisateur est déjà utilisé." });
    }

    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Création de l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword
      }
    });

    res.status(201).json({ message: "Compte créé avec succès !" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'inscription : " + error.message });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Rechercher l'utilisateur
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Identifiants invalides." });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Identifiants invalides." });
    }

    // Générer le jeton JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Le jeton reste valide 24 heures
    );

    res.json({
      message: "Connexion réussie !",
      token: `Bearer ${token}`,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la connexion : " + error.message });
  }
};