# Dashboard Betinhos — estrutura visual

- `Dashboard.html` &eacute; o artefato de runtime e permanece single-file.
- `.content` centraliza o layout em `--content-max` e controla a separa&ccedil;&atilde;o global com `--section-gap`.
- Escala de espa&ccedil;amento: `--control-gap` (8px), `--card-gap` (12px), `--section-gap` (16px) e `--space-300` (24px na borda da p&aacute;gina).
- `.kpi-row`, `.cgrid` e `.exec-alerts` s&atilde;o grids de card; `.dashboard-section` agrupa m&eacute;tricas, alertas e an&aacute;lises.
- Cards usam `kpi` (m&eacute;trica), `cc` (an&aacute;lise) e `tc` (dados), com superf&iacute;cie e espa&ccedil;amento compartilhados.
- Renderizadores devem preencher IDs existentes; n&atilde;o reconstruir containers de layout em `renderAll()`.
- Motion de abas usa `transform`/`opacity`, 220ms e stagger curto; respeita `prefers-reduced-motion`.

## Contrato Samsung TV

- Alvo validado em codigo: Samsung Q60R 2019, Tizen 5.0, Chromium 63 e firmware 1501.1.
- `.tv-browser` ativa largura total com area segura lateral, tipografia para leitura a distancia e foco visivel.
- O filtro usa Flexbox sem depender de `gap`; os atalhos aparecem uma unica vez e permanecem dentro do painel aberto.
- `tv-compat.js` detecta a versao do Tizen e adiciona fallbacks para `:has()`, container queries, `inset`, CSS Grid e flex gap.
- O bundle `dist/Dashboard.html` continua single-file e e a entrada usada pelo preview legado.
- A validacao automatizada cobre 1920x1080 e 1280x720; a aceitacao final de foco e escala exige a TV fisica.
- Em zoom 125%, a TV Full HD expõe cerca de 1536 CSS px; abaixo de 1600 px, grades de 6/5 KPIs usam 3 colunas e alertas usam 2 colunas.

## Dashboard TV sem scroll

- `applyTvViewportLayout()` mede a viewport real e define `--tv-viewport-height` e `--tv-page-height` apos render, navegacao, filtro e resize.
- Cada aba em `.tv-browser` usa uma grade fechada propria; o documento, a pagina ativa e os paineis nao possuem rolagem.
- O Resumo TV exibe 6 KPIs grandes, 8 alertas e as 2 analises prioritarias. Analises secundarias continuam disponiveis no desktop.
- Rankings e distribuicoes usam Top 3. Tabelas detalhadas usam Top 5 em Full HD e Top 3 abaixo de 1600 CSS px.
- O filtro avancado abre como overlay com reserva de altura, portanto nao desloca nem redimensiona a aba ativa.
- A rotacao automatica entre as 10 abas operacionais continua vinculada a `rotateTvPage()`.
- Contrato validado sem overflow em 1920x1080, 1536x720 e 1280x720.

## Cursor magnetico da TV

- A posicao absoluta do cursor nao participa da selecao do alvo.
- `handleTvPointerNavigation()` acumula o delta relativo do movimento; uma rajada de 4 px gera um passo direcional.
- `moveTvDirectionalTarget()` escolhe o proximo controle visivel na direcao informada usando cone direcional, distancia no eixo e penalidade perpendicular.
- Cards analiticos clicaveis participam da rota; setas laterais de troca de aba continuam excluidas.
- Candidatos com sobreposicao no mesmo eixo sao avaliados antes dos diagonais, mantendo linhas e colunas previsiveis.
- Movimento sustentado repete em intervalos de 80 ms; uma pausa de 120 ms limpa o acumulador e inicia uma nova rajada.
- Coordenadas consecutivas calculam o delta de forma deterministica mesmo quando `movementX` e `movementY` sao inconsistentes; a posicao nunca participa da escolha do alvo.
- O rastreamento da origem comeca na tela do PIN, permitindo que o primeiro movimento apos o desbloqueio ja navegue.
- O controle selecionado recebe foco, contorno reforcado e escala curta. O gesto antigo de tres movimentos foi removido.
- Todo clique de ponteiro e redirecionado ao controle destacado, independentemente da coordenada fisica do cursor.
- O efeito e exclusivo de `.tv-browser`, e removido ao sair da janela e respeita `prefers-reduced-motion`.
- A pagina nao movimenta o cursor do sistema operacional: o magnetismo e uma resposta visual e funcional implementada no documento.
- `tv-cursor-hidden` oculta o ponteiro apenas depois da liberacao do PIN; `tv-cursor-visible` o restaura no diagnostico.
- Ao perder o alvo, o foco criado pelo magnetismo e removido para nao deixar um botao antigo falsamente destacado.
- Setas direcionais e OK/Enter do controle remoto usam `moveTvDirectionalTarget()` e `activateTvDirectionalTarget()`, compartilhando o mesmo foco do cursor invisivel.
- O foco entra com snap de 110 ms, o OK comprime o alvo por 110 ms e uma tentativa sem vizinho produz um deslocamento curto na direcao bloqueada.
