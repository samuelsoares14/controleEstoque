
document.addEventListener("DOMContentLoaded", () => {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  const movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || [];

  gerarGraficoTopRetirados(movimentacoes);
  gerarTabelaMenorEstoque(produtos);
  gerarGraficoMovimentacoesMes(movimentacoes);
});

function gerarGraficoTopRetirados(movimentacoes) {
  const retiradas = movimentacoes.filter(m => m.tipo === "retirada");
  const contagem = {};

  retiradas.forEach(m => {
    contagem[m.nomeProduto] = (contagem[m.nomeProduto] || 0) + m.quantidade;
  });

  const topRetirados = Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const ctx = document.createElement("canvas");
  document.getElementById("graficoTopRetirados").appendChild(ctx);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: topRetirados.map(e => e[0]),
      datasets: [{
        label: "Top 5 Produtos Mais Retirados",
        data: topRetirados.map(e => e[1]),
        backgroundColor: "rgba(255, 99, 132, 0.6)"
      }]
    }
  });
}

function gerarTabelaMenorEstoque(produtos) {
  const ordenados = [...produtos].sort((a, b) => a.quantidade - b.quantidade).slice(0, 5);
  let html = "<h3>Produtos com Menor Estoque</h3><table border='1'><tr><th>Nome</th><th>Código</th><th>Estoque</th></tr>";
  ordenados.forEach(p => {
    html += `<tr><td>${p.nome}</td><td>${p.codigo}</td><td>${p.quantidade}</td></tr>`;
  });
  html += "</table>";
  document.getElementById("tabelaMenorEstoque").innerHTML = html;
}

function gerarGraficoMovimentacoesMes(movimentacoes) {
  const now = new Date();
  const mesAtual = now.getMonth();
  const anoAtual = now.getFullYear();

  let entradas = 0;
  let retiradas = 0;

  movimentacoes.forEach(m => {
    const data = new Date(m.dataHora);
    if (data.getMonth() === mesAtual && data.getFullYear() === anoAtual) {
      if (m.tipo === "retirada") retiradas += m.quantidade;
      if (m.tipo === "entrada") entradas += m.quantidade;
    }
  });

  const ctx = document.createElement("canvas");
  document.getElementById("graficoMovimentacoesMes").appendChild(ctx);

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Entradas", "Retiradas"],
      datasets: [{
        data: [entradas, retiradas],
        backgroundColor: ["#36A2EB", "#FF6384"]
      }]
    }
  });
}

function exportarRelatorioPDF() {
  window.print(); // Simples: usa o print do navegador para gerar PDF
}
