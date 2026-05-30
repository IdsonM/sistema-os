const API_URL = "https://sistema-os-akw3.onrender.com";

// ================= LOGIN =================
window.login = function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorElement = document.getElementById("erroLogin");

    if (errorElement) errorElement.innerText = "";

    fetch(API_URL + "/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(async res => {
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            throw new Error(data.message || "Usuário ou senha inválidos");
        }

        return data;
    })
    .then(data => {

        console.log("Login sucesso:", data);

        // ✅ SALVA TOKEN E USER
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", username);

        // ✅ TROCA TELA
        document.getElementById("login-box").style.display = "none";
        document.getElementById("app").style.display = "block";

        // ✅ MOSTRA USUÁRIO
        const userInfo = document.getElementById("user-info");
        if (userInfo) {
            userInfo.innerText = "Bem-vindo, " + username;
        }

        // ✅ CARREGA OS
        listarOS();
    })
    .catch(err => {
        if (errorElement) {
            errorElement.innerText = err.message;
        } else {
            alert(err.message);
        }
    });
};

// ================= LOGOUT =================
function logout() {
    localStorage.clear();

    document.getElementById("app").style.display = "none";
    document.getElementById("login-box").style.display = "block";

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    const erro = document.getElementById("erroLogin");
    if (erro) erro.innerText = "";
}

// ================= LISTAR OS =================
function listarOS() {

    fetch(API_URL + "/os", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => res.json())
    .then(data => {

        const lista = document.getElementById("lista");
        lista.innerHTML = "";

        data.forEach(os => {

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${os.id}</td>
                <td>${os.cliente}</td>
                <td>${os.descricao}</td>
                <td>${os.status}</td>
            `;

            lista.appendChild(tr);
        });

    });
}

// ================= CRIAR OS =================
function criarOS() {

    const cliente = document.getElementById("cliente").value;
    const descricao = document.getElementById("descricao").value;
    const status = document.getElementById("status").value;

    fetch(API_URL + "/os", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
            cliente,
            descricao,
            status
        })
    })
    .then(() => {
        listarOS();
    });
}

// ================= RECUPERAÇÃO =================
window.abrirRecuperacao = function () {
    const box = document.getElementById("recuperar");
    if (box) box.style.display = "block";
};

window.fecharRecuperacao = function () {
    const box = document.getElementById("recuperar");
    if (box) box.style.display = "none";
};

window.recuperarSenha = function () {

    const email = document.getElementById("emailRecuperacao").value;
    const msg = document.getElementById("msgRecuperacao");

    if (!email) {
        if (msg) msg.innerText = "Digite o usuário!";
        return;
    }

    fetch(API_URL + "/auth/forgot", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    })
    .then(res => res.json())
    .then(data => {

        console.log("TOKEN RECEBIDO:", data);

        if (!data.token) {
            if (msg) msg.innerText = "Erro: backend não retornou token ❌";
            return;
        }

        window.location.href = "reset.html?token=" + data.token;
    })
    .catch(() => {
        if (msg) msg.innerText = "Erro ao recuperar senha ❌";
    });
};