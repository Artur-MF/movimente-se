# Vídeo da página principal

A seção `#video-projeto` aparece após a abertura e antes das atividades. O texto fica ao lado do player no desktop e acima no celular. O quadro mantém a proporção 16:9, sem cortar o vídeo.

- `movimente-se.mp4`: vídeo recebido em 12/10/2026, com duração de aproximadamente 5 min 45 s, resolução 848 × 480, vídeo H.264 e áudio AAC. Os fluxos originais foram preservados, sem recompressão; os metadados foram colocados no início do MP4 para reprodução progressiva (`faststart`).
- `movimente-se-capa.webp`: quadro extraído do vídeo em 4 min 07,5 s, usado como capa e poster.

O endereço do MP4 fica em `data-video-src` e só é atribuído ao player ao clicar em “Assistir ao vídeo”. Não há reprodução automática; o player oferece controles nativos e `playsinline` no celular. Sem JavaScript, há um link direto para o vídeo.

Ao publicar, incluir os dois arquivos desta pasta. A hospedagem deve servir MP4 como `video/mp4` e suportar solicitações parciais (HTTP Range) para navegação pelo vídeo. Para substituir o vídeo no futuro, atualizar a capa e a duração exibida em `index.html`.
