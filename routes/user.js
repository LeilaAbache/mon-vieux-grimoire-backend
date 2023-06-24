const express = require("express");
const router = express.Router();
// Importation du module userCtrl, contenant les fonctions de contrôleur pour gérer les différentes actions liées à l'authentification
const userCtrl = require("../controllers/user");

// Les routes demandées sont créées à l'aide des méthodes du routeur
// Chaque route est associée à une fonction de contrôleur spécifique
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

// L'objet router est exporté en tant que module, permettant à d'autres fichiers de l'importer
// et de l'utiliser pour gérer les routes associées à l'authentification dans l'application Express.
module.exports = router;
