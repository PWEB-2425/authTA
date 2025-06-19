// Quando a página estiver totalmente carregada, chama a função de inicialização
document.addEventListener('DOMContentLoaded', inicializarPesquisa);

// Função que associa o evento de submissão ao formulário de pesquisa
function inicializarPesquisa() {
  const form = document.getElementById('formPesquisa');
  form.addEventListener('submit', aoSubmeterPesquisa);
}

// Função chamada quando o formulário é submetido
async function aoSubmeterPesquisa(e) {
  e.preventDefault(); // Impede o comportamento padrão do formulário (recarregar a página)
  const input = document.getElementById('conceito');
  const conceito = input.value.trim(); // Obtém o texto introduzido e remove espaços
  if (!conceito) return; // Se estiver vazio, não faz nada

  await pesquisarImagens(conceito); // Chama a função para pesquisar imagens
}

// Função que faz o pedido à API e mostra as imagens
async function pesquisarImagens(conceito) {
  const divImagens = document.getElementById('imagens');
  divImagens.innerHTML = ''; // Limpa resultados anteriores
  try {
    // Faz o pedido à rota do servidor
    const resposta = await fetch(`/pesquisa/${encodeURIComponent(conceito)}`);
    const imagens = await resposta.json(); // Converte a resposta em JSON

    // Se não houver imagens, mostra mensagem
    if (!Array.isArray(imagens) || imagens.length === 0) {
      divImagens.textContent = 'Nenhuma imagem encontrada.';
      return;
    }

    // Para cada imagem recebida, cria e adiciona ao ecrã
    imagens.forEach(img => {
      const div = criaContentorImagens(img);
      divImagens.appendChild(div);
    });
  } catch (error) {
    // Se houver erro, mostra mensagem
    divImagens.textContent = 'Erro ao obter imagens.';
    console.error(error);
  }
}

// Função que cria o contentor HTML para cada imagem
function criaContentorImagens(img) {
  const div = document.createElement('div');
  div.className = 'img-container';

  const link = document.createElement('a');
  link.href = img.largeImageURL; // Link para imagem grande
  link.target = '_blank'; // Abre em nova aba

  const imagem = document.createElement('img');
  imagem.src = img.webformatURL; // Mostra imagem pequena
  imagem.alt = 'Imagem';

  link.appendChild(imagem); // Coloca a imagem dentro do link
  div.appendChild(link);    // Coloca o link dentro do contentor

  return div; // Devolve o contentor pronto a ser usado
}