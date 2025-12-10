document.addEventListener('DOMContentLoaded', () => {
    const cabecalho = document.getElementById('cabecalho');

    // --- Efeito do Cabeçalho ao Rolar ---
    window.addEventListener('scroll', () => {
        cabecalho.classList.toggle('rolado', window.scrollY > 50);
    });

    // --- Carrossel da Capa Inicial ---
    const slides = document.querySelectorAll('.slide');
    let slideAtual = 0;
    if (slides.length > 0) {
        setInterval(() => {
            slides[slideAtual].classList.remove('ativo');
            slideAtual = (slideAtual + 1) % slides.length;
            slides[slideAtual].classList.add('ativo');
        }, 5000);
    }

    // --- Rolagem Suave para Links Internos ---
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const id = this.getAttribute('href');
            const elementoAlvo = document.querySelector(id);
            if (elementoAlvo) {
                const offset = cabecalho.offsetHeight;
                const posicao = elementoAlvo.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: posicao, behavior: "smooth" });
            }
        });
    });

    // --- Animação de Elementos ao Rolar (Intersection Observer) ---
    const observer = new IntersectionObserver((entradas, observer) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visivel');
                observer.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animar-scroll').forEach(el => observer.observe(el));

    // --- Contador Animado para Estatísticas ---
    const animarContador = (contador) => {
        const alvo = +contador.getAttribute('data-alvo');
        const duracao = 2000; // 2 segundos
        const passo = alvo / (duracao / 16); // ~60fps

        let contagem = 0;
        const atualizarContagem = () => {
            contagem += passo;
            if (contagem < alvo) {
                if (contador.classList.contains('contador-porcentagem')) {
                    contador.innerText = Math.ceil(contagem) + '%';
                } else {
                    contador.innerText = Math.ceil(contagem).toLocaleString('pt-BR');
                }
                requestAnimationFrame(atualizarContagem);
            } else {
                if (contador.classList.contains('contador-porcentagem')) {
                    contador.innerText = alvo + '%';
                } else {
                    contador.innerText = alvo.toLocaleString('pt-BR');
                }
            }
        };
        requestAnimationFrame(atualizarContagem);
    };

    const contadorObserver = new IntersectionObserver((entradas, observer) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                animarContador(entrada.target);
                observer.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.contador, .contador-porcentagem').forEach(c => contadorObserver.observe(c));

    const botaoTema = document.getElementById("toggle-tema");


    // Verifica o tema salvo
    if (localStorage.getItem("tema") === "escuro") {
        document.body.classList.add("modo-escuro");
        botaoTema.textContent = "☀️";
    }

    botaoTema.addEventListener("click", () => {
        document.body.classList.toggle("modo-escuro");
        const estaEscuro = document.body.classList.contains("modo-escuro");

        botaoTema.textContent = estaEscuro ? "☀️" : "🌙";
        localStorage.setItem("tema", estaEscuro ? "escuro" : "claro");
    });

    // Selecionando os elementos
    const modal = document.getElementById("meuModal");
    const btn = document.getElementById("btnContato");
    const span = document.getElementsByClassName("fechar-modal")[0];

    // Quando clicar no botão, abre o modal
    btn.onclick = function () {
        modal.style.display = "block";
    }

    // Quando clicar no "X", fecha o modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // Quando clicar fora da caixa do modal, também fecha
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }


})

document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos baseados nas classes do seu CSS
    const btnMenu = document.querySelector('.menu-hamburguer');
    const menu = document.querySelector('.menu-mobile');
    const overlay = document.querySelector('.menu-overlay');
    
    // Seleciona todos os links dentro do menu mobile (incluindo o botão de destaque)
    const linksMenu = document.querySelectorAll('.menu-mobile a');

    // Função que abre ou fecha o menu
    function toggleMenu() {
        // A classe 'ativo' é a chave que conecta com o seu CSS
        const estaAtivo = menu.classList.contains('ativo');

        if (estaAtivo) {
            fecharMenu();
        } else {
            abrirMenu();
        }
    }

    function abrirMenu() {
        btnMenu.classList.add('ativo');
        menu.classList.add('ativo');
        overlay.classList.add('ativo');
        
        // (Opcional) Trava a rolagem do corpo do site
        document.body.style.overflow = 'hidden'; 
    }

    function fecharMenu() {
        btnMenu.classList.remove('ativo');
        menu.classList.remove('ativo');
        overlay.classList.remove('ativo');
        
        // (Opcional) Destrava a rolagem do corpo do site
        document.body.style.overflow = 'auto';
    }

    // Evento de clique no ícone hamburguer
    btnMenu.addEventListener('click', toggleMenu);

    // Evento de clique no overlay (fundo escuro)
    overlay.addEventListener('click', fecharMenu);

    // Evento para fechar o menu ao clicar em qualquer link
    linksMenu.forEach(link => {
        link.addEventListener('click', fecharMenu);
    });
});