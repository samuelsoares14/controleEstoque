
document.addEventListener("DOMContentLoaded", () => {
  const produto = JSON.parse(localStorage.getItem("produtoParaEditar"));

  if (produto) {
    document.getElementById("codigo").value = produto.codigo;
    document.getElementById("nome").value = produto.nome;
    document.getElementById("categoria").value = produto.categoria;
    document.getElementById("quantidade").value = produto.quantidade;
  }

  document.getElementById("form-editar-produto").addEventListener("submit", (e) => {
    e.preventDefault();

    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

    const codigo = document.getElementById("codigo").value;
    const nome = document.getElementById("nome").value;
    const categoria = document.getElementById("categoria").value;
    const quantidade = parseInt(document.getElementById("quantidade").value);

    const index = produtos.findIndex(p => p.codigo === codigo);
    if (index !== -1) {
      produtos[index] = { ...produtos[index], nome, categoria, quantidade };
      localStorage.setItem("produtos", JSON.stringify(produtos));
      alert("Produto atualizado com sucesso!");
      window.location.href = "listaProduto.html";
    } else {
      alert("Produto não encontrado!");
    }
  });
});
