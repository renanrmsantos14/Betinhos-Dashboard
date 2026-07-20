# Dashboard Betinhos — lógica dos KPIs e valores

**Versão da documentação:** 20/07/2026
**Fonte:** estado atual de `Dashboard.html`
**Objetivo:** explicar, em linguagem de gestão, como cada indicador é calculado, quais registros entram na conta e quais cuidados devem ser considerados na leitura.

## 1. Como ler o dashboard

O dashboard transforma registros operacionais do Dataverse em indicadores de operação, faturamento, recebimento, frota, motoristas, manutenção, multas, trocas e marketing.

Em termos simples:

```text
Dataverse → enriquecimento dos registros → filtros → regras de negócio → KPI, gráfico ou tabela
```

O valor mostrado não é necessariamente a quantidade total existente no banco. Ele depende do filtro ativo e da regra específica do indicador.

### Regra padrão de abertura

Ao carregar o dashboard, o sistema aplica o filtro **Este ano**:

- início: 1º de janeiro do ano atual;
- fim: data atual;
- fuso considerado nas datas: America/Sao_Paulo;
- padrão de referência desta documentação: ano de 2026.

O gestor pode alterar o período por data ou pelos atalhos **Hoje**, **Últimos 7 dias**, **Últimos 30 dias**, **Este mês**, **Mês anterior**, **Este ano** e **Ano anterior**.

## 2. Base usada pelos indicadores de serviços

Os KPIs de reservas, serviços, faturamento e qualidade de dados partem de uma base comum chamada, tecnicamente, `rv`.

Essa base contém somente reservas cuja categoria interna do Dataverse é:

```text
new_categoriadoitem = 100000000  → categoria Serviço
```

Isso evita misturar itens de outras categorias com serviços executivos.

### O que acontece antes da conta

Cada reserva é enriquecida com:

- **Valor:** vem da composição de preço relacionada, campo `new_valortotal`;
- **Composição de preço pendente:** status interno `100000000`;
- **Composição de preço concluída:** status interno `100000001`;
- **Motorista:** nome, apelido e identificador;
- **Cliente:** nome ou `Sem cliente`;
- **Status da reserva e do faturamento:** rótulos formatados pelo Dataverse;
- **OP/financeiro:** identificador do lookup `_cr40f_financeiro_value`;
- **Veículo:** identificador, nome e tipo;
- **Data de saída:** `cr40f_dataehorriodesada`.

Quando não existe composição de preço relacionada, o valor da reserva passa a ser **R$ 0,00**. Esse registro pode continuar aparecendo em contagens operacionais, mas não gera faturamento nem ticket médio.

## 3. Filtros e comparação de períodos

### Filtros principais

Os filtros de reservas podem ser combinados:

- período de início e fim;
- status da reserva;
- cliente;
- motorista;
- tipo de veículo.

Os filtros são aplicados antes da renderização dos KPIs de serviços. A seleção é inclusiva: se um filtro não tiver seleção, todos os valores daquela dimensão entram.

### Comparativos LM e LY

Quando o período selecionado corresponde ao mês atual, o dashboard pode exibir comparativos:

- **LM — Last Month:** mesmo intervalo do mês anterior;
- **LY — Last Year:** mesmo intervalo do ano anterior.

A variação percentual é:

```text
Variação (%) = ((valor atual - valor comparado) / valor comparado) × 100
```

Se não houver base de comparação, o indicador mostra `s/dado`, em vez de inventar uma variação.

### Interpretação de períodos históricos

- Dados do Dataverse são usados para os períodos carregados na operação atual.
- As séries históricas de 2023, 2024 e 2025 usam arrays históricos fixos no arquivo.
- Para períodos sem dados transacionais, o código pode recorrer ao histórico fixo para faturamento.
- Portanto, gráfico histórico e KPI operacional atual podem ter origens diferentes. A leitura deve considerar a indicação do período e da fonte.

## 4. KPIs executivos da página Resumo

### Faturamento

**O que responde:** qual valor financeiro está associado aos serviços considerados no período.

**Cálculo principal:**

```text
Faturamento = soma do valor (_valor) de todas as reservas Serviço dentro do recorte
```

