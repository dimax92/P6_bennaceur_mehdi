const express = require("express");
const router = express.Router();
const multer = require('../middleware/multer-config');
const authentification = require("../middleware/utilisateur");
const apiCtrlUtilisateur = require("../controllers/utilisateur");

router.post('/signup', apiCtrlUtilisateur.signUp);
  //POST login
router.post('/login', apiCtrlUtilisateur.login);

module.exports = router;