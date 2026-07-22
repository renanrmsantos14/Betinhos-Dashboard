# Checklist: Samsung Q60R / Tizen 5.0

- [x] Corrigir largura total e area segura da TV
- [x] Corrigir filtro fechado e aberto
- [x] Ajustar leitura a distancia e foco
- [x] Garantir fallback de recursos CSS modernos
- [x] Atualizar testes de compatibilidade
- [x] Gerar bundle final
- [x] Validar 1920x1080 e 1280x720 no navegador
- [x] Atualizar arquitetura e registrar limites reais
- [x] Corrigir grade no zoom 125% do navegador Samsung
- [x] Validar 1536x720, equivalente ao Full HD em 125%

## Redesign TV sem scroll

- [x] Criar viewport TV fixa sem rolagem
- [x] Transformar filtro avancado em overlay
- [x] Compactar topbar, KPIs e alertas com numeros maiores
- [x] Definir composicao exclusiva para cada aba
- [x] Limitar rankings a Top 3 e tabelas a Top 5
- [x] Preservar rotacao automatica entre abas
- [x] Validar todas as abas em 1920x1080
- [x] Validar protecao em 1536x720 e 1280x720
- [x] Rodar build e todos os testes TV

## Cursor magnetico da TV

- [x] Ignorar a posicao absoluta do cursor
- [x] Converter pequenas rajadas em direita, esquerda, cima ou baixo
- [x] Selecionar espacialmente o proximo controle naquela direcao
- [x] Aplicar destaque visual somente no modo TV
- [x] Redirecionar o clique ao controle destacado
- [x] Manter desktop e mobile sem magnetismo
- [x] Remover o gesto antigo de tres movimentos para trocar abas
- [x] Ocultar o cursor somente apos liberar o dashboard TV
- [x] Manter o cursor visivel na tela de PIN e no diagnostico
- [x] Remover foco fantasma quando nenhum botao estiver magnetizado
- [x] Unificar cursor invisivel, setas e OK no mesmo foco visual
- [x] Priorizar controles alinhados antes de saltos diagonais
- [x] Permitir navegacao direcional pelos cards clicaveis
- [x] Repetir movimentos sustentados a cada 80 ms
- [x] Exibir snap de foco, pressao e limite de rota

## Tempo de pagamento automatico

- [x] Confirmar schema real de `cr40f_pagantes`
- [x] Criar coluna somente no Dataverse DEV
- [x] Implementar plug-in transacional para Create e Update
- [x] Registrar Filtering Attributes e PreImage
- [x] Testar transicao, idempotencia e criacao como Pago no DEV
- [x] Remover registros sinteticos do smoke test
- [x] Integrar prazo medio por cliente no dashboard
- [x] Validar plug-in, dashboard e compatibilidade TV
- [x] Publicar `new_dashboard` somente no DEV
