# Autenticação

- usa mongo
- usa sessoes
- usa middleware
- usa dotenv

## Atencao

- tem que existir uma BD mongo

com uma bd `usersdb`e uma colecao `users` com documentos do tipo

```json
{
  "username": "frederico",
  "password": "scpcampeao"
}
```

- tem que existir um ficheiro `.env``

```.env
SECRET = "12345"
PORT = 3000
MONGOURI = <string connect do mongo>
```
