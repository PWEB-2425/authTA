const express = require('express');
const session = require("express-session");
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');

// parse do ficheiro ".env" 
dotenv.config();

console.log(process.env.SECRET);

const app = new express();

app.use(session({ secret: process.env.SECRET || "12345" }));
app.use(express.urlencoded());

//app.use(cookieParser());


app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    const user = await usersCollection.findOne({ username });
    if (user && user.password === password) {
        req.session.username = username;
        //res.cookie('username',username, { maxAge: 900000, httpOnly: true });
        res.send("ok");
    } else {
        res.send("error");
    }
})
app.use(express.static('public'));

// simula bd com users e passwords
//let users = {
//    user1: "password1",
//    user2: "password2"
//}

app.get('/', (req, res) => {
    res.send("olá");
});

app.get('/protegido', estaAutenticado, (req, res) => {
        res.send("olá " + username);
});

// middleware de autenticacao
function estaAutenticado(req, res, next) {
    const username = req.session.username;
    if (username) {
        next();
    } else {
        res.redirect('/login.html')
    }
}

// rota que usa middleware
app.get('/segredo', estaAutenticado, (req, res) => {
    res.send("qualqeur coisa")
});

app.post('/login',  async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    const user = await usersCollection.findOne({ username });
    if (user && user.password === password) {
        req.session.username = username;
        res.send("ok");
    } else {
        res.redirect('/');
    }
});

const client = new MongoClient(process.env.MONGOURI);



// global vars to store db connecction
let usersCollection;
let db;

async function startServer() {
    await client.connect();
    const db = client.db('usersdb');
    usersCollection = db.collection('users');
    console.log('MongoDB ligado');
    app.listen(process.env.PORT || 3000, () => console.log('servidor na porta '+ process.env.PORT || 3000));
  }
  
startServer();
