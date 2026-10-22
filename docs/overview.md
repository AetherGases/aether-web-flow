# Overview: papéis, cálculos e integração pendente

A feature/35 separa a apresentação por role. Não cria nem altera permissões: administrator é a role já recebida do ms-auth. Administrador vê a comparação de plantas; analista vê análises recentes e contagens do conjunto recebido. O backend ainda precisa limitar as plantas e análises autorizadas; role sozinha não define esse escopo.

## Regra estatística inicial escolhida

Proposta implementada para demonstração, sem contrato oficial do serviço de análises. A medição atual é comparada às últimas 30 medições anteriores da mesma variável, planta, unidade e regime operacional, sem incluir a própria leitura na referência. A função recebe esse histórico já separado e ordenado cronologicamente; a futura API deve garantir agrupamento, ordem, ausência de duplicatas e autorização.

Média: soma(x)/n. Desvio padrão amostral: sqrt(soma((x-média)^2)/(n-1)). Escore: abs(atual-média)/desvio. Cálculo numérico da variância por Welford.

- Menor que 2: sem alerta estatístico.
- De 2 inclusive até 3 exclusive: alerta alto (warning).
- A partir de 3 inclusive: alerta crítico (critical).
- Menos de 30 leituras, número inválido ou desvio zero: resultado não avaliável (null), nunca afirmar normalidade.

Janela de 30 e aviso em 2 são decisões iniciais do projeto, ajustáveis após validação. O uso de 3 desvios como sinal é inspirado em https://itl.nist.gov/div898/handbook/pmc/section3/pmc31.htm . Isto é uma triagem por escore padronizado, não implementação completa de carta I-MR, diagnóstico de falha nem garantia probabilística para séries autocorrelacionadas/sazonais. Desvio padrão não determina economia em reais ou necessidade de manutenção.

A demonstração em src/mocks/overview.ts usa histórico sintético; não é análise de dados do usuário. O analista não recebe as fixtures de indicadores consolidados ou ranking de plantas do administrador. Não inferir vínculo de planta com base na role. O histórico mostrado ainda é fixture.

## Origem dos blocos / pendências

| Bloco | Regra / origem necessária |
| --- | --- |
| Identidade e role | Sessão real do ms-auth, já integrada |
| Análises realizadas e histórico | Contagem por status no período; confirmar contrato de inventário/análise e estados finais (inventário enviado não significa análise concluída) |
| Plantas ativas | Serviço de organização: plantas autorizadas e definição de ativa |
| Economia gerada e desempenho | Serviço de cálculos: custo/consumo de referência, custo atual, unidade monetária e período comparável; não derivar de desvio padrão |
| Alertas e anomalias críticas | Serviço de análises com séries autorizadas; regra acima é proposta inicial testada no frontend de demonstração |
| Variação percentual | (atual-anterior)/anterior * 100; sem período anterior/base zero: sem comparação |

As fontes locais dos microsserviços são snapshots e não confirmam a versão publicada. Nenhum endpoint novo de overview foi inventado. Antes de implementar GET /api/v1/overview: confirmar endpoints atuais, DTOs, datas/fuso, paginação, unidades e escopo por usuário. O BFF deve agregar/mapear resultados, e o serviço de análises deve ser a fonte oficial do cálculo estatístico. Não publicar fixtures como resposta de API real.

Links corrigidos para as rotas existentes, via React Router. Não existe rota /alerts nem /analysis neste frontend. Não foi adicionado CRUD, dashboard extra ou redirecionamento ao servlet sem contrato de navegação.