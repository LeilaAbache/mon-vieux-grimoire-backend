// Importation du modèle "Book" mongoose
const Book = require("../models/Book");
// Importation du module "fs" système de fichiers pour effectuer des opérations de lecture et d'écriture sur les fichiers
const fs = require("fs");

// -- Middlewares des routes books -- //

exports.createBook = (req, res, next) => {
  // Extrait l'objet du livre du corps de la requête avec json.parse
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  // Un nouvel objet book est créé en utilisant le modèle Book
  const book = new Book({
    // Les propriétés de bookObject sont copiées dans book
    ...bookObject,
    // Les propriétés userId et imageUrl sont ajoutées à l'objet book
    // userId est défini sur l'ID de l'utilisateur authentifié
    userId: req.auth.userId,
    // imageUrl est construit en utilisant le protocole, le nom d'hôte et le nom de fichier de l'image téléchargée
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    // La propriété averageRating de book est définie sur la note moyenne du livre, qui est extraite de la première évaluation du livre
    averageRating: bookObject.ratings[0].grade,
  });
  book
    .save() // Enregistre le book dans la db
    .then(() => {
      res.status(201).json({ message: "Livre enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modifyBook = (req, res, next) => {
  // Vérifie si fichier téléchargé dans la requête
  const bookObject = req.file
    ? {
        // Si oui, un nouvel objet est créé en copiant les propriétés de l'objet book dans req.body
        ...JSON.parse(req.body.book),
        // L'URL de l'image est construite en utilisant le protocole, le nom d'hôte et le nom de fichier de l'image téléchargée
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : // Si non, l'objet est créé en copiant les propriétés de l'objet req.body.
      { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id }) // trouver le livre correspondant à l'ID spécifié dans req.params.id
    .then((book) => {
      // vérifie si l'ID de l'utilisateur associé au livre correspond à l'ID de l'utilisateur authentifié
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        // Si oui, met à jour le livre correspondant à l'ID spécifié.
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Livre modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  // Recherche le livre correspondant à l'ID spécifié dans req.params.id
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Vérifie si l'ID de l'utilisateur associé au livre correspond à l'ID de l'utilisateur authentifié
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        // la méthode split() extrait le nom de fichier de l'image du livre
        const filename = book.imageUrl.split("/images/")[1];
        // la fonction unlink() supprime le fichier d'image correspondant au livre
        fs.unlink(`images/${filename}`, () => {
          // la fonction deleteOne() supprime le livre de la db
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getOneBook = (req, res, next) => {
  // Recherche le livre correspondant à l'ID spécifié dans req.params.id
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
  // Récupère tous les livres présents dans la base de données
  Book.find()
    .then((books) => res.status(200).json(books)) // Renvoie un tableau json avec tous les livres trouvés
    .catch((error) => res.status(400).json({ error }));
};

exports.createRating = (req, res, next) => {
  // Recherche le livre correspondant à l'ID spécifié dans req.params.id
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Vérifie si l'utilisateur a déjà noté ce livre
      const existingRating = book.ratings.find(
        (r) => r.userId === req.auth.userId
      );
      if (existingRating) {
        // Si une note existe déjà pour cet utilisateur
        return res
          .status(400)
          .json({ message: "Vous avez déjà noté ce livre." });
      }

      // Ajoute nouvelle note au livre avec les informations fournies dans req.body.rating (ID de l'utilisateur et la note attribuée)
      book.ratings.push({ userId: req.auth.userId, grade: req.body.rating });

      // Met à jour la note moyenne
      let totalRatings = 0; // Nb total de notes
      let sumOfRatings = 0; // Somme des notes attribuées
      // Boucle parcourt chaque objet de note dans le tableau book.ratings.
      for (const ratingObj of book.ratings) {
        // A chaque itération de la boucle, totalRatings est incrémenté de 1 pour compter le nb total de notes
        totalRatings++;
        // La note (grade) de l'objet de note en cours est ajoutée à sumOfRatings pour calculer la somme totale des notes
        sumOfRatings += ratingObj.grade;
      }
      // Additionne toutes les notes et les divise par le nb total de notes
      book.averageRating = (sumOfRatings / totalRatings).toFixed(1);

      // Enregistre les modifications dans la db
      book
        .save()
        .then((savedBook) => {
          return res.status(201).json(savedBook);
        })
        .catch((error) => {
          return res.status(500).json({ error });
        });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};

exports.getBestRatedBooks = (req, res, next) => {
  // Récupère tous les livres de la db
  Book.find()
    // Tri des livres en fonction de leur note moyenne (ordre décroissant = note la plus élévée en premier)
    .sort({ averageRating: -1 })
    // Limite les résultats aux trois premiers livres de la liste triée
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};
