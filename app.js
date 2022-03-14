const express = require('express');
const helmet = require("helmet");
const bodyParser = require('body-parser');
const dotEnv = require('dotenv').config();
const mongoose = require("mongoose");
const path = require('path');
const app = express();
const apiRoutesSauce = require("./routes/sauce");
const apiRoutesUtilisateur = require("./routes/utilisateur");
const rateLimit = require('express-rate-limit');

//Connexion base de donnee
const dbName = process.env.DB_NAME;
const dbPassword = process.env.DB_PASSWORD;
const dbUser = process.env.DB_USER;

mongoose.connect('mongodb+srv://'+dbUser+':'+dbPassword+'@cluster0.dnds8.mongodb.net/'+dbName+'?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Express-rate-limit
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
});

app.use(limiter);

//CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next()
  });
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use("/api/auth", apiRoutesUtilisateur);
app.use("/api/sauces", apiRoutesSauce);

app.use(helmet());

module.exports = app;