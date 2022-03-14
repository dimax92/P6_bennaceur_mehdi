const express = require("express");
const Sauce = require('../models/sauce');
const Utilisateur = require('../models/utilisateur');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const fs = require('fs');
const MaskData = require('maskdata');
const emailValidator = require("email-validator");
const passwordValidator = require('password-validator');

  //GET sauces
  exports.findSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  };
  //GET sauce specifique
  exports.findOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  };
  //POST sauces
  exports.saveSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
      ...sauceObject,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ 
        message: 'Sauce enregistré !'
      }))
      .catch(error => res.status(400).json({ 
        message: 'Erreur'
       }));
  };
  //PUT sauce
  exports.updateOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            const sauceObject = req.file ? 
            {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : { ...req.body };
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce modifie"}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(403).json({ error }));
  };
  //DELETE sauce
  exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(403).json({ error }));
  };
  //POST like
  exports.likeSauce = (req, res, next) => {
    if(req.body.like===1){
      Sauce.updateOne({ _id: req.params.id }, { $push: {usersLiked:req.body.userId}, _id: req.params.id })
      .then(() => { 
        Sauce.findOne({_id: req.params.id})
        .then(sauce => {
          Sauce.updateOne({_id:req.params.id}, {likes: sauce.usersLiked.length, dislikes: sauce.usersDisliked.length, _id: req.params.id})
          .then(()=>res.status(200).json({ message: 'Like envoye !'}))
          .catch(error => res.status(402).json({error}))
        })
      })
      .catch(error => res.status(400).json({ error }));
    }
    if(req.body.like===0){
      Sauce.updateOne({ _id: req.params.id }, { $pull: {usersLiked:req.body.userId, usersDisliked:req.body.userId}, _id: req.params.id })
      .then(() => { 
        Sauce.findOne({_id: req.params.id})
        .then(sauce => {
          Sauce.updateOne({_id:req.params.id}, {likes: sauce.usersLiked.length, dislikes: sauce.usersDisliked.length, _id: req.params.id})
          .then(()=>res.status(200).json({ message: 'Like ou dislike supprime !'}))
          .catch(error => res.status(402).json({error}))
        })
        .catch(error => res.status(402).json({error}))
      })
      .catch(error => res.status(400).json({ error }));
    }
    if(req.body.like===-1){
      Sauce.updateOne({ _id: req.params.id }, { $push: {usersDisliked:req.body.userId}, _id: req.params.id })
      .then(() => { 
        Sauce.findOne({_id: req.params.id})
        .then(sauce => {
          Sauce.updateOne({_id:req.params.id}, {likes: sauce.usersLiked.length, dislikes: sauce.usersDisliked.length, _id: req.params.id})
          .then(()=>res.status(200).json({ message: 'Dislike envoye !'}))
          .catch(error => res.status(402).json({error}))
        })
        .catch(error => res.status(402).json({error}))
      })
      .catch(error => res.status(400).json({ error }));
    }
  };