Com início ou fim preenchido, o sistema calcula o valor das reservas do intervalo selecionado. Sem filtro de data, o valor exibido em `Faturamento` combina o valor atual do Dataverse com o histórico fixo de 2023–2025.

**Não entra:** reservas fora da categoria Serviço. Registros sem valor entram na contagem operacional, mas somam zero.

### Serviços - VALIDADO

**O que responde:** quantos serviços Serviço existem no recorte.

```text
Serviços = quantidade de reservas Serviço filtradas
```

Não depende de o serviço ter valor, OP, cliente, motorista ou veículo preenchido. Esses problemas são tratados nos indicadores de qualidade.

### Ticket médio - VALIDADO

**O que responde:** valor médio dos serviços com composição de preço concluída.

```text
Ticket médio = soma dos valores elegíveis / quantidade de serviços elegíveis
```

Um serviço é elegível quando:

- a composição de preço está concluída;
- o valor é maior que zero.

Serviços sem preço ou com valor zero não entram no numerador nem no denominador.

### A receber - VALIDADO

**O que responde:** quanto ainda pode ser recebido de serviços já precificados e com OP/financeiro vinculado.

```text
A receber = soma do valor dos serviços que:
  1. têm composição de preço concluída;
  2. têm OP/financeiro vinculado;
  3. não estão com status de faturamento Pago;
  4. têm valor maior que zero.
```

Este indicador é financeiro e não é igual à simples soma de registros de pagamento pendentes.

O percentual exibido ao lado é:

```text
% pendente do faturamento = A receber / Faturamento × 100
```

Se o faturamento for zero, o percentual é zero.

### CP pendente - VALIDADO

**CP** significa composição de preço.

**O que responde:** quantos serviços concluídos ainda precisam de composição de preço concluída.

Um registro entra quando:

- existe composição de preço;
- a composição está pendente;
- o serviço está concluído/realizado/finalizado;
- o status de faturamento contém `pendente`;
- a categoria é Serviço;
- a composição de preço ainda não foi contada antes.

A contagem é deduplicada pelo identificador da composição de preço. Assim, várias linhas relacionadas à mesma composição não inflacionam o KPI.

O valor **PROJ** mostrado no cartão é uma estimativa operacional:

```text
Projeção CP pendente = Ticket médio atual × quantidade de CPs pendentes
```

É projeção, não valor confirmado de venda.

### Recebimento - VALIDADO

**O que responde:** qual percentual da base elegível já foi marcado como pago.

O status interno de faturamento considerado como pago é `202410010`.

```text
Recebido = soma dos serviços com status Pago e valor maior que zero

Base de recebimento = soma dos serviços com valor maior que zero,
                      exceto status Pagante em viagem e Mensal

Recebimento (%) = Recebido / Base de recebimento × 100
```

O cartão também mostra os valores no formato **recebido de base**. A base pode ser diferente do faturamento total porque exclui modalidades que não fazem parte deste cálculo.

**Status de validação:** o card de **Recebimento** está completamente validado e correto para a regra, os status e a base de dados atualmente implementados no dashboard.

### Manutenções - VALIDADO

**O que responde:** quantidade de registros de manutenção no período aplicado à data da manutenção.

```text
Manutenções = quantidade de registros em VW.manutencoes
```

O custo associado é calculado separadamente:

```text
Custo total = soma de cr40f_valor
```

O percentual de custo da receita é:

```text
Custo / Faturamento × 100
```

### Multas - VALIDADO

**O que responde:** quantidade de multas no período aplicado à data da multa.

```text
Multas = quantidade de registros de multa filtrados
```

O cartão de pendências usa o status interno `cr40f_status = 202410000`, correspondente à situação operacional de notificação ao condutor.

```text
% multas pendentes = multas pendentes / multas totais × 100
```

### CNH próxima ou vencida - VALIDADO

**O que responde:** quantos funcionários estão com risco documental.

Um motorista entra quando:

- não possui data de validade de CNH; ou
- a CNH vence em menos de 90 dias; ou
- a validade já passou.

```text
CNH em atenção = funcionários sem validade ou com validade < 90 dias
```

Este indicador usa a tabela de funcionários e não é limitado pelo número de serviços do período.

### Frota ativa - VALIDADO

