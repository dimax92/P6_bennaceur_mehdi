const express = require("express");
const Sauce = require('../models/sauce');
const Utilisateur = require('../models/utilisateur');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const MaskData = require('maskdata');
const emailValidator = require("email-validator");
const passwordValidator = require('password-validator');

exports.signUp = (req, res, next) => {
  const schemaPassword = new passwordValidator();

  schemaPassword
  .is().min(8)                                    
  .is().max(100)                                  
  .has().uppercase()                              
  .has().lowercase()                              
  .has().digits(1)   
  .has().symbols(1)                             

  if(schemaPassword.validate(req.body.password) && emailValidator.validate(req.body.email)){
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const utilisateur = new Utilisateur({
        email: req.body.email,
        password: hash
      });
      utilisateur.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  }else{
    res.status(501).json({ message: "mot de passe ou email incorrect"});
  }
  };
  //POST login
  exports.login = (req, res, next) => {
    Utilisateur.findOne({ email: req.body.email })
      .then(utilisateur => {
        if (!utilisateur) {
          return res.status(401).json({ message: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, utilisateur.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ message: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: utilisateur._id,
              token: jwt.sign(
                { userId: utilisateur._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };