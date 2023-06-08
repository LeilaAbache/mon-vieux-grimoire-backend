const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose
  .connect(
    "mongodb+srv://leiladevw60:123456la@mon-vieux-grimoire.ljyb3fm.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.post("/api/books", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: "livre créé!",
  });
});

app.get("/api/books", (req, res, next) => {
  const books = [
    {
      _id: "oeihfzeoi",
      title: "Mon premier livre",
      description: "Les infos de mon premier livre",
      imageUrl:
        "https://cdn.pixabay.com/photo/2015/11/19/21/10/glasses-1052010_1280.jpg",
      price: 4900,
      userId: "qsomihvqios",
    },
    {
      _id: "oeihfzeoi",
      title: "Mon deuxième livre",
      description: "Les infos de mon premier livre",
      imageUrl:
        "https://cdn.pixabay.com/photo/2015/11/19/21/10/glasses-1052010_1280.jpg",
      price: 4900,
      userId: "qsomihvqios",
    },
  ];
  res.status(200).json(books);
});

module.exports = app;
