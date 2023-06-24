const express = require("express");
// Création d'un routeur Express pour y enregistrer toutes les routes
const router = express.Router();
// Importation du module booksCtrl, contenant les fonctions de contrôleur pour gérer les différentes actions liées aux livres.
const booksCtrl = require("../controllers/books");
// Importation du module auth, contenant le middleware d'authentification pour sécuriser certaines routes
const auth = require("../middleware/auth");
// Importation du module sharpMulter, contenant le middleware de configuration pour le téléchargement d'images
const sharpMulter = require("../middleware/image-config");

// Les routes demandées sont créées à l'aide des méthodes du routeur
// Chaque route est associée à une fonction de contrôleur spécifique
router.get("/bestrating", booksCtrl.getBestRatedBooks);
router.post("/", auth, sharpMulter, booksCtrl.createBook);
router.get("/", booksCtrl.getAllBooks);
router.get("/:id", booksCtrl.getOneBook);
router.post("/:id/rating", auth, booksCtrl.createRating);
router.put("/:id", auth, sharpMulter, booksCtrl.modifyBook);
router.delete("/:id", auth, booksCtrl.deleteBook);

// l'objet router est exporté en tant que module, permettant à d'autres fichiers de l'importer
// et de l'utiliser pour gérer les routes associées aux livres dans l'application Express.
module.exports = router;
