# Auditoria mobile — Movimente-se

Data da revisão: 22/08/2026

## Escopo validado

Foram auditadas as páginas `index.html`, `atividades.html`, `sobre.html`, `equipe.html` e `login.html` em 45 combinações de página e viewport. A matriz incluiu 320, 360, 390, 421, 680, 681, 960, 961 e 1280 px, além de 680 × 375 px para representar celular em orientação horizontal.

Os testes cobriram layout, rolagem horizontal, imagens quebradas, áreas de toque, menu móvel, navegação por teclado, abas da equipe, tema claro/escuro, semântica básica, erros no console e regressão visual do desktop.

## Diagnóstico

### Problemas prioritários encontrados e corrigidos

1. **CTA inacessível no menu em orientação horizontal.** O painel tinha conteúdo maior que a altura da tela, mas não permitia rolagem interna. O menu agora rola, respeita áreas seguras e evita que o gesto continue na página ao fundo.
2. **Botão do menu abaixo do tamanho de toque recomendado em 320 px.** O flexbox reduzia o botão de 48 para 38 px. O botão agora preserva 48 × 48 px e o espaçamento do cabeçalho se adapta às telas estreitas.
3. **Títulos longos excessivamente altos.** Os títulos das páginas institucionais chegavam a ocupar de cinco a sete linhas. A escala tipográfica e o espaçamento foram ajustados apenas nos breakpoints móveis.
4. **Áreas de toque pequenas.** Links de cards, rodapé e retorno do login tinham somente a altura do texto. No mobile, passam a oferecer pelo menos 44 px de altura.
5. **Descrições cortadas em cards verticais.** O limite de três linhas continuava ativo mesmo quando o card já usava uma coluna. Em até 420 px, o texto volta a ser exibido integralmente.
6. **Foco incompleto no menu.** O ciclo de teclado não alcançava corretamente o botão de fechar e o restante da página continuava disponível para tecnologias assistivas. O menu agora isola temporariamente o conteúdo de fundo e mantém o foco entre links e botão de fechamento.
7. **Navegação inconsistente nas abas em layout vertical.** As abas respondiam apenas às setas horizontais. Agora também aceitam `ArrowUp` e `ArrowDown`, e seus painéis podem receber foco.
8. **Imagens pesadas na página da equipe.** Os PNGs usados pelos cartões somavam aproximadamente 19,4 MB. As versões WebP equivalentes somam 1,2 MB, uma redução próxima de 94%, sem mudar o enquadramento dos cartões.
9. **Entrega de imagens maior que a tela.** As fotografias dos projetos agora possuem alternativas de 480, 800 e 1200 px. Em 320 px, por exemplo, o navegador selecionou a versão de 480 px do hero em vez da imagem de 1600 px.
10. **Logo superdimensionado.** O arquivo exibido a 42 px caiu de 117 KB para 6 KB, preservando a aparência.
11. **Risco de deslocamento de layout.** As duas imagens que não declaravam dimensões agora reservam corretamente seu espaço antes de carregar.
12. **Uso prolongado de memória pelas animações.** A dica de aceleração gráfica é removida depois que cada animação termina.
13. **Cor da interface do navegador divergente do tema.** A meta `theme-color` agora acompanha o tema claro ou escuro.

### Pontos de arquitetura e manutenção

- O CSS atual usa uma base voltada ao desktop e adaptações por `max-width`; portanto, a implementação não é tecnicamente mobile-first, embora a experiência móvel agora esteja priorizada e validada. Uma conversão completa para regras base móveis e expansão por `min-width` deve ser tratada como refatoração separada, com testes visuais de todas as páginas.
- Cabeçalho e rodapé são repetidos em cada arquivo HTML. Isso aumenta o risco de correções ou links ficarem diferentes entre páginas. A consolidação exigiria um sistema de templates ou componentes e não foi feita para evitar ampliar o escopo e afetar o desktop.
- Há várias pastas com imagens originais, duplicadas e otimizadas. Os arquivos antigos foram preservados porque podem existir referências externas ou usos ainda não mapeados. Uma limpeza deve ocorrer somente depois de confirmar essas dependências.
- O CSS solicita `Manrope` e `Source Sans 3`, mas o projeto não carrega esses arquivos nem importa uma fonte remota. Atualmente o navegador usa as alternativas do sistema. Corrigir isso mudaria a tipografia também no desktop e, por isso, depende de autorização específica.

## Pendências que exigem confirmação

1. A página inicial publica `+500 famílias`, `13 ações` e `14 meses`, enquanto `CONTEXTUALIZACAO_PROJETO.md` registra `+300 famílias`, `8 ações` e `6 meses`. É necessário confirmar qual conjunto é oficial antes de editar.
2. O formulário de login aponta para `/login`, mas o diretório auditado é um site estático e não contém a implementação desse endpoint. A interface e a validação do formulário foram verificadas; autenticação, mensagens do servidor e recuperação de erro dependem do backend.
3. Caso a tipografia Manrope/Source Sans 3 seja obrigatória, será preciso fornecer os arquivos locais ou aprovar seu carregamento por um provedor externo.

## Resultado dos testes finais

- 45 combinações de página e viewport sem rolagem horizontal indesejada.
- Nenhuma imagem quebrada nas páginas e abas testadas.
- Nenhum ID duplicado, controle sem nome acessível, imagem sem texto alternativo, campo sem rótulo ou link externo sem `noopener`.
- Nenhum erro ou aviso registrado no console durante a navegação testada.
- Menu rolável e CTA acessível em 680 × 375 px.
- Ciclo de foco do menu e navegação vertical das abas validados.
- Em 1280 px, os valores de referência do desktop permaneceram iguais: cabeçalho de 72 px e título principal de 86,4 px, sem overflow.

## Arquivos alterados

- `css/style.css`
- `js/script.js`
- `index.html`
- `atividades.html`
- `sobre.html`
- `equipe.html`
- `login.html`
- novas imagens em `assets/optimized/fotos_equipe/`, `assets/optimized/responsive/` e `assets/optimized/logo.webp`
