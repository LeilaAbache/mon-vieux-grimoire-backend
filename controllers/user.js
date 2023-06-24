const bcrypt = require("bcrypt");
// Package pour créer et vérifier les tokens
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// -- Middlewares d'authentification des utilisateurs -- //

// Enregistrer un nouvel utilisateur dans la db
exports.signup = (req, res, next) => {
  bcrypt
    // hash et sale le mot de passe
    .hash(req.body.password, 10)
    .then((hash) => {
      // renvoie le hash généré
      // création d'un utilisateur
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        // enregistre l'utilisateur dans la db
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  // vérifie que l'email existe dans la db
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        res
          .status(401)
          .json({ message: "Paire identifiant/mot de passe incorrecte !" });
      } else {
        bcrypt
          // compare le mdp entré avec le hash enregistré
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              res.status(401).json({
                message: "Paire identifiant/mot de passe incorrecte !",
              });
            } else {
              res.status(200).json({
                // si valide, renvoie id utilisateur et token
                userId: user._id,
                // la fonction sign() chiffre un nouveau token qui contient l'id du user
                token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                  expiresIn: "4h",
                }),
              });
            }
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
