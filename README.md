# aether-web-flow
Este é o repositório responsável pelo portal web do ecossistema Aether, responsável pelo gerenciamento e visualização de relatórios via WEB.


### Alto contraste

O controle em Perfil > Configurações aplica alto contraste à aplicação inteira, incluindo sidebar e telas públicas. A preferência fica no `localStorage` do navegador, em `aether.preferences`, com schema `{ "_versao": 1, "highContrast": true }`. Navegação, recarga e logout não desativam a preferência; o usuário pode desligá-la pelo mesmo controle. A escolha é deste navegador, sem sincronização entre dispositivos. Dados incompatíveis são descartados com segurança; se o navegador bloquear o armazenamento, o controle continua funcionando na sessão atual.
