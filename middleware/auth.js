const jwt = require("jsonwebtoken");

// Middleware vérifie la connexion de l'utilisateur et transmet les infos de connexion aux methodes qui gérent les requêtes
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // extrait le token
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // décode le token
    const userId = decodedToken.userId; // extrait le user id
    req.auth = {
      // l'ajoute à la requête
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