**O que responde:** quantos veículos estão em condição operacional conforme o status cadastrado.

Um veículo é contado como ativo quando o texto do status contém `disponível` ou `ativo`.

```text
Frota ativa = veículos com status Disponível ou Ativo
```

O texto secundário mostra o total geral de veículos cadastrados, que pode incluir veículos fora de operação.

## 5. Alertas executivos e qualidade dos dados

### OS sem veículo

Conta reservas Serviço que:

- possuem motorista;
- não possuem veículo relacionado;
- possuem data de saída válida;
- possuem saída até o momento atual.

```text
OS sem veículo = motorista preenchido + veículo vazio + saída passada
```

O alerta indica falha de alocação ou de cadastro. Não representa automaticamente indisponibilidade de frota.

### Sem OP

Conta serviços que:

- estão concluídos/realizados/finalizados;
- têm faturamento pendente;
- não possuem OP/financeiro vinculado.

```text
Sem OP = serviço produzido + faturamento pendente + financeiro vazio
```

### Sem motorista

Conta serviços que:

- não possuem motorista;
- têm saída entre 10/04/2026 e o momento atual;
- estão em status interno Confirmado (`202410001`), Programado (`202410005`) ou Concluído (`202410008`);
- pertencem à categoria Serviço.

O recorte de data evita que o alerta misture registros antigos fora da janela operacional definida.

### Sem cliente

```text
Sem cliente = serviço com saída a partir de 01/04/2026 e cliente igual a Sem cliente
```

O alerta mede qualidade cadastral. Não significa necessariamente que a operação não tenha cliente real; significa que o relacionamento não está preenchido no registro carregado.

### Número de ocorrências

**O que responde:** quantos erros operacionais foram registrados no período e qual a frequência em relação aos serviços.

Fonte específica do indicador:

- tabela lógica: `cr40f_errooperacional`;
- conjunto consultado: `cr40f_errooperacionals`;
- data da ocorrência: `cr40f_dataocorrencia`;
- origem funcional: aba **Ocorrências** do repo irmão **Módulo Qualidade / Gestão de Erros Operacionais**.

```text
Número de ocorrências = quantidade de registros de erro operacional no período
% dos serviços = número de ocorrências / total de serviços × 100
1 a cada X = total de serviços / número de ocorrências
```

Regras:

- cada registro da tabela de erros operacionais conta como uma ocorrência;
- o status não elimina a ocorrência: Novo, Em tratamento, Resolvido, Encerrado e Cancelado entram;
- com filtro de data, somente registros cuja `cr40f_dataocorrencia` está no intervalo entram;
- sem filtro de data, todos os registros carregados entram;
- o denominador é o total de serviços filtrados no mesmo período;
- `1 a cada X` é arredondado para o inteiro mais próximo; sem serviços ou sem ocorrências, aparece `s/dado`.

O card é operacional: quanto menor o percentual de ocorrências em relação aos serviços, melhor. Ele não mede gravidade nem tempo de resolução.

## 6. Análises da página Resumo

### Total produzido

O cartão reaproveita o valor de faturamento produzido no recorte atual. Quando há filtro de data, usa a soma do período; sem filtro de data, usa a combinação do Dataverse com os históricos fixos de 2023–2025.

O gráfico de três anos usa:

- Dataverse para anos transacionais disponíveis;
- arrays históricos para 2023–2025 quando necessário.

### Meta × realizado

O realizado mensal é a soma dos valores dos serviços do mês. A meta mensal é calculada com base ponderada no histórico:

```text
Base da meta = 50% do mesmo mês do ano anterior
             + 40% do mesmo mês de dois anos atrás
             + 10% do mesmo mês de três anos atrás

Meta mensal = Base da meta × 1,13
```

O resultado mensal é:

```text
Atingimento (%) = realizado do mês / meta do mês × 100
```

O total do quadro soma as metas mensais e os realizados mensais. Para um período parcial, o cartão de progresso usa ainda uma meta proporcional aos dias do período:

```text
Meta proporcional do mês = meta mensal / dias do mês × dias selecionados
```

### Faturamento por cliente

O destaque mostra o cliente com maior faturamento entre os serviços do recorte:

