if (localStorage.getItem("logado") !== "true") {
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function() {
  const usuario = localStorage.getItem("usuario");
  const mostrar = localStorage.getItem("mostrarBoasVindas");

  if (usuario && mostrar === "true") {
    Swal.fire({
      title: `Bem-vindo(a), ${usuario}! 👋`,
      text: 'Você entrou no sistema com sucesso.',
      icon: 'success',
      timer: 2500,
      showConfirmButton: false
    });
    localStorage.setItem("mostrarBoasVindas", "false");
  }
});

function confirmarLogout() {
  Swal.fire({
    title: 'Deseja sair?',
    text: "Você será deslogado do sistema.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sim, sair',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("logado");
      window.location.href = "login.html";
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const usuario = localStorage.getItem("usuario");
  const nomeSpan = document.getElementById("nomeUsuario");
  if (nomeSpan && usuario) {
    nomeSpan.textContent = usuario;
  }

  // Controle de acesso
  const tipo = localStorage.getItem("tipo");
  if (tipo === "restrito") {
    // Ocultar opções exclusivas do admin
    const linkCadastrar = document.querySelector('a[href="cadastrarProduto.html"]');
    const linkEditar = document.querySelector('a[href="editarProduto.html"]');
    if (linkCadastrar) linkCadastrar.style.display = "none";
    if (linkEditar) linkEditar.style.display = "none";
  }
});
