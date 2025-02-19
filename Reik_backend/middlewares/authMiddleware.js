const jwt = require('jsonwebtoken');
const SECRET_KEY = 'supersecretkey'; // Remplace par une vraie clé secrète !

const authMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Vérifier la présence du token dans les headers
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Accès refusé : Token manquant" });

      // Vérifier et décoder le token
      const decoded = jwt.verify(token, SECRET_KEY);

      // Vérifier si l'utilisateur a un rôle autorisé
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Accès interdit : Permission refusée" });
      }

      // Ajouter l'utilisateur à la requête pour l'utiliser dans les routes
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token invalide", error });
    }
  };
};

module.exports = authMiddleware;
