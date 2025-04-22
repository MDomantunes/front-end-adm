const URL_BASE = "http://127.0.0.1:5000/alunos"; // Ou seu URL de produção

// Função para cadastrar um aluno
async function cadastrarAluno() {
    const cpf = document.getElementById('cpf').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const status = document.getElementById('status').value;

    if (!cpf || !nome) {
        exibirMensagem("Por favor, preencha todos os campos.", "warning");
        return;
    }

    const aluno = { cpf, nome, status };

    try {
        const response = await fetch(URL_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(aluno)
        });

        const data = await response.json();
        exibirMensagem(data.mensagem, "success");
        limparCamposCadastro();
    } catch (error) {
        exibirMensagem("Erro ao cadastrar aluno.", "danger");
        console.error("Erro:", error);
    }
}

// Função para listar todos os alunos
async function listarAlunos() {
    try {
        const response = await fetch(URL_BASE);
        const alunos = await response.json();

        const lista = document.getElementById("listaAlunos");
        lista.innerHTML = "";

        alunos.forEach(aluno => {
            const item = document.createElement("li");
            item.textContent = `Nome: ${aluno.nome}, CPF: ${aluno.cpf}, Status: ${aluno.status}`;
            lista.appendChild(item);
        });
    } catch (error) {
        exibirMensagem("Erro ao listar alunos.", "danger");
        console.error("Erro:", error);
    }
}

// Função para buscar um aluno
async function buscarAluno() {
    const cpf = document.getElementById("cpfBusca").value.trim();
    if (!cpf) {
        exibirMensagem("Digite um CPF para buscar.", "warning");
        return;
    }

    try {
        const response = await fetch(`${URL_BASE}/${cpf}`);
        const aluno = await response.json();

        if (aluno.mensagem) {
            exibirMensagem(aluno.mensagem, "danger");
        } else {
            document.getElementById("nomeEditar").value = aluno.nome;
            document.getElementById("statusEditar").value = aluno.status;
            document.getElementById("editarAluno").style.display = "block";
        }
    } catch (error) {
        exibirMensagem("Erro ao buscar aluno.", "danger");
        console.error("Erro:", error);
    }
}

// Função para editar aluno
async function editarAluno() {
    const cpf = document.getElementById("cpfBusca").value.trim();
    const nome = document.getElementById("nomeEditar").value.trim();
    const status = document.getElementById("statusEditar").value;

    if (!nome) {
        exibirMensagem("Preencha o nome para editar.", "warning");
        return;
    }

    const alunoAtualizado = { nome, status };

    try {
        const response = await fetch(`${URL_BASE}/${cpf}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(alunoAtualizado)
        });

        const data = await response.json();
        exibirMensagem(data.mensagem, "success");
    } catch (error) {
        exibirMensagem("Erro ao editar aluno.", "danger");
        console.error("Erro:", error);
    }
}

// Função para excluir aluno
async function excluirAluno() {
    const cpf = document.getElementById("cpfBusca").value.trim();

    const confirmacao = confirm("Tem certeza que deseja excluir este aluno?");
    if (!confirmacao) return;

    try {
        const response = await fetch(`${URL_BASE}/${cpf}`, {
            method: "DELETE"
        });

        const data = await response.json();
        exibirMensagem(data.mensagem, "success");
        document.getElementById("editarAluno").style.display = "none";
    } catch (error) {
        exibirMensagem("Erro ao excluir aluno.", "danger");
        console.error("Erro:", error);
    }
}

// Função para exibir mensagens de sucesso ou erro
function exibirMensagem(mensagem, tipo) {
    const div = document.getElementById("mensagem");
    div.innerHTML = `
        <span class="icone">${tipo === 'success' ? '✔️' : tipo === 'warning' ? '⚠️' : '❌'}</span>
        <span class="texto">${mensagem}</span>
    `;
    div.className = `mensagem show text-${tipo}`;

    // Esconde a mensagem após 5 segundos
    setTimeout(() => {
        div.className = `mensagem text-${tipo}`;
        setTimeout(() => {
            div.classList.remove('show');
        }, 300);
    }, 5000);
}


// Função para limpar os campos de cadastro
function limparCamposCadastro() {
    document.getElementById('cpf').value = "";
    document.getElementById('nome').value = "";
    document.getElementById('status').value = "ativo";
}
