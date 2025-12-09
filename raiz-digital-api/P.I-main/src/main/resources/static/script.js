/* ==========================================================================
   CONFIGURAÇÕES GLOBAIS
   ========================================================================== */
const API_URL = 'http://localhost:8080/api/especies';



/* ==========================================================================
   CRUD COMPLETO E FUNCIONAL 
   ========================================================================== */


/* ==========================================================================
   1. CREATE (CRIAR) - Funções relacionadas à criação de novos registros
   ========================================================================== */

/**
 * Função: abrirModal
 * O que faz: Prepara a tela para um novo cadastro.
 * 1. Limpa o formulário (reset).
 * 2. Limpa o campo escondido ID (id-especie = '') para o sistema saber que é um NOVO registro.
 * 3. Mostra a janelinha (display: flex).
 * 4. Muda o título para "Nova Espécie".
 */
function abrirModal() {
    const form = document.getElementById('form-cadastro-especie');
    if(form) form.reset();
    
    // IMPORTANTE: Limpa o ID para garantir que é um cadastro novo (Create)
    const idField = document.getElementById('id-especie');
    if(idField) idField.value = ''; 

    const modal = document.getElementById('modal-nova-especie');
    if(modal) {
        modal.style.display = 'flex';
        const titulo = modal.querySelector('h3');
        if(titulo) titulo.innerText = 'Nova Espécie';
    }
}

/* ==========================================================================
   2. READ (LER/CONSULTAR) - Funções que buscam e mostram dados
   ========================================================================== */

/**
 * Função: carregarListaEspecies
 * O que faz: Busca os dados no Backend e desenha a lista na tela.
 * 1. Faz um GET na API (fetch).
 * 2. Recebe o JSON com as espécies.
 * 3. Limpa a lista atual (innerHTML = '') para não duplicar.
 * 4. Verifica se está vazio (mostra Empty State) ou cheio.
 * 5. Cria o HTML de cada linha (incluindo os botões de Editar e Excluir) e joga na tela.
 */
