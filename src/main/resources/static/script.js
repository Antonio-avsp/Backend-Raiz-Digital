document.addEventListener('DOMContentLoaded', function() {
    
    // ---- LÓGICA UNIFICADA PARA TODAS AS ABAS ----
    // Agora selecionamos tanto '.tab-link' (Cadastro/Estoque) quanto '.sub-tab-link' (Relatórios)
    const tabLinks = document.querySelectorAll('.tab-link, .sub-tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    // Função para ativar uma aba
    function activateTab(clickedLink) {
        // 1. Remove a classe 'active' apenas dos links que são "irmãos" do clicado
        // Isso evita que clicar numa aba de relatório desligue a aba da sidebar, por exemplo.
        const parent = clickedLink.parentElement;
        const siblingLinks = parent.querySelectorAll('.tab-link, .sub-tab-link');
        
        siblingLinks.forEach(link => link.classList.remove('active'));
        
        // 2. Adiciona 'active' na aba clicada
        clickedLink.classList.add('active');

        // 3. Verifica se essa aba controla algum conteúdo (tem data-target)
        const targetId = clickedLink.getAttribute('data-target');
        
        if (targetId) {
            // Esconde TODOS os conteúdos da página atual
            // (Como tab-content é genérico, precisamos garantir que só escondemos os relevantes
            // mas para este projeto simples, esconder todos e mostrar o alvo funciona bem)
            tabContents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });

            // Mostra apenas o conteúdo alvo
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.style.display = 'block';
                // Pequeno delay para permitir transições CSS se você adicionar no futuro
                setTimeout(() => targetContent.classList.add('active'), 10);
            }
        }
    }

    // Adiciona o evento de clique em cada aba encontrada
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Verifica se o link tem um href="#" ou data-target antes de prevenir o padrão
            // para não quebrar links reais se houver
            if (this.getAttribute('href') === '#' || this.hasAttribute('data-target')) {
                e.preventDefault();
                activateTab(this);
            }
        });
    });
});