```text
Faturamento do cliente = soma do valor dos serviços daquele cliente
```

Clientes classificados como `Sem cliente` não entram no ranking de clientes ativos.

O gráfico apresenta até seis clientes, ordenados pelo faturamento.

### Ticket médio mensal

Para cada mês com registros:

```text
Ticket médio mensal = valor elegível do mês / quantidade elegível do mês
```

Usa a mesma regra de elegibilidade do ticket médio geral: composição concluída e valor maior que zero.

### Status dos serviços

Mostra a distribuição das reservas Serviço por status cadastrado.

```text
Participação do status = quantidade no status / total de serviços × 100
```

O destaque de concluídos usa o reconhecimento textual de concluído, realizado ou finalizado. Cancelados incluem status contendo `cancel` ou `recus`.

### Custo da frota — manutenções

```text
Custo da frota = soma do valor das manutenções do recorte
% da receita = custo da frota / faturamento × 100
```

O cartão sinaliza como referência de atenção quando o custo ultrapassa 10% do faturamento, mas essa comparação é um sinal gerencial, não uma regra contábil.

### Top clientes por volume

Ordena clientes pela quantidade de serviços e mostra o primeiro colocado.

```text
Volume do cliente = quantidade de serviços do cliente
Participação = volume do cliente / total de serviços × 100
```

### Top clientes por faturamento

Ordena clientes pela soma de valores e mostra o primeiro colocado.

```text
Participação financeira = faturamento do cliente / faturamento total × 100
```

### Serviços por motorista

Conta motoristas distintos vinculados aos serviços Serviço, excluindo `Sem motorista`.

O ranking individual mostra:

- quantidade de serviços;
- faturamento dos serviços do motorista;
- ticket médio dos serviços elegíveis;
- participação sobre o faturamento total;
- validade da CNH.

## 7. Página Serviços

### Operação

O resumo operacional reúne:

- total de serviços: `rv.length`;
- concluídos: serviços reconhecidos como concluídos/realizados/finalizados;
- total de serviços, concluídos e cancelados;
- cancelados: status contendo cancelado ou recusado.

### Financeiro

O resumo financeiro reúne:

- ticket médio;
- quantidade de CP pendente;
- valor de A receber.

As tabelas por tipo de serviço e tipo de veículo mostram, para cada grupo:

```text
Quantidade = número de serviços do grupo
Faturamento = soma dos valores do grupo
% quantidade = quantidade do grupo / quantidade total
% faturamento = faturamento do grupo / faturamento total
```

## 8. Página Faturamento

### Faturamento total

É a mesma soma de `fat` usada na base Serviço.

### Ticket médio

É o ticket médio elegível do recorte, conforme regra da seção 4.

### Maior serviço

```text
Maior serviço = maior valor individual (_valor) entre as reservas filtradas
```

Não é o maior faturamento por cliente; é o maior valor de uma única reserva.

### Clientes ativos

```text
Clientes ativos = quantidade de clientes distintos com nome diferente de Sem cliente
```

### Faturamento por cliente

Cada linha calcula quantidade, faturamento e ticket médio do cliente. A participação financeira é:

```text
Faturamento do cliente / faturamento total × 100
```

### Status de faturamento

Agrupa os serviços pelo status de faturamento. Para cada status, apresenta quantidade de serviços, valor acumulado e participação sobre o total filtrado.

## 9. Página Pagamentos

Esta página usa a tabela de **pagantes**, não a mesma coleção de reservas usada para o KPI de serviços.

### Total recebido

O status interno de pagamento recebido é `cr40f_status = 202410002`.

Na página, o valor exibido é a soma dos pagamentos considerados recebidos e vinculados ao resumo financeiro de serviços produzidos. Se o resumo não fornecer valor recebido, o código usa a soma dos registros de pagamento recebidos.

### A receber

Reapresenta o valor de A receber calculado a partir das reservas com composição concluída, OP vinculada, status diferente de Pago e valor positivo.

### Cartão

Soma pagamentos recebidos cuja forma contenha termos reconhecidos como:

- cartão;
- crédito;
- link;
- máquina.

```text
Cartão recebido = soma do valor dos pagamentos recebidos por forma reconhecida como cartão
```

