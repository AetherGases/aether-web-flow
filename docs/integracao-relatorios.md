# Envio e análise de relatórios

O web envia um Excel XLSX (até 10 MB), solicita a assinatura ao BFF e faz o upload assinado para o Cloudinary. Nenhum token de sessão nem chave interna é enviado ao navegador. A API key pública e a assinatura temporária fazem parte do contrato do upload assinado.

O BFF registra nome, abordagem de consolidação, nome do arquivo e URL em POST /api/inventories. O nome respeita a regra atual do backend: somente letras e espaços, de 3 a 150 caracteres. O relatório é vinculado à unidade do usuário, tanto analista quanto administrador; não há escolha arbitrária de unidade. Empresa completa permanece indisponível.

O worker do inventory processa o Excel e persiste as emissões e reduções. O web consulta o relatório a cada 5 segundos durante até 10 minutos, enquanto estiver PROCESSING. Depois disso, a consulta pode ser atualizada manualmente. Nenhuma atualização reenvia o Excel ou registra outro relatório. PROCESSING_FAILED e INSUFFICIENT_DATA têm mensagens próprias.

Os resultados usam quantityCo2e (tCO2e), separados por escopo, e as reduções são exibidas separadamente sem subtração automática das emissões brutas. O plano de melhoria é consultado por GET /ai/report/{id}, após verificar o acesso ao relatório no inventory. Os gráficos mostram distribuições reais por categoria, escopo e gás, em tCO2e. Categorias e gases são agrupados pelo identificador do catálogo, preservando registros sem classificação. As séries extensas exibem as cinco maiores parcelas e agrupam as demais em Outros, sem descartar valores. Não há gráficos financeiros ou séries mensais simuladas. As respostas textuais da IA são exibidas como texto, sem executar HTML.

A exportação usa um documento próprio para impressão/PDF, com identificação, período, totais, plano e tabela de emissões. Não imprime sidebar, filtros ou a tela inteira. O botão é liberado apenas com o relatório processado e o plano carregado. O navegador oferece a opção Salvar como PDF; a análise não é recalculada na exportação.

## Configuração do BFF

- MS_INVENTORY_URL: origem do inventory ou gateway.
- MS_CLOUDINARY_URL: origem do ms-cloudinary ou gateway (https://aethergases.org no ambiente publicado).
- MS_AI_URL: origem do hub ou gateway.
- MS_AI_PATH_PREFIX: /hub no gateway; vazio no acesso direto ao hub.

As três origens são configuradas apenas no servidor. Em produção, exigem HTTPS. Se houver CSP no frontend publicado, connect-src precisa permitir https://api.cloudinary.com.

## Validação real antes da aprovação

Confirmar que o usuário tem as permissões de assinatura, registro, consulta do inventory e acesso ao plano no hub. Confirmar que o worker está ativo, com Redis e credenciais internas configurados. Enviar um Excel real de uma unidade e acompanhar até o resultado; testar também dados insuficientes e acesso negado. Testes automatizados usam serviços locais simulados e não comprovam disponibilidade do ambiente publicado.

Se o registro retornar erro ou timeout após o upload, conferir o histórico antes de reenviar: o backend ainda não oferece chave de idempotência para o cadastro. A interface não repete automaticamente o POST.
