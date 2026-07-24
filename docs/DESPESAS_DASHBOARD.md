# Dashboard de despesas

## Fonte e relacionamento

```text
cr40f_despesaoperacional
  -> cr40f_categoriadespesaoperacional (categoria e grupo DRE)
  -> cr40f_formapagamentodespesa (forma e tipo)
  -> cr40f_funcionarios (motorista -> empresa)
  -> cr40f_reservadeveculos (reserva -> cliente, quando vinculada)
  -> cr40f_anexodespesaoperacional (comprovante SharePoint)
```

A empresa é derivada exclusivamente do motorista pelo choice
`cr40f_funcionarios.cr40f_nomedaempresa`:

- `202410000`: BETINHOS
- `202410001`: DEPAULA

Não existe lookup direto de empresa ou cliente na despesa. Cliente só é exibido
quando há reserva vinculada; sem esse vínculo o dashboard mostra `Sem reserva`.

## Métricas

- Despesa realizada: soma de `cr40f_valor`.
- Alimentação: soma da categoria Alimentação. As categorias legadas Almoço, Café, Jantar e Lanche também são aceitas.
- Aguardando pagamento: soma com status financeiro `100000001`.
- Ticket médio: despesa realizada dividida pela quantidade de lançamentos.
- Sem comprovante: status de anexo diferente de Completo e nenhum anexo relacionado.
- Sem reserva vinculada: lookup `cr40f_reserva` vazio.
- Comparativo `ANT.`: período imediatamente anterior com a mesma quantidade de dias.

O dashboard não calcula orçamento ou economia porque as tabelas atuais não
possuem meta orçamentária. Nenhum valor é estimado.

## Carga

A aba é lazy-loaded e usa apenas Dataverse Web API/OData do ambiente atual. O
carregador segue `@odata.nextLink`, portanto inclui todas as páginas. Os mesmos
quatro conjuntos são exportados no snapshot DEV/PROD:

- `cr40f_despesaoperacionals`
- `cr40f_categoriadespesaoperacionals`
- `cr40f_formapagamentodespesas`
- `cr40f_anexodespesaoperacionals`

Não há API externa nem chave adicional.
