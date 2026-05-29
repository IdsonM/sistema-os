const API_URL = "https://sistema-os-akw3.onrender.com";

// ================= LOGIN =================
window.login = function () {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch(API_URL + "/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(data => {

        localStorage.setItem("token", data.access_token);

        document.getElementById("login-box").style.display = "none";
        document.getElementById("app").style.display = "block";

        document.getElementById("user-info").innerText =
            "Bem-vindo, " + username;

        listarOS();
    })
    .catch(() => {
        alert("Usuário ou senha inválidos ❌");
    });
};

// ================= LOGOUT =================
window.logout = function () {
    localStorage.removeItem("token");
    location.reload();
};

// ================= LISTAR =================
window.listarOS = function () {

    fetch(API_URL + "/os/", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => res.json())
    .then(data => {

        const lista = document.getElementById("lista");
        lista.innerHTML = "";

        data.forEach(os => {

            let cor = "bg-secondary";

            if(os.status.includes("Análise")) cor = "bg-warning text-dark";
            if(os.status.includes("Reparo")) cor = "bg-primary";
            if(os.status.includes("Pronto")) cor = "bg-success";

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>#${os.id}</td>
                <td>${os.cliente}</td>
                <td>${os.equipamento || '-'}</td>
                <td class="text-success">R$ ${os.orcamento || '-'}</td>
                <td><span class="badge ${cor}">${os.status}</span></td>
                <td>
                    <button onclick="editarOS(${os.id})" class="btn btn-warning btn-sm me-1">✏️</button>
                    <button onclick="deletarOS(${os.id})" class="btn btn-danger btn-sm me-1">🗑</button>
                    <button onclick="imprimirOS(${os.id})" class="btn btn-info btn-sm">🖨</button>
                </td>
            `;

            lista.appendChild(tr);
        });
    });
};

// ================= CRIAR =================
window.criarOS = function () {

    const cliente = document.getElementById("cliente").value;
    const descricao = document.getElementById("descricao").value;
    const status = document.getElementById("status").value;
    const equipamento = document.getElementById("equipamento").value;
    const orcamento = document.getElementById("orcamento").value;
    const data = document.getElementById("data").value;

    fetch(API_URL + "/os/", {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
            cliente,
            descricao,
            status,
            equipamento,
            orcamento,
            data
        })
    })
    .then(() => listarOS());
};

// ================= EDITAR =================
window.editarOS = function(id){

    fetch(API_URL + "/os/", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => res.json())
    .then(data => {

        const os = data.find(o => o.id === id);
        if (!os) return;

        const cliente = prompt("Cliente:", os.cliente);
        if (cliente === null) return;

        const descricao = prompt("Descrição:", os.descricao);
        const status = prompt("Status:", os.status);
        const equipamento = prompt("Equipamento:", os.equipamento);
        const orcamento = prompt("Orçamento:", os.orcamento);
        const dataEntrada = prompt("Data:", os.data);

        fetch(API_URL + "/os/" + id, {
            method: "PUT",
            headers: {
                "Content-Type":"application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({
                cliente,
                descricao,
                status,
                equipamento,
                orcamento,
                data: dataEntrada
            })
        })
        .then(() => listarOS());
    });
};

// ================= DELETAR =================
window.deletarOS = function(id){

    const confirmar = confirm("Deseja realmente excluir?");

    if (!confirmar) return;

    fetch(API_URL + "/os/" + id, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => {
        if (!res.ok) throw new Error();
    })
    .then(() => {
        alert("Excluído com sucesso ✅");
        listarOS();
    })
    .catch(() => {
        alert("Erro ao excluir ❌");
    });
};

// ================= FILTRO =================
window.filtrarOS = function () {

    const termo = document.getElementById("busca").value.toLowerCase();
    const linhas = document.querySelectorAll("#lista tr");

    linhas.forEach(linha => {
        linha.style.display =
            linha.innerText.toLowerCase().includes(termo) ? "" : "none";
    });
};

// ================= EXPORTAR =================
window.exportarExcel = function () {

    fetch(API_URL + "/os/", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => res.json())
    .then(data => {

        let csv = "ID;Cliente;Equipamento;Orçamento;Status\n";

        data.forEach(os => {
            csv += `${os.id};${os.cliente};${os.equipamento};${os.orcamento};${os.status}\n`;
        });

        const blob = new Blob([csv]);
        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);
        link.download = "os.csv";
        link.click();
    });
};

// ================= IMPRIMIR =================
window.imprimirOS = function(id){

    fetch(API_URL + "/os/", {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    })
    .then(res => res.json())
    .then(data => {

        const os = data.find(o => o.id === id);

        const tela = window.open('', '', 'width=600,height=700');

        tela.document.write(`
            <h2>📄 Ordem de Serviço</h2>
            <hr>
            <p><b>Empresa:</b> Malato'sTech</p>
            <p><b>Cliente:</b> ${os.cliente}</p>
            <p><b>Equipamento:</b> ${os.equipamento || '-'}</p>
            <p><b>Descrição:</b> ${os.descricao}</p>
            <p><b>Status:</b> ${os.status}</p>
            <p><b>Orçamento:</b> R$ ${os.orcamento || '-'}</p>
            <hr><br><br>
            ___________________________<br>
            Assinatura do Cliente
        `);

        tela.print();
    });
};