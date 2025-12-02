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

})