document.addEventListener("DOMContentLoaded", () => {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  const movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || [];

  // Total de produtos
  document.getElementById("totalProdutos").textContent = produtos.length;

  // Produtos com estoque baixo (50 ou menos)
  const estoqueBaixo = produtos.filter(p => p.quantidade <= 50).length;
  document.getElementById("estoqueBaixo").textContent = `${estoqueBaixo} produto${estoqueBaixo === 1 ? "" : "s"}`;

  // Movimentações do dia
  const hoje = new Date().toLocaleDateString();
  const movHoje = movimentacoes.filter(m => {
      const dataMov = new Date(m.dataHora).toLocaleDateString();
      return dataMov === hoje;
  }).length;
  document.getElementById("movimentacoesHoje").textContent = `${movHoje}`;
});