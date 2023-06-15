const express = require("express");
const router = express.Router();
const booksCtrl = require("../controllers/books");

const auth = require("../middleware/auth");
const sharpMulter = require("../middleware/image-config");

router.get("/bestrating", booksCtrl.getBestRatedBooks);
router.post("/", auth, sharpMulter, booksCtrl.createBook);
router.get("/", booksCtrl.getAllBooks);
router.get("/:id", booksCtrl.getOneBook);
router.post("/:id/rating", auth, booksCtrl.createRating);
router.put("/:id", auth, sharpMulter, booksCtrl.modifyBook);
router.delete("/:id", auth, booksCtrl.deleteBook);

module.exports = router;
