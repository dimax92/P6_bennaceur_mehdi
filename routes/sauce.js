const express = require("express");
const router = express.Router();
const multer = require('../middleware/multer-config');
const authentification = require("../middleware/utilisateur");
const apiCtrl = require("../controllers/sauce");

  //GET sauces
router.get('', authentification, apiCtrl.findSauces);
  //GET sauce specifique
router.get('/:id', authentification, apiCtrl.findOneSauce);
  //POST sauces
router.post('', authentification, multer, apiCtrl.saveSauce);
  //PUT sauce
router.put('/:id', authentification, multer, apiCtrl.updateOneSauce);
  //DELETE sauce
router.delete('/:id', authentification, apiCtrl.deleteOneSauce);
  //POST like
router.post('/:id/like', authentification, apiCtrl.likeSauce);

module.exports = router;