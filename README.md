# Autenticação e Pesquisa de Imagens com Node.js, Express e MongoDB

## Descrição

Esta aplicação permite autenticação de utilizadores e pesquisa de imagens através da API do [Pixabay](https://pixabay.com/api/docs/). Apenas utilizadores autenticados podem aceder à pesquisa. Os dados dos utilizadores são guardados numa base de dados MongoDB.

---

## Requisitos

- **Node.js** versão 18 ou superior (para suporte nativo a `fetch`)
- **MongoDB** (local ou Atlas)
- Conta gratuita no [Pixabay](https://pixabay.com/api/docs/) para obter uma chave de API

---

## Instalação

1. **Clone o repositório:**

   ```bash
   git clone <url-do-repo>
   cd <nome-da-pasta>
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   Crie um ficheiro `.env` na raiz do projeto com o seguinte conteúdo:

   ```
   SECRET=sua_chave_secreta
   MONGOURI=a_sua_conection_string
   PORT=3000
   PIXABAYKEY=sua_chave_pixabay
   ```

   - **SECRET:** Chave secreta para sessões.
   - **MONGOURI:** URI da sua base de dados MongoDB.
   - **PORT:** Porta onde o servidor irá correr (opcional, por defeito 3000).
   - **PIXABAYKEY:** A sua chave de API do Pixabay.

4. **Prepare a base de dados:**

   - Crie uma base de dados chamada `usersdb` e uma coleção chamada `users`.
   - Insira pelo menos um utilizador para testes, por exemplo:

     ```js
     // No MongoDB shell ou Compass:
     db.users.insertOne({ username: "user1", password: "password1" });
     ```

---

## Como correr a aplicação

```bash
node app.js
```

Aceda a [http://localhost:3000](http://localhost:3000) no seu browser.

---

## Utilização

1. Faça login em `/login.html` com um utilizador existente.
2. Após login, aceda a `/pesquisa.html` para pesquisar imagens.
3. Apenas utilizadores autenticados podem aceder à pesquisa.

---

## Possíveis Melhorias

- **Hash das passwords:** Guardar passwords de forma segura usando bcrypt.
- **Validação de formulários:** Melhorar validação no frontend e backend.
- **Mensagens de erro:** Apresentar mensagens de erro mais detalhadas ao utilizador.
- **Logout:** Implementar funcionalidade de logout.
- **Registo de utilizadores:** Permitir criação de novos utilizadores via interface.
- **Limitar tentativas de login:** Para maior segurança.
- **HTTPS:** Usar HTTPS em produção.
- **Paginação de resultados:** Permitir ver mais imagens por pesquisa.

---

## Notas

- O projeto foi desenvolvido para fins didáticos.
- Não use em produção sem as melhorias de segurança