### Tempo de pagamento

O valor atual é `s/dado`.

O carregamento atual não traz data de pagamento/baixa nem data de vencimento. Sem esses campos, não é possível calcular prazo médio ou atraso com segurança.

### Tabelas de pagamentos

As distribuições por forma e status mostram:

- quantidade de registros;
- soma dos valores;
- participação por valor, e não apenas por quantidade.

## 10. Página Frota

### KPIs cadastrais

- **Total:** quantidade de veículos carregados.
- **Disponíveis:** status contendo disponível, ativo ou livre.
- **Blindados:** campo de blindagem igual a `true`, `"true"` ou `1`.
- **Em manutenção:** status contendo manutenção.

### Categorias de manutenção

Os tipos de reparo são normalizados por palavras-chave:

| Categoria | Palavras reconhecidas |
|---|---|
| Preventiva programada | preventiva, revisão, óleo |
| Preventiva por condição | condição, pneu, elétrica, ar condicionado |
| Corretiva crítica | crítica, pane, emergência |
| Conservação | conservação, conforto, imagem, limpeza, funilaria |
| Avaria | avaria, sinistro, colisão |
| Corretiva não crítica | demais tipos não enquadrados acima |

Os seis KPIs de categoria são contagens de manutenções classificadas dessa forma.

### KPIs de manutenção

| Indicador | Cálculo | Meta exibida |
|---|---|---|
| Preventiva programada no prazo | manutenções com data de aprovação e data de execução; considera no prazo quando diferença entre execução e aprovação está entre 0 e 10 dias | ≥ 98% |
| Preventiva por condição | quantidade da categoria; sem validação de pane vinculada | 0 panes |
| Corretiva não crítica | quantidade da categoria | ≤ 5 no mês |
| Corretiva crítica/emergencial | quantidade da categoria | 0 no mês |
| Conservação, conforto e imagem | quantidade da categoria; sem validação de inspeção aprovada | ≥ 95% |
| Avaria ou sinistro preventável | quantidade da categoria | 0 no mês |

Quando a informação necessária não existe, o resultado aparece como `s/dado` e a cobertura mostra quantos registros puderam ser medidos.

### Uso da frota própria

Entram somente veículos cuja categoria contém `próprio` e serviços reserváveis, isto é, serviços cujo status não contém cancelado ou recusado.

Para cada dia do período:

```text
Veículos usados = quantidade de veículos próprios distintos com serviço naquele dia
Veículos livres = total de veículos próprios - veículos usados
Uso diário (%) = veículos usados / total de veículos próprios × 100
```

O dashboard calcula médias separadas para dias úteis e fins de semana. A média percentual é ponderada pela quantidade de dias válidos.

## 11. Página Motoristas

- **Total motoristas:** quantidade de registros na tabela de funcionários.
- **CNH vencida/próx.:** mesma regra de CNH do Resumo: sem validade ou menos de 90 dias para vencer.
- **Serviços no período:** quantidade de serviços Serviço filtrados.

O ranking calcula por motorista:

```text
Serviços = quantidade de reservas vinculadas ao motorista
Faturamento = soma dos valores dessas reservas
Ticket médio = somente serviços com composição concluída e valor > 0
Participação = faturamento do motorista / faturamento total × 100
```

Motoristas sem serviço no recorte continuam podendo aparecer porque o ranking parte da tabela de funcionários.

## 12. Página Manutenções

- **Total:** quantidade de manutenções no recorte da data de manutenção.
- **Custo total:** soma de `cr40f_valor`.
- **Em andamento:** status contendo em andamento, aberto ou pendente.
- **Custo médio:** custo total dividido pela quantidade de manutenções; zero quando não há registros.

O gráfico mensal soma custos por mês. A tabela por tipo de reparo apresenta quantidade, valor e participação por valor.

## 13. Página Multas

- **Total multas:** quantidade de multas no recorte da data da multa.
- **Pendentes:** status interno `202410000`.
- **Resolvidas:** status textual contendo pago, resolvido ou concluído.

As tabelas agrupam as multas por status, motorista e tipo/código de infração. As listas analíticas priorizam grupos com maior participação; não devem ser interpretadas como garantia de que todos os grupos menores estejam destacados no primeiro quadro.

