# Dashboard Betinhos — estrutura visual

- `Dashboard.html` &eacute; o artefato de runtime e permanece single-file.
- `.content` centraliza o layout em `--content-max` e controla a separa&ccedil;&atilde;o global com `--section-gap`.
- Escala de espa&ccedil;amento: `--control-gap` (8px), `--card-gap` (12px), `--section-gap` (16px) e `--space-300` (24px na borda da p&aacute;gina).
- `.kpi-row`, `.cgrid` e `.exec-alerts` s&atilde;o grids de card; `.dashboard-section` agrupa m&eacute;tricas, alertas e an&aacute;lises.
- Cards usam `kpi` (m&eacute;trica), `cc` (an&aacute;lise) e `tc` (dados), com superf&iacute;cie e espa&ccedil;amento compartilhados.
- Renderizadores devem preencher IDs existentes; n&atilde;o reconstruir containers de layout em `renderAll()`.
- Motion de abas usa `transform`/`opacity`, 220ms e stagger curto; respeita `prefers-reduced-motion`.
