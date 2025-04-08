document.addEventListener("DOMContentLoaded", function () {
  const listaProdutos = JSON.parse(localStorage.getItem("produtos")) || [];
  const tbody = document.getElementById("lista-produtos");
  const mensagemVazia = document.querySelector(".empty-message");

  if (listaProdutos.length === 0) {
    mensagemVazia.style.display = "block";
  } else {
    mensagemVazia.style.display = "none";
    listaProdutos.forEach((produto, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${produto.codigo}</td>
        <td>${produto.nome}</td>
        <td>${produto.categoria}</td>
        <td>${produto.quantidade}</td>
        <td>${produto.dataHora || '---'}</td>
        <td>
          <button class="btn-editar" onclick="editarProduto(${index})">✏️ Editar</button>
          <button class="btn-excluir" onclick="excluirProduto(${index})">🗑️ Excluir</button>
        </td>

      `;

      tbody.appendChild(tr);
    });
  }
});

function excluirProduto(index) {
  Swal.fire({
    title: 'Tem certeza?',
    text: "Essa ação não pode ser desfeita!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      let produtos = JSON.parse(localStorage.getItem("produtos"));
      produtos.splice(index, 1);
      localStorage.setItem("produtos", JSON.stringify(produtos));
      Swal.fire('Excluído!', 'O produto foi removido com sucesso.', 'success').then(() => {
        location.reload();
      });
    }
  });
}

// Inicializar tabela
produtos.forEach(produto => adicionarProdutoNaTabela(produto));

async function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const listaProdutos = JSON.parse(localStorage.getItem("produtos")) || [];

  if (listaProdutos.length === 0) {
    alert("Nenhum produto para exportar.");
    return;
  }

  const colunas = ["Código", "Nome", "Categoria", "Quantidade", "Data/Hora"];
  const linhas = listaProdutos.map(prod => [
    prod.codigo,
    prod.nome,
    prod.categoria,
    prod.quantidade,
    prod.dataHora || "---"
  ]);

  doc.autoTable({
    head: [colunas],
    body: linhas,
    theme: "striped",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [22, 160, 133] },
  });

  doc.save("produtos.pdf");
}

function filtrarProdutos() {
  const codigoBusca = document.getElementById("filtroCodigo").value.toLowerCase();
  const nomeBusca = document.getElementById("filtroNome").value.toLowerCase();
  const categoriaBusca = document.getElementById("filtroCategoria").value;
  const tbody = document.getElementById("lista-produtos");
  tbody.innerHTML = "";

  const listaProdutos = JSON.parse(localStorage.getItem("produtos")) || [];

  const filtrados = listaProdutos.filter(produto => {
    const codigoMatch = produto.codigo.toLowerCase().includes(codigoBusca);
    const nomeMatch = produto.nome.toLowerCase().includes(nomeBusca);
    const categoriaMatch = categoriaBusca === "" || produto.categoria === categoriaBusca;
    return codigoMatch && nomeMatch && categoriaMatch;
  });

  if (filtrados.length === 0) {
    tbody.innerHTML = "<tr><td colspan='6'>Nenhum produto encontrado.</td></tr>";
  } else {
    filtrados.forEach((produto, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${produto.codigo}</td>
        <td>${produto.nome}</td>
        <td>${produto.categoria}</td>
        <td>${produto.quantidade}</td>
        <td>${produto.dataHora || '---'}</td>
        <td>
          <button class="btn-editar" onclick="editarProduto(${index})">✏️ Editar</button>
          <button class="btn-excluir" onclick="excluirProduto(${index})">🗑️ Excluir</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
}
function carregarProdutos() {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  const tbody = document.querySelector("#tabelaProdutos tbody");
  tbody.innerHTML = "";

  produtos.forEach((produto, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${produto.codigo}</td>
      <td>${produto.nome}</td>
      <td>${produto.categoria}</td>
      <td>${produto.quantidade}</td>
      <td>${produto.dataHora}</td>
      <td>
        <button onclick="editarProduto(${index})">✏️</button>
        <button onclick="excluirProduto(${index})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

carregarProdutos();

// ⬇️ Cole a função editarProduto aqui ⬇️

function editarProduto(index) {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  const produto = produtos[index];

  Swal.fire({
    title: 'Editar Produto',
    html:
      `<input id="swal-codigo" class="swal2-input" placeholder="Codigo" value="${produto.codigo}">
       <input id="swal-nome" class="swal2-input" placeholder="Nome" value="${produto.nome}">
       <input id="swal-categoria" class="swal2-input" placeholder="Categoria" value="${produto.categoria}">
       <input id="swal-quantidade" type="number" class="swal2-input" placeholder="Quantidade" value="${produto.quantidade}">`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const codigo = document.getElementById('swal-codigo').value.trim();
      const nome = document.getElementById('swal-nome').value.trim();
      const categoria = document.getElementById('swal-categoria').value.trim();
      const quantidade = parseInt(document.getElementById('swal-quantidade').value);

      if (!codigo || !nome || !categoria || isNaN(quantidade) || quantidade < 0) {
        Swal.showValidationMessage("Preencha todos os campos corretamente.");
        return false;
      }

      return {codigo, nome, categoria, quantidade };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { codigo, nome, categoria, quantidade } = result.value;
      produto.codigo = codigo;
      produto.nome = nome;
      produto.categoria = categoria;
      produto.quantidade = quantidade;
      produto.dataHora = new Date().toLocaleString();

      produtos[index] = produto;
      localStorage.setItem("produtos", JSON.stringify(produtos));

      Swal.fire("Atualizado!", "Produto editado com sucesso.", "success").then(() => {
        location.reload();
      });
    }
  });
}