## 14. Página Trocas

- **Total trocas:** quantidade de trocas no recorte da data da troca.
- **Pendentes:** status contendo pendente ou aguardando.
- **Concluídas:** status contendo concluído ou realizado.

As tabelas mostram distribuição por status e tipo de troca. Não há valor financeiro calculado nessa página.

## 15. Página Marketing

- **Total publicações:** quantidade de registros de marketing carregados.
- **Publicadas:** status contendo publicado ou ativo.
- **Em produção:** status contendo produção, pendente ou rascunho.

As tabelas agrupam publicações por categoria e status. A página não usa a base de reservas Serviço.

## 16. Regras de apresentação dos valores

- Valores monetários são formatados em BRL.
- Valores a partir de mil podem aparecer abreviados como `R$ 1,2k`.
- Valores a partir de um milhão podem aparecer como `R$ 1,20M`.
- Percentuais de cartões executivos são arredondados para apresentação; tabelas podem mostrar uma casa decimal.
- Divisões sem base válida retornam zero ou `s/dado`, conforme o indicador.
- `—` significa ausência de valor disponível para renderização; não significa necessariamente zero.
- As tabelas operacionais são limitadas visualmente para preservar desempenho, embora o KPI seja calculado sobre a coleção carregada.

## 17. Limites para decisão gerencial

1. **Faturamento não é recebimento.** Faturamento mede valor dos serviços; recebimento mede o que foi marcado como pago segundo regras próprias.
2. **A receber não é dívida contábil definitiva.** É uma visão operacional baseada em composição concluída, OP vinculada, status não pago e valor positivo.
3. **CP pendente é falha de preparação financeira.** A projeção associada usa ticket médio atual e não substitui a composição real.
4. **Qualidade de dados depende do cadastro.** “Sem cliente”, “Sem OP”, “Sem motorista” e “OS sem veículo” indicam registros incompletos segundo os campos carregados.
5. **Tempo de pagamento não está calculado.** Faltam datas de baixa e vencimento no fetch atual.
6. **Comparação histórica exige atenção à fonte.** 2023–2025 podem vir de dados históricos fixos, enquanto a operação atual vem do Dataverse.
7. **Metas são gerenciais.** A fórmula histórica ponderada mais 13% é uma convenção de acompanhamento, não uma previsão estatística nem um valor contábil.

## 18. Referência técnica resumida

Principais pontos do código que sustentam esta documentação:

- `enrichReservas()`: associa composição de preço, valor, cliente, motorista, veículo e OP;
- `applyF()`: aplica período e filtros de status, cliente, motorista e tipo de veículo;
- `renderAll()`: cria a base Serviço e calcula os KPIs executivos;
- `getTicketStats()`: calcula ticket médio elegível;
- `getRecebimentoStats()`: calcula recebido, base e percentual de recebimento;
- `ocorrenciasOperacionais`: filtra os erros operacionais pelo período selecionado;
- `loadErrosOperacionais()`: carrega somente no Resumo a tabela `cr40f_errooperacionals` do Módulo Qualidade;
- `getMetaParaPeriodoProporcional()`: calcula meta proporcional por dias;
- `calcularMetaMensal()`: aplica a fórmula histórica da meta;
- `renderFaturamento()`: renderiza faturamento, clientes e status de faturamento;
- `renderPagamentos()`: renderiza recebimentos e pagamentos;
- `renderFrota()`: renderiza frota própria, uso e manutenção;
- `renderMotoristas()`: renderiza ranking e serviços por motorista;
- `renderManutencoes()`, `renderMultas()`, `renderTrocas()` e `renderMarketing()`: renderizam as páginas operacionais correspondentes.

### Cards removidos

O dashboard não possui mais card **Programados** nem indicador **Pendentes/Prog.**. Também não existe mais cálculo ou percentual baseado nesses conceitos. Status como `Programado` continuam documentados apenas quando fazem parte de outra regra existente, como a identificação de serviços sem motorista; isso não recria o card removido.

Este documento descreve o comportamento do código atual. Qualquer alteração em campos Dataverse, status, categorias, fórmula de meta ou regra de filtro deve atualizar esta documentação junto com o dashboard.
