document.getElementById("produtoForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

  const codigo = document.getElementById("codigo").value;
  const nome = document.getElementById("nome").value;
  const categoria = document.getElementById("categoria").value;
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const dataHora = new Date().toLocaleString();

  const indexExistente = produtos.findIndex(prod => prod.codigo === codigo);

  if (indexExistente !== -1) {
    Swal.fire({
      title: "Produto já cadastrado",
      text: "Deseja adicionar essa quantidade ao produto existente?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim, adicionar",
      cancelButtonText: "Não, cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        produtos[indexExistente].quantidade += quantidade;
        produtos[indexExistente].dataHora = dataHora;

// Registrar movimentação - entrada (produto existente)
const movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || [];
movimentacoes.push({
  tipo: "entrada",
  codigoProduto: codigo,
  nomeProduto: produtos[indexExistente].nome,
  quantidade: quantidade,
  motivo: "Adição ao estoque existente",
  observacoes: "",
  usuario: localStorage.getItem("usuario"),
  dataHora: dataHora
});
localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
localStorage.setItem("produtos", JSON.stringify(produtos));

// Registrar movimentação - entrada (novo produto)
movimentacoes.push({
  tipo: "entrada",
  codigoProduto: codigo,
  nomeProduto: nome,
  quantidade: quantidade,
  motivo: "Cadastro de novo produto",
  observacoes: "",
  usuario: localStorage.getItem("usuario"),
  dataHora: dataHora
});
localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
        Swal.fire("Atualizado!", "Quantidade adicionada com sucesso.", "success").then(() => {
          window.location.href = "listaProduto.html";
        });
      } else {
        Swal.fire("Cancelado", "O cadastro foi cancelado.", "info");
      }
    });
    return;
  }

  const nomeDuplicado = produtos.some(prod => prod.nome.toLowerCase() === nome.toLowerCase());
  if (nomeDuplicado) {
    Swal.fire("Erro", "Já existe um produto com esse nome!", "error");
    return;
  }

  const novoProduto = { codigo, nome, categoria, quantidade, dataHora };
  produtos.push(novoProduto);

  localStorage.setItem("produtos", JSON.stringify(produtos));

// Registrar movimentação - entrada (novo produto)
const movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || [];
movimentacoes.push({
  tipo: "entrada",
  codigoProduto: codigo,
  nomeProduto: nome,
  quantidade: quantidade,
  motivo: "Cadastro de novo produto",
  observacoes: "",
  usuario: localStorage.getItem("usuario"),
  dataHora: dataHora
});
localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));
  Swal.fire("Sucesso", "Produto cadastrado com sucesso!", "success").then(() => {
    window.location.href = "listaProduto.html";
  });
});