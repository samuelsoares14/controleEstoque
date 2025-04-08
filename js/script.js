// Aqui podemos adicionar funcionalidades futuras
console.log('Dashboard carregado!');

//Tela Cadastrar Produto
const dataCadastro = document.getElementById("dataCadastro");
    const agora = new Date();
    dataCadastro.value = agora.toISOString().slice(0, 16);

    const form = document.getElementById("produtoForm");
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      const produto = {
        codigo: document.getElementById("codigo").value,
        nome: document.getElementById("nome").value,
        categoria: document.getElementById("categoria").value,
        quantidade: parseInt(document.getElementById("quantidade").value),
        dataCadastro: document.getElementById("dataCadastro").value
      };

      let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
      produtos.push(produto);
      localStorage.setItem("produtos", JSON.stringify(produtos));

      alert("Produto cadastrado com sucesso!");
      form.reset();
      dataCadastro.value = new Date().toISOString().slice(0, 16);
    });

//Tela Ver Produto
const params = new URLSearchParams(window.location.search);
    const codigo = params.get("codigo");
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    const produto = produtos.find(p => p.codigo === codigo);

    if (produto) {
      document.getElementById("codigo").textContent = produto.codigo;
      document.getElementById("nome").textContent = produto.nome;
      document.getElementById("categoria").textContent = produto.categoria;
      document.getElementById("quantidade").textContent = produto.quantidade;
      document.getElementById("dataCadastro").textContent = produto.dataCadastro;
    } else {
      document.getElementById("detalhesProduto").innerHTML = "<p>Produto não encontrado.</p>";
    }

    // Lista de Produtos
    const tabela = document.getElementById("tabelaProdutos");
    const filtroCategoria = document.getElementById("filtroCategoria");
    const buscarNome = document.getElementById("buscarNome");

    function carregarProdutos() {
      const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
      const categoriaFiltro = filtroCategoria.value.toLowerCase();
      const termoBusca = buscarNome.value.toLowerCase();

      tabela.innerHTML = "";

      produtos.filter(p => {
        return (
          (!categoriaFiltro || p.categoria.toLowerCase() === categoriaFiltro) &&
          (p.nome.toLowerCase().includes(termoBusca) || p.codigo.toLowerCase().includes(termoBusca))
        );
      }).forEach(produto => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
          <td>${produto.codigo}</td>
          <td>${produto.nome}</td>
          <td>${produto.categoria}</td>
          <td>${produto.quantidade}</td>
          <td>${produto.dataCadastro}</td>
          <td class="acoes">
            <button class="ver" onclick="location.href='ver-produto.html?codigo=${produto.codigo}'">Ver</button>
            <button class="excluir" onclick="excluirProduto('${produto.codigo}')">Excluir</button>
          </td>
        `;
        tabela.appendChild(linha);
      });
    }

    function excluirProduto(codigo) {
      if (confirm("Deseja realmente excluir este produto?")) {
        let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
        produtos = produtos.filter(p => p.codigo !== codigo);
        localStorage.setItem("produtos", JSON.stringify(produtos));
        carregarProdutos();
      }
    }

    filtroCategoria.addEventListener("change", carregarProdutos);
    buscarNome.addEventListener("input", carregarProdutos);

    window.addEventListener("load", carregarProdutos);