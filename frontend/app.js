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
window.exportarExcel = function () {

    fetch(API_URL + "/os/")
    .then(res => res.json())
    .then(data => {

        let csv = "ID;Cliente;Descrição;Status\n";

        data.forEach(os => {
            csv += `${os.id};${os.cliente};${os.descricao};${os.status}\n`;
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "ordens_servico.csv");
        link.click();
    });
};
window.imprimirOS = function(id){

    fetch(API_URL + "/os/")
    .then(res => res.json())
    .then(data => {

        const os = data.find(o => o.id === id);

        const janela = window.open('', '', 'width=700,height=700');

        janela.document.write(`
        <html>
        <head>
            <title>Recibo OS</title>
            <style>
                body {
                    font-family: Arial;
                    padding: 20px;
                }
                h2 {
                    text-align: center;
                }
                .linha {
                    margin-bottom: 10px;
                }
                .box {
                    border: 1px solid #000;
                    padding: 15px;
                    margin-top: 10px;
                }
            </style>
        </head>

        <body>

            <h2>📄 ORDEM DE SERVIÇO</h2>

            <div class="box">
                <h4>🏢 Dados da Empresa</h4>
                <div class="linha"><b>Empresa:</b> Malato'sTech</div>
                <div class="linha"><b>CNPJ:</b> 00.000.000/0001-00</div>
                <div class="linha"><b>Endereço:</b> Curitiba - PR</div>
                <div class="linha"><b>Telefone:</b> (41) 99999-9999</div>
            </div>

            <div class="box">
                <h4>👤 Dados do Cliente</h4>
                <div class="linha"><b>Cliente:</b> ${os.cliente}</div>
            </div>

            <div class="box">
                <h4>🛠 Serviço</h4>
                <div class="linha"><b>Descrição:</b> ${os.descricao}</div>
                <div class="linha"><b>Status:</b> ${os.status}</div>
            </div>

            <br><br>

            <div>
                ___________________________<br>
                Assinatura do Cliente
            </div>

        </body>
        </html>
        `);

        janela.print();
    });
};
