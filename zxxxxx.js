// Middleware para proteger rotas
function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.redirect('/login');
}

// Rotas
// GET /register
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// POST /register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await usersCollection.findOne({ username });
    if (existing) return res.status(400).send('Utilizador já existe');
    const result = await usersCollection.insertOne({ username, password });
    req.session.userId = result.insertedId;
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Erro no registo');
  }
});

// GET /login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// POST /login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await usersCollection.findOne({ username });
    if (user && user.password === password) {
      req.session.userId = user._id;
      return res.redirect('/dashboard');
    }
    res.status(401).send('Credenciais inválidas');
  } catch (err) {
    res.status(500).send('Erro no login');
  }
});

// GET /dashboard
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.send(`Bem-vindo, utilizador! <a href="/logout">Logout</a>`);
});

// GET /logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Erro no logout');
    res.redirect('/login');
  });
});

/*
 * views/register.html e views/login.html são formulários HTML simples:
 *
 * register.html:
 * <form method="POST" action="/register">
 *   <input name="username" placeholder="Username" required>
 *   <input name="password" type="password" placeholder="Password" required>
 *   <button type="submit">Registar</button>
 * </form>
 *
 * login.html:
 * <form method="POST" action="/login">
 *   <input name="username" placeholder="Username" required>
 *   <input name="password" type="password" placeholder="Password" required>
 *   <button type="submit">Login</button>
 * </form>
 */
