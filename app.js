// Importa módulos necessários
const express = require('express');
const session = require("express-session");
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');


// Carrega variáveis de ambiente do ficheiro .env
dotenv.config();

console.log(process.env.SECRET); // Mostra a chave secreta no terminal (apenas para testes)

// Cria a aplicação Express
const app = express();

// Configuração da sessão para guardar dados do utilizador entre pedidos
app.use(session({
    secret: process.env.SECRET || "12345", // Chave secreta para assinar a sessão
    resave: false,                        // Não guarda a sessão se não houver alterações
    saveUninitialized: false,             // Não cria sessões vazias
    cookie: { secure: false }             // true só se usar HTTPS
}));

// Permite ler dados enviados em formulários (POST)
app.use(express.urlencoded({ extended: true }));

// Servir ficheiros estáticos da pasta 'public' (ex: HTML, CSS, JS)
app.use(express.static('public'));

// Variáveis globais para ligação à base de dados
let usersCollection;
let db;

// Middleware para verificar se o utilizador está autenticado
function estaAutenticado(req, res, next) {
    if (req.session.username) {
        next(); // Se estiver autenticado, continua
    } else {
        res.redirect('/login.html'); // Se não, redireciona para o login
    }
}

// Rota principal (página inicial)
app.get('/', (req, res) => {
    res.send("olá");
});

// Rota protegida, só acessível a utilizadores autenticados
app.get('/protegido', estaAutenticado, (req, res) => {
    res.send("olá " + req.session.username); // Mostra o nome do utilizador autenticado
});

// Rota de login (POST) - verifica credenciais e cria sessão
app.post('/login', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);
    const user = await usersCollection.findOne({ username });
    if (user && user.password === password) {
        req.session.username = username; // Guarda o username na sessão
        res.redirect('/pesquisa.html'); // Redireciona para a página de pesquisa
    } else {
        res.send("error"); // Credenciais erradas
    }
});

// Rota para pesquisa de imagens (usa API do Pixabay)
// Só acessível a utilizadores autenticados
app.get('/pesquisa/:conceito', estaAutenticado, async (req, res) => {
    let conceito = req.params.conceito;
    console.log(conceito);
    if (!conceito) {
        return res.status(400).json({ error: 'parâmetro "conceito" é obrigatório.' });
    }
    // Monta o URL para a API do Pixabay
    const url = `https://pixabay.com/api/?key=${process.env.PIXABAYKEY}&q=${encodeURIComponent(conceito)}&image_type=photo&per_page=4`;
    try {
        const resultado = await fetch(url);
        const dados = await resultado.json();
        // Extrai apenas os dados relevantes das imagens
        const photos = dados.hits.map(hit => ({
            id: hit.id,
            webformatURL: hit.webformatURL,
            largeImageURL: hit.largeImageURL
        }));
        res.json(photos); // Envia as imagens para o frontend
    } catch (err) {
        res.status(500).json({ error: 'Erro ao obter imagens.' });
    }
});

// Exemplo de outra rota protegida
app.get('/segredo', estaAutenticado, (req, res) => {
    res.send("qualquer coisa");
});

// Protege o acesso à página pesquisa.html (só autenticados)
app.get('/pesquisa.html', estaAutenticado, (req, res) => {
    res.sendFile(__dirname + '/public/pesquisa.html');
});

// Ligação à base de dados MongoDB
const client = new MongoClient(process.env.MONGOURI);

// Função para ligar à base de dados e arrancar o servidor
async function startServer() {
    try {
        await client.connect(); // Liga ao MongoDB
        db = client.db('usersdb'); // Seleciona a base de dados
        usersCollection = db.collection('users'); // Seleciona a coleção de utilizadores
        // Arranca o servidor na porta definida no .env ou 3000 por defeito
        app.listen(process.env.PORT || 3000, () => 
            console.log('servidor na porta ' + (process.env.PORT || 3000))
        );
    } catch (error) {
        console.log("Erro ao ligar à base de dados: " + error);
    }
}

// Chama a função para arrancar o servidor
startServer();