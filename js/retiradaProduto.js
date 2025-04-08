document.addEventListener("DOMContentLoaded", () => {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  const inputBusca = document.getElementById("buscaProduto");
  const datalist = document.getElementById("listaProdutos");
  const inputCodigo = document.getElementById("codigoProduto");
  const inputNome = document.getElementById("nomeProduto");
  const estoqueAtualEl = document.getElementById("estoqueAtual");

  // Popular datalist
  produtos.forEach(prod => {
    const option = document.createElement("option");
    option.value = `${prod.codigo} - ${prod.nome}`;
    datalist.appendChild(option);
  });

  function atualizarCampos() {
    const valor = inputBusca.value.trim().toLowerCase();
    const produto = produtos.find(p =>
      `${p.codigo} - ${p.nome}`.toLowerCase() === valor ||
      p.codigo.toLowerCase() === valor ||
      p.nome.toLowerCase() === valor
    );

    if (produto) {
      inputCodigo.value = produto.codigo;
      inputNome.value = produto.nome;
      estoqueAtualEl.textContent = `Estoque atual: ${produto.quantidade}`;
    } else {
      inputCodigo.value = "";
      inputNome.value = "";
      estoqueAtualEl.textContent = "Estoque atual: -";
    }
  }

  inputBusca.addEventListener("input", atualizarCampos);
  inputBusca.addEventListener("change", atualizarCampos);

  document.getElementById("formRetirada").addEventListener("submit", (e) => {
    e.preventDefault();

    const codigoProduto = inputCodigo.value;
    const produtosAtualizados = JSON.parse(localStorage.getItem("produtos")) || [];
    const produtoIndex = produtosAtualizados.findIndex(p => p.codigo === codigoProduto);
    const produtoSelecionado = produtosAtualizados[produtoIndex];

    if (!produtoSelecionado) {
      Swal.fire("Erro", "Produto não encontrado.", "error");
      return;
    }

    const quantidade = parseInt(document.getElementById("quantidade").value);
    const motivo = document.getElementById("motivo")?.value.trim() || "Não informado";
    const observacoes = document.getElementById("observacoes").value.trim();
    const usuario = localStorage.getItem("usuario");

    const resultado = retirarProduto(produtoSelecionado, quantidade, motivo, observacoes, usuario);

    if (!resultado.sucesso) {
      Swal.fire("Erro", resultado.mensagem, "error");
    } else {
      produtosAtualizados[produtoIndex] = produtoSelecionado;
      localStorage.setItem("produtos", JSON.stringify(produtosAtualizados));

      Swal.fire("Sucesso", resultado.mensagem, "success");
      document.getElementById("formRetirada").reset();
      estoqueAtualEl.textContent = "Estoque atual: -";
      inputCodigo.value = "";
      inputNome.value = "";
      inputBusca.value = "";
    }
  });
});

function retirarProduto(produto, quantidade, motivo, observacoes, usuario) {
  if (quantidade > produto.quantidade) {
    return { sucesso: false, mensagem: "Estoque insuficiente." };
  }

  produto.quantidade -= quantidade;

  const movimentacoes = JSON.parse(localStorage.getItem("movimentacoes")) || [];
  movimentacoes.push({
    tipo: "retirada",
    codigoProduto: produto.codigo,
    nomeProduto: produto.nome,
    quantidade: quantidade,
    motivo: motivo,
    observacoes: observacoes,
    usuario: usuario,
    dataHora: new Date().toLocaleString()
  });
  localStorage.setItem("movimentacoes", JSON.stringify(movimentacoes));

  return { sucesso: true, mensagem: "Retirada realizada com sucesso." };
}