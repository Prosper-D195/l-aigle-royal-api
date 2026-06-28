const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Récupérer le token depuis l'en-tête Authorization
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ error: "Accès refusé. Aucun jeton fourni." });
  }

  // Extraire le token (enlever le mot "Bearer ")
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Format du jeton invalide (doit être 'Bearer <token>')." });
  }

  try {
    // Vérifier et décoder le jeton
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ajouter les infos de l'utilisateur décodé à l'objet de la requête
    req.user = decoded;
    
    // Passer au contrôleur suivant
    next();
  } catch (error) {
    res.status(400).json({ error: "Jeton invalide ou expiré." });
  }
};