async function carregarListaEspecies() {
    try {
        const response = await fetch(API_URL);
        const especies = await response.json();

        const container = document.getElementById('lista-especies-container');
        const emptyState = document.getElementById('empty-state-especies');
        const contador = document.getElementById('contador-especies');

        // Limpa lista atual
        if(container) container.innerHTML = '';
        
        // Atualiza contador de itens
        if(contador) contador.innerText = especies.length;

        // Controla exibição do "Vazio" vs "Lista"
        if (especies.length === 0) {
            if(emptyState) emptyState.style.display = 'flex';
        } else {
            if(emptyState) emptyState.style.display = 'none';

            especies.forEach(esp => {
                // Tratamento de aspas para evitar erros no HTML
                const nomeSafe = esp.nome ? esp.nome.replace(/'/g, "\\'") : '';
                const descSafe = esp.descricao ? esp.descricao.replace(/'/g, "\\'") : '';

                // Desenha o HTML do card
                const itemHTML = `
                    <div style="padding: 1rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #fff;">
                        <div>
                            <h4 style="color: var(--primary-green); font-weight: 600; margin-bottom: 0.2rem;">${esp.nome}</h4>
                            <p style="font-size: 0.9rem; color: var(--gray-dark); margin: 0;">${esp.descricao || 'Sem descrição'}</p>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn-secondary" onclick="prepararEdicao(${esp.id}, '${nomeSafe}', '${descSafe}')" style="padding: 5px 10px; cursor: pointer;" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-secondary" onclick="deletarEspecie(${esp.id})" style="padding: 5px 10px; color: #dc3545; border-color: #dc3545; cursor: pointer;" title="Excluir">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                container.innerHTML += itemHTML;
            });
        }
    } catch (error) {
        console.error('Erro ao buscar lista:', error);
    }
}

/* ==========================================================================
   3. UPDATE (ATUALIZAR) - Preparação para edição
   ========================================================================== */

/**
 * Função: prepararEdicao
 * O que faz: Pega os dados da linha clicada e joga dentro do formulário.
 * 1. Recebe ID, Nome e Descrição por parâmetro.
 * 2. Preenche os inputs do formulário com esses dados.
 * 3. Abre o modal.
 * 4. Muda o título para "Editar Espécie" para o usuário saber que está alterando.
 * OBS: A gravação real acontece no evento 'submit' lá embaixo.
 */
function prepararEdicao(id, nome, descricao) {
    document.getElementById('id-especie').value = id; // Guarda o ID no campo oculto
    document.getElementById('nome-especie').value = nome;
    document.getElementById('desc-especie').value = descricao;
    
    const modal = document.getElementById('modal-nova-especie');
    if(modal) {
        modal.style.display = 'flex';
        const titulo = modal.querySelector('h3');
        if(titulo) titulo.innerText = 'Editar Espécie';
    }
}

/* ==========================================================================
   4. DELETE (EXCLUIR) - Remover registros
   ========================================================================== */

/**
 * Função: deletarEspecie
 * O que faz: Apaga um registro do banco de dados.
 * 1. Pede confirmação ao usuário.
 * 2. Envia um método DELETE para a API (URL + ID).
 * 3. Se der certo, atualiza a lista (carregarListaEspecies) para o item sumir.
 */
async function deletarEspecie(id) {
    if (confirm('Tem certeza que deseja excluir esta espécie?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Espécie excluída!');
                carregarListaEspecies(); // Recarrega a lista para atualizar a tela
            } else {
                alert('Erro ao excluir.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro de conexão.');
        }
    }
}

/* ==========================================================================
   FUNÇÕES AUXILIARES DE UI (Interface do Usuário)
   ========================================================================== */

// Fecha o modal visualmente
function fecharModal() {
    const modal = document.getElementById('modal-nova-especie');
    if(modal) modal.style.display = 'none';
}

// Fecha o modal se o usuário clicar na parte escura (fora da caixa)
window.onclick = function(event) {
    const modal = document.getElementById('modal-nova-especie');
    if (event.target == modal) fecharModal();
}

/* ==========================================================================
   INICIALIZAÇÃO E EVENTOS (Onde tudo começa quando a página carrega)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA DAS ABAS (TABS) ---
    // (Código responsável por trocar as telas entre Espécies, Fornecedores, etc.)
    const tabLinks = document.querySelectorAll('.tab-link, .sub-tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    function activateTab(clickedLink) {
        const parent = clickedLink.parentElement;
        const siblingLinks = parent.querySelectorAll('.tab-link, .sub-tab-link');
        siblingLinks.forEach(link => link.classList.remove('active'));
        
        clickedLink.classList.add('active');

        const targetId = clickedLink.getAttribute('data-target');
        if (targetId) {
            tabContents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.style.display = 'block';
                setTimeout(() => targetContent.classList.add('active'), 10);
            }
        }
    }

    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#' || this.hasAttribute('data-target')) {
                e.preventDefault();
                activateTab(this);
            }
        });
    });

    // --- LÓGICA DE SUBMIT DO FORMULÁRIO (CREATE E UPDATE) ---
    // Este bloco decide se vai SALVAR (Create) ou ATUALIZAR (Update)
    const form = document.getElementById('form-cadastro-especie');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault(); // Impede a página de recarregar

            // 1. Pega o ID (se tiver ID, é edição. Se estiver vazio, é criação)
            const id = document.getElementById('id-especie').value;
            
            // 2. Monta o objeto com os dados
            const dados = {
                nome: document.getElementById('nome-especie').value,
                descricao: document.getElementById('desc-especie').value
            };

            let url = API_URL;
            let method = 'POST'; // Padrão = Criar

            // SE TIVER ID PREENCHIDO, MUDA PARA ATUALIZAR (PUT)
            if (id) {
                url = `${API_URL}/${id}`; // Adiciona o ID na URL
                method = 'PUT';           // Muda o método para PUT
            }

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dados)
                });

                if (response.ok) {
                    alert(id ? 'Editado com sucesso!' : 'Cadastrado com sucesso!');
                    fecharModal();
                    carregarListaEspecies(); // Atualiza a lista na hora
                } else {
                    alert('Erro ao salvar no servidor.');
                }
            } catch (erro) {
                console.error('Erro:', erro);
                alert('Erro de conexão.');
            }
        });
    }

    // Carrega a lista automaticamente assim que a página abre
    carregarListaEspecies();
});
