document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  if (usuario === "samuel" && senha === "123") {
    localStorage.setItem("logado", "true");
    localStorage.setItem("usuario", usuario);
    localStorage.setItem("tipo", "admin");
    window.location.href = "dashboard.html";
  } else if (usuario === "joao" && senha === "456") {
    localStorage.setItem("logado", "true");
    localStorage.setItem("usuario", usuario);
    localStorage.setItem("tipo", "restrito");
    window.location.href = "dashboard.html";
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Usuário ou senha incorretos!'
    });
  }
  localStorage.setItem("mostrarBoasVindas", "true");
});