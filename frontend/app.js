console.log("JS OK ✅");

const API_URL = "https://sistema-os-akw3.onrender.com";

let token = localStorage.getItem("token");
let idEditando = null;
let modal;


// ================= LOGIN =================
window.login = function () {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch(API_URL + "/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(res => {
        if (!res.ok) throw new Error("Erro login");
        return res.json();
    })
    .then(data => {

        token = data.access_token;
        localStorage.setItem("token", token);

        document.getElementById("login-box").style.display = "none";
        document.getElementById("app").style.display = "block";

        mostrarUsuario();
        listarOS();
    })
    .catch(err => {
        console.log(err);
        alert("Erro no login ❌");
    });
};


// ================= LOGOUT =================
window.logout = function () {

    localStorage.removeItem("token");

    document.getElementById("app").style.display = "none";
    document.getElementById("login-box").style.display = "block";
};


// ================= MOSTRAR USUARIO =================
function mostrarUsuario(){
    document.getElementById("user-info").innerText = "Bem-vindo, admin 👤";
}


// ================= LISTAR =================
window.listarOS = function () {

    fetch(API_URL + "/os/")
    .then(res => res.json())
    .then(data => {

        const lista = document.getElementById("lista");
        lista.innerHTML = "";

        data.forEach(function(os){

            const li = document.createElement("li");
            li.className = "list-group-item";

            li.innerHTML = `
                <b>${os.id}</b> - ${os.cliente} - ${os.status}
                <br>${os.descricao}<br><br>

                <button onclick="editarOS(${os.id})" class="btn btn-warning btn-sm me-2">
                    Editar
                </button>

                <button onclick="deletarOS(${os.id})" class="btn btn-danger btn-sm">
                    Excluir
                </button>
            `;

            lista.appendChild(li);
        });
    });
};


// ================= CRIAR =================
window.criarOS = function () {

    const cliente = document.getElementById("cliente").value;
    const descricao = document.getElementById("descricao").value;
    const status = document.getElementById("status").value;

    if (!cliente || !descricao || !status) {
        alert("Preencha todos os campos!");
        return;
    }

    fetch(API_URL + "/os/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            cliente: cliente,
            descricao: descricao,
            status: status
        })
    })
    .then(() => {
        listarOS();
    });
};


// ================= EDITAR (ABRE MODAL) =================
window.editarOS = function (id) {

    idEditando = id;

    fetch(API_URL + "/os/")
    .then(res => res.json())
    .then(data => {

        const os = data.find(o => o.id === id);

        document.getElementById("edit_cliente").value = os.cliente;
        document.getElementById("edit_descricao").value = os.descricao;
        document.getElementById("edit_status").value = os.status;

        modal = new bootstrap.Modal(document.getElementById("modalEditar"));
        modal.show();
    });
};


// ================= SALVAR EDIÇÃO =================
window.salvarEdicao = function () {

    const cliente = document.getElementById("edit_cliente").value;
    const descricao = document.getElementById("edit_descricao").value;
    const status = document.getElementById("edit_status").value;

    fetch(API_URL + "/os/" + idEditando, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            cliente: cliente,
            descricao: descricao,
            status: status
        })
    })
    .then(() => {
        modal.hide();
        listarOS();
    });
};


// ================= EXCLUIR =================
window.deletarOS = function(id){

    if(!confirm("Deseja realmente excluir?")) return;

    fetch(API_URL + "/os/" + id, {
        method: "DELETE"
    })
    .then(() => {
        listarOS();
    });
};


// ================= AUTO LOGIN =================
window.onload = function(){

    if(token){
        document.getElementById("login-box").style.display = "none";
        document.getElementById("app").style.display = "block";

        mostrarUsuario();
        listarOS();
    }
};