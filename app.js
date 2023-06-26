// Importation du framework Express
const express = require("express");
// Importation de la bibliothèque mongoose permettant de se connecter et intéragir avec mongoDb
const mongoose = require("mongoose");
require("dotenv").config(); // Charge les variables d'environnement du fichier .env
const helmet = require("helmet");
const mongoSanitize = require("mongo-sanitize");

// Importation des routes pour les livres
const booksRoutes = require("./routes/books");
// Importation des routes pour les utilisateurs
const userRoutes = require("./routes/user");
// Importation du module path intégré à Node.js, utilisé pour gérer les chemins d'accès aux fichiers
const path = require("path");

// Connexion avec la base de données mongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Objet app créé en utilisant express()
// Il représente l'application Express qui sera utilisée pour gérer les requêtes HTTP
const app = express();

// Middleware analysant les corps des requêtes HTTP au format JSON
app.use(express.json());
// Middleware analysant les corps des requêtes avec le format d'encodage URL
app.use(express.urlencoded({ extended: true }));

// Gestion des erreurs CORS
app.use((req, res, next) => {
  // pour toutes les req entrantes
  res.setHeader("Access-Control-Allow-Origin", "*"); // autorise l'accès depuis toutes les origines
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); // les entêtes qui peuvent être inclues dans la req
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); // methodes http autorisées dans l'application
  next();
});

// Middleware Helmet pour sécuriser les en-têtes HTTP
app.use(helmet());

// Middleware pour nettoyer les données provenant des requêtes
app.use((req, res, next) => {
  // Nettoie les données d'éventuelles opérations d'injection
  mongoSanitize(req.body);
  mongoSanitize(req.params);
  mongoSanitize(req.query);
  next();
});

// Middleware pour servir les fichiers statiques (images)
// Chemin d'accès spécifié pour joindre le chemin actuel avec le répertoire "images"
app.use("/images", express.static(path.join(__dirname, "images")));
// Les routes pour les livres et les utilisateurs sont montées sur l'application Express
app.use("/api/books", booksRoutes);
app.use("/api/auth", userRoutes);

// l'objet app est exporté en tant que module, permettant à d'autres fichiers de l'importer et de l'utiliser comme une application Express.
module.exports = app;
