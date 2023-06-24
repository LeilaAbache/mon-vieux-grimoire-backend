//Importation du package HTTP natif de node pour créer serveur
const http = require("http");
// Importation du module app contenant la logique de l'application serveur
const app = require("./app");

//La fonction normalizePort renvoie un port valide (sous forme de numero ou de chaine)
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

//La fonction errorHandler recherche les erreurs et les gère de manière appropriée
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};
// Un serveur HTTP est créé en utilisant la méthode createServer du module http,
// en passant l'objet app comme argument. Cela lie l'application à ce serveur.
const server = http.createServer(app);

// Des gestionnaires d'événements sont définis pour le serveur

// L'événement "error" est associé à la fonction errorHandler, qui est appelée en cas d'erreur
server.on("error", errorHandler);
// L'événement "listening" est associé à une fonction anonyme qui affiche un message indiquant sur quel port le serveur écoute
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// Le serveur est mis en écoute sur le port spécifié à l'aide de la méthode listen.
// Cela démarre le serveur et le met en attente de requêtes entrantes.
server.listen(port);
