const multer = require("multer");
const sharpMulter = require("sharp-multer");

// Objet définissant les types MIME des images acceptées et les extensions de fichiers correspondantes
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const storage = sharpMulter({
  // middleware personnalisé fournie par multer
  destination: (req, file, callback) => {
    // les fichiers téléchargés sont enregistrés dans le dossier "images"
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    // génère le nom de fichier pour chaque fichier téléchargé
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
  imageOptions: {
    // options de traitement de l'image
    fileFormat: "webp",
    quality: 80,
    resize: { width: 500, height: 700 },
  },
});

// le module multer est exporté en tant que middleware pour le téléchargement d'un seul fichier (single) avec la configuration de stockage spécifiée
module.exports = multer({ storage: storage }).single("image");
