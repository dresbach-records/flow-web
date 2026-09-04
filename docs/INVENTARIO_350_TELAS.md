# FLOW — INVENTÁRIO DESKTOP — 350 TELAS

Documento mestre para implementação/auditoria das telas desktop do FLOW.

Regras globais: cabeçalho fixo; navegação lateral; responsividade; Light/Dark; estados loading/vazio/erro/sucesso; ações ligadas a rotas e serviços reais; persistência real; sem botões decorativos.

| ID | Módulo | Tela | Rota | Finalidade | Ações |
|---:|---|---|---|---|---|
| 1 | Autenticação | Login | `/login` | Entrar na conta | Entrar;Recuperar senha;Criar conta |
| 2 | Autenticação | Criar conta | `/cadastro` | Cadastro de novo usuário | Criar;Validar dados;Aceitar termos |
| 3 | Autenticação | Recuperar senha | `/recuperar-senha` | Solicitar recuperação | Enviar código |
| 4 | Autenticação | Redefinir senha | `/redefinir-senha` | Definir nova senha | Salvar senha |
| 5 | Autenticação | Verificar e-mail | `/verificar-email` | Confirmar e-mail | Reenviar código;Confirmar |
| 6 | Autenticação | Verificar telefone | `/verificar-telefone` | Confirmar telefone | Enviar código;Confirmar |
| 7 | Autenticação | Código de confirmação | `/confirmacao` | Validar código | Confirmar;Reenviar |
| 8 | Autenticação | Autenticação 2FA | `/seguranca/2fa` | Segundo fator | Validar;Usar método alternativo |
| 9 | Autenticação | Escolher método 2FA | `/seguranca/2fa/metodo` | Selecionar método | Aplicativo;SMS;E-mail |
| 10 | Autenticação | Códigos de backup | `/seguranca/2fa/backup` | Gerenciar códigos de recuperação | Gerar;Copiar;Baixar |
| 11 | Autenticação | Sessões e dispositivos | `/seguranca/sessoes` | Controlar sessões | Encerrar sessão;Ver dispositivo |
| 12 | Autenticação | Conta bloqueada | `/conta/bloqueada` | Orientar desbloqueio | Recorrer;Ajuda |
| 13 | Autenticação | Conta desativada | `/conta/desativada` | Exibir conta desativada | Recorrer;Ajuda |
| 14 | Autenticação | Conta suspensa | `/conta/suspensa` | Exibir suspensão | Recorrer;Ver motivo |
| 15 | Autenticação | Central de Contas | `/central-contas` | Gerenciar contas vinculadas | Adicionar;Remover;Configurar |
| 16 | Autenticação | Preferências da conta | `/configuracoes/conta` | Preferências gerais | Salvar |
| 17 | Autenticação | Confirmação de identidade | `/seguranca/identidade` | Validar identidade | Enviar documento;Status |
| 18 | Autenticação | Termos e privacidade | `/legal/termos` | Consultar termos | Abrir documentos |
| 19 | Autenticação | Consentimentos | `/legal/consentimentos` | Gerenciar consentimentos | Aceitar;Revogar |
| 20 | Autenticação | Preferências de cookies | `/configuracoes/cookies` | Gerenciar cookies | Salvar preferências |
| 21 | Feed e publicações | Feed — Para você | `/app?feed=for-you` | Conteúdo recomendado | Curtir;Comentar;Compartilhar;Salvar |
| 22 | Feed e publicações | Feed — Seguindo | `/app?feed=following` | Conteúdo de contas seguidas | Curtir;Comentar;Compartilhar;Salvar |
| 23 | Feed e publicações | Feed principal | `/app` | Página principal do FLOW | Navegar;Atualizar |
| 24 | Feed e publicações | Criar publicação | `/app/criar` | Iniciar publicação | Texto;Foto;Vídeo;Agendar |
| 25 | Feed e publicações | Publicação de texto | `/app/criar/texto` | Criar texto | Publicar;Agendar;Rascunho |
| 26 | Feed e publicações | Publicação com foto | `/app/criar/foto` | Criar publicação com imagem | Upload;Editar;Publicar |
| 27 | Feed e publicações | Publicação com vídeo | `/app/criar/video` | Criar publicação com vídeo | Upload;Editar;Som;Publicar |
| 28 | Feed e publicações | Enquete | `/app/criar/enquete` | Criar enquete | Adicionar opções;Publicar |
| 29 | Feed e publicações | Sentimento e atividade | `/app/criar/sentimento` | Adicionar sentimento/atividade | Selecionar;Salvar |
| 30 | Feed e publicações | Adicionar localização | `/app/criar/localizacao` | Adicionar localização | Pesquisar;Selecionar |
| 31 | Feed e publicações | Marcar pessoas | `/app/criar/marcar` | Marcar usuários | Pesquisar;Selecionar |
| 32 | Feed e publicações | Selecionar público | `/app/criar/publico` | Definir visibilidade | Público;Seguidores;Personalizado |
| 33 | Feed e publicações | Agendar publicação | `/app/criar/agendar` | Definir data e hora | Agendar;Salvar rascunho |
| 34 | Feed e publicações | Rascunhos | `/app/rascunhos` | Gerenciar rascunhos | Editar;Excluir;Publicar |
| 35 | Feed e publicações | Editar publicação | `/app/publicacao/:id/editar` | Editar conteúdo publicado | Salvar;Cancelar |
| 36 | Feed e publicações | Excluir publicação | `/app/publicacao/:id/excluir` | Confirmar exclusão | Excluir;Cancelar |
| 37 | Feed e publicações | Ocultar publicação | `/app/publicacao/:id/ocultar` | Ocultar conteúdo | Confirmar;Cancelar |
| 38 | Feed e publicações | Salvar publicação | `/app/publicacao/:id/salvar` | Salvar conteúdo | Salvar;Remover dos salvos |
| 39 | Feed e publicações | Publicações salvas | `/app/salvos/publicacoes` | Consultar publicações salvas | Abrir;Remover |
| 40 | Feed e publicações | Compartilhar publicação | `/app/publicacao/:id/compartilhar` | Compartilhar conteúdo | Compartilhar;Copiar link |
| 41 | Feed e publicações | Copiar link | `/app/publicacao/:id/link` | Obter link da publicação | Copiar |
| 42 | Feed e publicações | Denunciar conteúdo | `/app/publicacao/:id/denunciar` | Enviar denúncia | Selecionar motivo;Enviar |
| 43 | Feed e publicações | Bloquear usuário | `/app/usuario/:id/bloquear` | Bloquear conta | Bloquear;Cancelar |
| 44 | Feed e publicações | Silenciar usuário | `/app/usuario/:id/silenciar` | Silenciar conteúdo | Silenciar;Cancelar |
| 45 | Feed e publicações | Ver menos conteúdo | `/app/publicacao/:id/preferencias` | Ajustar recomendação | Confirmar |
| 46 | Feed e publicações | Por que estou vendo isso? | `/app/publicacao/:id/contexto` | Explicar recomendação | Ver detalhes |
| 47 | Feed e publicações | Comentários da publicação | `/app/publicacao/:id/comentarios` | Lista de comentários | Comentar;Curtir;Responder |
| 48 | Feed e publicações | Respostas de comentário | `/app/comentario/:id` | Thread de respostas | Responder;Curtir;Denunciar |
| 49 | Feed e publicações | Curtidas da publicação | `/app/publicacao/:id/curtidas` | Lista de interações | Ver perfil |
| 50 | Feed e publicações | Compartilhamento da publicação | `/app/publicacao/:id/compartilhamentos` | Interações de compartilhamento | Ver conteúdo |
| 51 | Feed e publicações | Visualizador de mídia | `/app/midia/:id` | Visualizar mídia | Navegar;Compartilhar;Fechar |
| 52 | Feed e publicações | Galeria de mídia | `/app/midia` | Galeria | Abrir;Navegar |
| 53 | Feed e publicações | Editar foto | `/app/editor/foto` | Editar imagem | Cortar;Ajustar;Salvar |
| 54 | Feed e publicações | Editor de vídeo | `/app/editor/video` | Editar vídeo | Cortar;Áudio;Texto;Salvar |
| 55 | Feed e publicações | Prévia da publicação | `/app/criar/preview` | Revisar antes de publicar | Publicar;Agendar;Voltar |
| 56 | Stories | Stories | `/app/stories` | Feed de Stories | Abrir;Navegar |
| 57 | Stories | Criar Story | `/app/stories/criar` | Criar Story | Câmera;Upload;Texto |
| 58 | Stories | Câmera do Story | `/app/stories/camera` | Captura de Story | Capturar;Trocar câmera |
| 59 | Stories | Upload de foto para Story | `/app/stories/foto` | Selecionar foto | Upload;Editar |
| 60 | Stories | Upload de vídeo para Story | `/app/stories/video` | Selecionar vídeo | Upload;Editar |
| 61 | Stories | Story com texto | `/app/stories/texto` | Story textual | Editar;Publicar |
| 62 | Stories | Story com música | `/app/stories/musica` | Adicionar música | Pesquisar;Selecionar |
| 63 | Stories | Story com figurinha | `/app/stories/figurinha` | Adicionar figurinha | Selecionar;Posicionar |
| 64 | Stories | Story com enquete | `/app/stories/enquete` | Criar enquete | Editar;Publicar |
| 65 | Stories | Story com perguntas | `/app/stories/perguntas` | Criar perguntas | Editar;Publicar |
| 66 | Stories | Story com localização | `/app/stories/localizacao` | Adicionar localização | Pesquisar;Selecionar |
| 67 | Stories | Story com menção | `/app/stories/mencao` | Mencionar usuário | Pesquisar;Selecionar |
| 68 | Stories | Story com GIF | `/app/stories/gif` | Adicionar GIF | Pesquisar;Selecionar |
| 69 | Stories | Editor de Story | `/app/stories/editor` | Editar Story | Texto;Música;Figurinhas;Publicar |
| 70 | Stories | Privacidade do Story | `/app/stories/privacidade` | Definir público | Salvar |
| 71 | Stories | Arquivo de Stories | `/app/stories/arquivo` | Histórico de Stories | Visualizar;Excluir |
| 72 | Stories | Visualizadores do Story | `/app/stories/:id/visualizadores` | Ver visualizações | Ver perfil |
| 73 | Stories | Story destacado | `/app/stories/destaque/:id` | Ver destaque | Navegar |
| 74 | Stories | Criar destaque | `/app/stories/destaques/criar` | Criar destaque | Selecionar;Salvar |
| 75 | Stories | Editar destaque | `/app/stories/destaques/:id/editar` | Editar destaque | Salvar;Excluir |
| 76 | Shorts | Shorts | `/app/shorts` | Feed vertical de vídeos | Curtir;Comentar;Compartilhar;Salvar |
| 77 | Shorts | Criar Short | `/app/shorts/criar` | Criar vídeo curto | Câmera;Upload |
| 78 | Shorts | Upload de vídeo Short | `/app/shorts/criar/upload` | Enviar vídeo | Upload;Continuar |
| 79 | Shorts | Câmera do Short | `/app/shorts/criar/camera` | Gravar vídeo | Gravar;Parar |
| 80 | Shorts | Cortar vídeo | `/app/shorts/editor/corte` | Editar duração | Cortar;Salvar |
| 81 | Shorts | Áudio do vídeo | `/app/shorts/editor/audio` | Selecionar áudio | Pesquisar;Selecionar |
| 82 | Shorts | Controle de volume | `/app/shorts/editor/volume` | Ajustar áudio | Salvar |
| 83 | Shorts | Adicionar música | `/app/shorts/editor/musica` | Adicionar música | Pesquisar;Selecionar |
| 84 | Shorts | Adicionar texto | `/app/shorts/editor/texto` | Adicionar texto | Editar;Salvar |
| 85 | Shorts | Efeitos | `/app/shorts/editor/efeitos` | Aplicar efeitos | Selecionar;Salvar |
| 86 | Shorts | Figurinhas | `/app/shorts/editor/figurinhas` | Adicionar figurinhas | Selecionar;Posicionar |
| 87 | Shorts | Selecionar capa | `/app/shorts/editor/capa` | Definir capa | Selecionar;Salvar |
| 88 | Shorts | Editar legenda | `/app/shorts/editor/legenda` | Definir legenda | Salvar |
| 89 | Shorts | Adicionar hashtags | `/app/shorts/editor/hashtags` | Adicionar hashtags | Adicionar;Remover |
| 90 | Shorts | Selecionar público do Short | `/app/shorts/editor/publico` | Definir visibilidade | Salvar |
| 91 | Shorts | Agendar Short | `/app/shorts/agendar` | Agendar vídeo | Escolher data;Agendar |
| 92 | Shorts | Rascunhos de Shorts | `/app/shorts/rascunhos` | Gerenciar rascunhos | Editar;Excluir;Publicar |
| 93 | Shorts | Estatísticas do Short | `/app/shorts/:id/insights` | Métricas do Short | Período;Exportar |
| 94 | Shorts | Comentários do Short | `/app/shorts/:id/comentarios` | Comentários | Responder;Denunciar |
| 95 | Shorts | Compartilhamento do Short | `/app/shorts/:id/compartilhar` | Compartilhar Short | Compartilhar;Copiar link |
| 96 | Perfil | Meu perfil | `/app/perfil` | Perfil do usuário atual | Editar;Publicar;Configurar |
| 97 | Perfil | Perfil de outro usuário | `/app/perfil/:id` | Perfil público | Seguir;Mensagem;Denunciar |
| 98 | Perfil | Editar perfil | `/app/perfil/editar` | Editar informações | Salvar |
| 99 | Perfil | Editar foto do perfil | `/app/perfil/editar/foto` | Alterar avatar | Upload;Salvar |
| 100 | Perfil | Editar capa | `/app/perfil/editar/capa` | Alterar capa | Upload;Salvar |
| 101 | Perfil | Editar bio | `/app/perfil/editar/bio` | Alterar biografia | Salvar |
| 102 | Perfil | Informações pessoais | `/app/perfil/informacoes` | Dados do perfil | Editar;Privacidade |
| 103 | Perfil | Publicações do perfil | `/app/perfil/publicacoes` | Posts do perfil | Abrir;Editar |
| 104 | Perfil | Fotos do perfil | `/app/perfil/fotos` | Fotos | Abrir;Excluir |
| 105 | Perfil | Vídeos do perfil | `/app/perfil/videos` | Vídeos | Abrir;Gerenciar |
| 106 | Perfil | Reels do perfil | `/app/perfil/reels` | Shorts do perfil | Abrir;Gerenciar |
| 107 | Perfil | Stories destacados do perfil | `/app/perfil/destaques` | Destaques | Abrir;Editar |
| 108 | Perfil | Seguidores | `/app/perfil/seguidores` | Lista de seguidores | Pesquisar;Remover |
| 109 | Perfil | Seguindo | `/app/perfil/seguindo` | Lista de contas seguidas | Pesquisar;Deixar de seguir |
| 110 | Perfil | Amigos e conexões | `/app/perfil/amigos` | Conexões | Pesquisar;Gerenciar |
| 111 | Perfil | Sobre | `/app/perfil/sobre` | Informações detalhadas | Editar |
| 112 | Perfil | Atividade do perfil | `/app/perfil/atividade` | Histórico de atividade | Filtrar |
| 113 | Perfil | Menções | `/app/perfil/mencoes` | Conteúdos que mencionam o usuário | Abrir;Remover marcação |
| 114 | Perfil | Curtidas | `/app/perfil/curtidas` | Conteúdos curtidos | Abrir;Remover |
| 115 | Perfil | Itens salvos | `/app/perfil/salvos` | Itens salvos | Abrir;Remover |
| 116 | Perfil | Configurações do perfil | `/app/perfil/configuracoes` | Preferências do perfil | Salvar |
| 117 | Explorar e pesquisa | Explorar | `/app/explorar/explorar` | Tela funcional de Explorar | Abrir;Salvar;Voltar |
| 118 | Explorar e pesquisa | Pesquisa geral | `/app/explorar/pesquisa-geral` | Tela funcional de Pesquisa geral | Abrir;Salvar;Voltar |
| 119 | Explorar e pesquisa | Resultados de pessoas | `/app/explorar/resultados-de-pessoas` | Tela funcional de Resultados de pessoas | Abrir;Salvar;Voltar |
| 120 | Explorar e pesquisa | Resultados de publicações | `/app/explorar/resultados-de-publicações` | Tela funcional de Resultados de publicações | Abrir;Salvar;Voltar |
| 121 | Explorar e pesquisa | Resultados de vídeos | `/app/explorar/resultados-de-vídeos` | Tela funcional de Resultados de vídeos | Abrir;Salvar;Voltar |
| 122 | Explorar e pesquisa | Resultados de Shorts | `/app/explorar/resultados-de-shorts` | Tela funcional de Resultados de Shorts | Abrir;Salvar;Voltar |
| 123 | Explorar e pesquisa | Resultados de fotos | `/app/explorar/resultados-de-fotos` | Tela funcional de Resultados de fotos | Abrir;Salvar;Voltar |
| 124 | Explorar e pesquisa | Resultados de grupos | `/app/explorar/resultados-de-grupos` | Tela funcional de Resultados de grupos | Abrir;Salvar;Voltar |
| 125 | Explorar e pesquisa | Resultados de Páginas | `/app/explorar/resultados-de-páginas` | Tela funcional de Resultados de Páginas | Abrir;Salvar;Voltar |
| 126 | Explorar e pesquisa | Resultados de comunidades | `/app/explorar/resultados-de-comunidades` | Tela funcional de Resultados de comunidades | Abrir;Salvar;Voltar |
| 127 | Explorar e pesquisa | Resultados do Marketplace | `/app/explorar/resultados-do-marketplace` | Tela funcional de Resultados do Marketplace | Abrir;Salvar;Voltar |
| 128 | Explorar e pesquisa | Tendências | `/app/explorar/tendências` | Tela funcional de Tendências | Abrir;Salvar;Voltar |
| 129 | Explorar e pesquisa | Hashtag | `/app/explorar/hashtag` | Tela funcional de Hashtag | Abrir;Salvar;Voltar |
| 130 | Explorar e pesquisa | Página de hashtag | `/app/explorar/página-de-hashtag` | Tela funcional de Página de hashtag | Abrir;Salvar;Voltar |
| 131 | Explorar e pesquisa | Histórico de pesquisa | `/app/explorar/histórico-de-pesquisa` | Tela funcional de Histórico de pesquisa | Abrir;Salvar;Voltar |
| 132 | Explorar e pesquisa | Sugestões de pesquisa | `/app/explorar/sugestões-de-pesquisa` | Tela funcional de Sugestões de pesquisa | Abrir;Salvar;Voltar |
| 133 | Explorar e pesquisa | Busca avançada | `/app/explorar/busca-avançada` | Tela funcional de Busca avançada | Abrir;Salvar;Voltar |
| 134 | Explorar e pesquisa | Resultados recentes | `/app/explorar/resultados-recentes` | Tela funcional de Resultados recentes | Abrir;Salvar;Voltar |
| 135 | Explorar e pesquisa | Conteúdo recomendado | `/app/explorar/conteúdo-recomendado` | Tela funcional de Conteúdo recomendado | Abrir;Salvar;Voltar |
| 136 | Mensagens | Caixa de entrada | `/app/mensagens/caixa-de-entrada` | Tela funcional de Caixa de entrada | Abrir;Salvar;Voltar |
| 137 | Mensagens | Conversa aberta | `/app/mensagens/conversa-aberta` | Tela funcional de Conversa aberta | Abrir;Salvar;Voltar |
| 138 | Mensagens | Nova conversa | `/app/mensagens/nova-conversa` | Tela funcional de Nova conversa | Abrir;Salvar;Voltar |
| 139 | Mensagens | Solicitações de mensagem | `/app/mensagens/solicitações-de-mensagem` | Tela funcional de Solicitações de mensagem | Abrir;Salvar;Voltar |
| 140 | Mensagens | Conversas arquivadas | `/app/mensagens/conversas-arquivadas` | Tela funcional de Conversas arquivadas | Abrir;Salvar;Voltar |
| 141 | Mensagens | Mensagens não lidas | `/app/mensagens/mensagens-não-lidas` | Tela funcional de Mensagens não lidas | Abrir;Salvar;Voltar |
| 142 | Mensagens | Pesquisar mensagens | `/app/mensagens/pesquisar-mensagens` | Tela funcional de Pesquisar mensagens | Abrir;Salvar;Voltar |
| 143 | Mensagens | Enviar foto | `/app/mensagens/enviar-foto` | Tela funcional de Enviar foto | Abrir;Salvar;Voltar |
| 144 | Mensagens | Enviar vídeo | `/app/mensagens/enviar-vídeo` | Tela funcional de Enviar vídeo | Abrir;Salvar;Voltar |
| 145 | Mensagens | Enviar arquivo | `/app/mensagens/enviar-arquivo` | Tela funcional de Enviar arquivo | Abrir;Salvar;Voltar |
| 146 | Mensagens | Enviar figurinha | `/app/mensagens/enviar-figurinha` | Tela funcional de Enviar figurinha | Abrir;Salvar;Voltar |
| 147 | Mensagens | Enviar GIF | `/app/mensagens/enviar-gif` | Tela funcional de Enviar GIF | Abrir;Salvar;Voltar |
| 148 | Mensagens | Enviar áudio | `/app/mensagens/enviar-áudio` | Tela funcional de Enviar áudio | Abrir;Salvar;Voltar |
| 149 | Mensagens | Reagir à mensagem | `/app/mensagens/reagir-à-mensagem` | Tela funcional de Reagir à mensagem | Abrir;Salvar;Voltar |
| 150 | Mensagens | Responder mensagem | `/app/mensagens/responder-mensagem` | Tela funcional de Responder mensagem | Abrir;Salvar;Voltar |
| 151 | Mensagens | Encaminhar mensagem | `/app/mensagens/encaminhar-mensagem` | Tela funcional de Encaminhar mensagem | Abrir;Salvar;Voltar |
| 152 | Mensagens | Apagar mensagem | `/app/mensagens/apagar-mensagem` | Tela funcional de Apagar mensagem | Abrir;Salvar;Voltar |
| 153 | Mensagens | Silenciar conversa | `/app/mensagens/silenciar-conversa` | Tela funcional de Silenciar conversa | Abrir;Salvar;Voltar |
| 154 | Mensagens | Bloquear conversa | `/app/mensagens/bloquear-conversa` | Tela funcional de Bloquear conversa | Abrir;Salvar;Voltar |
| 155 | Mensagens | Denunciar conversa | `/app/mensagens/denunciar-conversa` | Tela funcional de Denunciar conversa | Abrir;Salvar;Voltar |
| 156 | Notificações | Notificações | `/app/notificacoes` | Tela funcional de Notificações | Abrir;Salvar;Voltar |
| 157 | Notificações | Curtidas | `/app/notificacoes/curtidas` | Tela funcional de Curtidas | Abrir;Salvar;Voltar |
| 158 | Notificações | Comentários | `/app/notificacoes/comentários` | Tela funcional de Comentários | Abrir;Salvar;Voltar |
| 159 | Notificações | Menções | `/app/notificacoes/menções` | Tela funcional de Menções | Abrir;Salvar;Voltar |
| 160 | Notificações | Novos seguidores | `/app/notificacoes/novos-seguidores` | Tela funcional de Novos seguidores | Abrir;Salvar;Voltar |
| 161 | Notificações | Solicitações de amizade | `/app/notificacoes/solicitações-de-amizade` | Tela funcional de Solicitações de amizade | Abrir;Salvar;Voltar |
| 162 | Notificações | Mensagens | `/app/notificacoes/mensagens` | Tela funcional de Mensagens | Abrir;Salvar;Voltar |
| 163 | Notificações | Stories | `/app/notificacoes/stories` | Tela funcional de Stories | Abrir;Salvar;Voltar |
| 164 | Notificações | Shorts | `/app/notificacoes/shorts` | Tela funcional de Shorts | Abrir;Salvar;Voltar |
| 165 | Notificações | Grupos | `/app/notificacoes/grupos` | Tela funcional de Grupos | Abrir;Salvar;Voltar |
| 166 | Notificações | Páginas | `/app/notificacoes/páginas` | Tela funcional de Páginas | Abrir;Salvar;Voltar |
| 167 | Notificações | Marketplace | `/app/notificacoes/marketplace` | Tela funcional de Marketplace | Abrir;Salvar;Voltar |
| 168 | Notificações | Segurança | `/app/notificacoes/segurança` | Tela funcional de Segurança | Abrir;Salvar;Voltar |
| 169 | Notificações | Notificações push | `/app/notificacoes/notificações-push` | Tela funcional de Notificações push | Abrir;Salvar;Voltar |
| 170 | Notificações | Preferências de notificações | `/app/notificacoes/preferências-de-notificações` | Tela funcional de Preferências de notificações | Abrir;Salvar;Voltar |
| 171 | Comunidades e grupos | Comunidades | `/app/comunidades/comunidades` | Tela funcional de Comunidades | Abrir;Salvar;Voltar |
| 172 | Comunidades e grupos | Descobrir comunidades | `/app/comunidades/descobrir-comunidades` | Tela funcional de Descobrir comunidades | Abrir;Salvar;Voltar |
| 173 | Comunidades e grupos | Minhas comunidades | `/app/comunidades/minhas-comunidades` | Tela funcional de Minhas comunidades | Abrir;Salvar;Voltar |
| 174 | Comunidades e grupos | Criar comunidade | `/app/comunidades/criar-comunidade` | Tela funcional de Criar comunidade | Abrir;Salvar;Voltar |
| 175 | Comunidades e grupos | Página da comunidade | `/app/comunidades/página-da-comunidade` | Tela funcional de Página da comunidade | Abrir;Salvar;Voltar |
| 176 | Comunidades e grupos | Feed da comunidade | `/app/comunidades/feed-da-comunidade` | Tela funcional de Feed da comunidade | Abrir;Salvar;Voltar |
| 177 | Comunidades e grupos | Membros | `/app/comunidades/membros` | Tela funcional de Membros | Abrir;Salvar;Voltar |
| 178 | Comunidades e grupos | Administradores | `/app/comunidades/administradores` | Tela funcional de Administradores | Abrir;Salvar;Voltar |
| 179 | Comunidades e grupos | Solicitações | `/app/comunidades/solicitações` | Tela funcional de Solicitações | Abrir;Salvar;Voltar |
| 180 | Comunidades e grupos | Convites | `/app/comunidades/convites` | Tela funcional de Convites | Abrir;Salvar;Voltar |
| 181 | Comunidades e grupos | Eventos da comunidade | `/app/comunidades/eventos-da-comunidade` | Tela funcional de Eventos da comunidade | Abrir;Salvar;Voltar |
| 182 | Comunidades e grupos | Arquivos da comunidade | `/app/comunidades/arquivos-da-comunidade` | Tela funcional de Arquivos da comunidade | Abrir;Salvar;Voltar |
| 183 | Comunidades e grupos | Perguntas | `/app/comunidades/perguntas` | Tela funcional de Perguntas | Abrir;Salvar;Voltar |
| 184 | Comunidades e grupos | Regras | `/app/comunidades/regras` | Tela funcional de Regras | Abrir;Salvar;Voltar |
| 185 | Comunidades e grupos | Moderação | `/app/comunidades/moderação` | Tela funcional de Moderação | Abrir;Salvar;Voltar |
| 186 | Comunidades e grupos | Denúncias da comunidade | `/app/comunidades/denúncias-da-comunidade` | Tela funcional de Denúncias da comunidade | Abrir;Salvar;Voltar |
| 187 | Comunidades e grupos | Banimentos | `/app/comunidades/banimentos` | Tela funcional de Banimentos | Abrir;Salvar;Voltar |
| 188 | Comunidades e grupos | Configurações da comunidade | `/app/comunidades/configurações-da-comunidade` | Tela funcional de Configurações da comunidade | Abrir;Salvar;Voltar |
| 189 | Comunidades e grupos | Editar comunidade | `/app/comunidades/editar-comunidade` | Tela funcional de Editar comunidade | Abrir;Salvar;Voltar |
| 190 | Comunidades e grupos | Insights da comunidade | `/app/comunidades/insights-da-comunidade` | Tela funcional de Insights da comunidade | Abrir;Salvar;Voltar |
| 191 | Salvos e eventos | Salvos | `/app/salvos/salvos` | Tela funcional de Salvos | Abrir;Salvar;Voltar |
| 192 | Salvos e eventos | Publicações salvas | `/app/salvos/publicações-salvas` | Tela funcional de Publicações salvas | Abrir;Salvar;Voltar |
| 193 | Salvos e eventos | Vídeos salvos | `/app/salvos/vídeos-salvos` | Tela funcional de Vídeos salvos | Abrir;Salvar;Voltar |
| 194 | Salvos e eventos | Shorts salvos | `/app/salvos/shorts-salvos` | Tela funcional de Shorts salvos | Abrir;Salvar;Voltar |
| 195 | Salvos e eventos | Links salvos | `/app/salvos/links-salvos` | Tela funcional de Links salvos | Abrir;Salvar;Voltar |
| 196 | Salvos e eventos | Coleções | `/app/salvos/coleções` | Tela funcional de Coleções | Abrir;Salvar;Voltar |
| 197 | Salvos e eventos | Criar coleção | `/app/salvos/criar-coleção` | Tela funcional de Criar coleção | Abrir;Salvar;Voltar |
| 198 | Salvos e eventos | Editar coleção | `/app/salvos/editar-coleção` | Tela funcional de Editar coleção | Abrir;Salvar;Voltar |
| 199 | Salvos e eventos | Excluir coleção | `/app/salvos/excluir-coleção` | Tela funcional de Excluir coleção | Abrir;Salvar;Voltar |
| 200 | Salvos e eventos | Eventos | `/app/salvos/eventos` | Tela funcional de Eventos | Abrir;Salvar;Voltar |
| 201 | Salvos e eventos | Descobrir eventos | `/app/salvos/descobrir-eventos` | Tela funcional de Descobrir eventos | Abrir;Salvar;Voltar |
| 202 | Salvos e eventos | Meus eventos | `/app/salvos/meus-eventos` | Tela funcional de Meus eventos | Abrir;Salvar;Voltar |
| 203 | Salvos e eventos | Criar evento | `/app/salvos/criar-evento` | Tela funcional de Criar evento | Abrir;Salvar;Voltar |
| 204 | Salvos e eventos | Página do evento | `/app/salvos/página-do-evento` | Tela funcional de Página do evento | Abrir;Salvar;Voltar |
| 205 | Salvos e eventos | Participantes | `/app/salvos/participantes` | Tela funcional de Participantes | Abrir;Salvar;Voltar |
| 206 | Salvos e eventos | Convites do evento | `/app/salvos/convites-do-evento` | Tela funcional de Convites do evento | Abrir;Salvar;Voltar |
| 207 | Salvos e eventos | Agenda do evento | `/app/salvos/agenda-do-evento` | Tela funcional de Agenda do evento | Abrir;Salvar;Voltar |
| 208 | Salvos e eventos | Localização do evento | `/app/salvos/localização-do-evento` | Tela funcional de Localização do evento | Abrir;Salvar;Voltar |
| 209 | Salvos e eventos | Editar evento | `/app/salvos/editar-evento` | Tela funcional de Editar evento | Abrir;Salvar;Voltar |
| 210 | Salvos e eventos | Configurações do evento | `/app/salvos/configurações-do-evento` | Tela funcional de Configurações do evento | Abrir;Salvar;Voltar |
| 211 | Marketplace | Marketplace | `/app/marketplace` | Tela funcional de Marketplace | Abrir;Salvar;Voltar |
| 212 | Marketplace | Pesquisa do Marketplace | `/app/marketplace/pesquisa-do-marketplace` | Tela funcional de Pesquisa do Marketplace | Abrir;Salvar;Voltar |
| 213 | Marketplace | Categorias | `/app/marketplace/categorias` | Tela funcional de Categorias | Abrir;Salvar;Voltar |
| 214 | Marketplace | Detalhes do produto | `/app/marketplace/detalhes-do-produto` | Tela funcional de Detalhes do produto | Abrir;Salvar;Voltar |
| 215 | Marketplace | Criar anúncio | `/app/marketplace/criar-anúncio` | Tela funcional de Criar anúncio | Abrir;Salvar;Voltar |
| 216 | Marketplace | Editar anúncio | `/app/marketplace/editar-anúncio` | Tela funcional de Editar anúncio | Abrir;Salvar;Voltar |
| 217 | Marketplace | Fotos do produto | `/app/marketplace/fotos-do-produto` | Tela funcional de Fotos do produto | Abrir;Salvar;Voltar |
| 218 | Marketplace | Preço do produto | `/app/marketplace/preço-do-produto` | Tela funcional de Preço do produto | Abrir;Salvar;Voltar |
| 219 | Marketplace | Localização do anúncio | `/app/marketplace/localização-do-anúncio` | Tela funcional de Localização do anúncio | Abrir;Salvar;Voltar |
| 220 | Marketplace | Mensagens do comprador | `/app/marketplace/mensagens-do-comprador` | Tela funcional de Mensagens do comprador | Abrir;Salvar;Voltar |
| 221 | Marketplace | Meus anúncios | `/app/marketplace/meus-anúncios` | Tela funcional de Meus anúncios | Abrir;Salvar;Voltar |
| 222 | Marketplace | Anúncios vendidos | `/app/marketplace/anúncios-vendidos` | Tela funcional de Anúncios vendidos | Abrir;Salvar;Voltar |
| 223 | Marketplace | Itens salvos | `/app/marketplace/itens-salvos` | Tela funcional de Itens salvos | Abrir;Salvar;Voltar |
| 224 | Marketplace | Compras | `/app/marketplace/compras` | Tela funcional de Compras | Abrir;Salvar;Voltar |
| 225 | Marketplace | Avaliações | `/app/marketplace/avaliações` | Tela funcional de Avaliações | Abrir;Salvar;Voltar |
| 226 | Marketplace | Entrega | `/app/marketplace/entrega` | Tela funcional de Entrega | Abrir;Salvar;Voltar |
| 227 | Marketplace | Pagamento | `/app/marketplace/pagamento` | Tela funcional de Pagamento | Abrir;Salvar;Voltar |
| 228 | Marketplace | Relatório de anúncio | `/app/marketplace/relatório-de-anúncio` | Tela funcional de Relatório de anúncio | Abrir;Salvar;Voltar |
| 229 | Marketplace | Denunciar anúncio | `/app/marketplace/denunciar-anúncio` | Tela funcional de Denunciar anúncio | Abrir;Salvar;Voltar |
| 230 | Marketplace | Configurações do Marketplace | `/app/marketplace/configurações-do-marketplace` | Tela funcional de Configurações do Marketplace | Abrir;Salvar;Voltar |
| 231 | Páginas | Criar Página | `/app/paginas/criar-página` | Tela funcional de Criar Página | Abrir;Salvar;Voltar |
| 232 | Páginas | Escolher tipo de Página | `/app/paginas/escolher-tipo-de-página` | Tela funcional de Escolher tipo de Página | Abrir;Salvar;Voltar |
| 233 | Páginas | Informações da Página | `/app/paginas/informações-da-página` | Tela funcional de Informações da Página | Abrir;Salvar;Voltar |
| 234 | Páginas | Categoria da Página | `/app/paginas/categoria-da-página` | Tela funcional de Categoria da Página | Abrir;Salvar;Voltar |
| 235 | Páginas | Descrição da Página | `/app/paginas/descrição-da-página` | Tela funcional de Descrição da Página | Abrir;Salvar;Voltar |
| 236 | Páginas | Site da Página | `/app/paginas/site-da-página` | Tela funcional de Site da Página | Abrir;Salvar;Voltar |
| 237 | Páginas | Telefone da Página | `/app/paginas/telefone-da-página` | Tela funcional de Telefone da Página | Abrir;Salvar;Voltar |
| 238 | Páginas | E-mail da Página | `/app/paginas/e-mail-da-página` | Tela funcional de E-mail da Página | Abrir;Salvar;Voltar |
| 239 | Páginas | Endereço da Página | `/app/paginas/endereço-da-página` | Tela funcional de Endereço da Página | Abrir;Salvar;Voltar |
| 240 | Páginas | Foto da Página | `/app/paginas/foto-da-página` | Tela funcional de Foto da Página | Abrir;Salvar;Voltar |
| 241 | Páginas | Capa da Página | `/app/paginas/capa-da-página` | Tela funcional de Capa da Página | Abrir;Salvar;Voltar |
| 242 | Páginas | Nome de usuário da Página | `/app/paginas/nome-de-usuário-da-página` | Tela funcional de Nome de usuário da Página | Abrir;Salvar;Voltar |
| 243 | Páginas | Página publicada | `/app/paginas/página-publicada` | Tela funcional de Página publicada | Abrir;Salvar;Voltar |
| 244 | Páginas | Feed da Página | `/app/paginas/feed-da-página` | Tela funcional de Feed da Página | Abrir;Salvar;Voltar |
| 245 | Páginas | Sobre da Página | `/app/paginas/sobre-da-página` | Tela funcional de Sobre da Página | Abrir;Salvar;Voltar |
| 246 | Páginas | Fotos da Página | `/app/paginas/fotos-da-página` | Tela funcional de Fotos da Página | Abrir;Salvar;Voltar |
| 247 | Páginas | Vídeos da Página | `/app/paginas/vídeos-da-página` | Tela funcional de Vídeos da Página | Abrir;Salvar;Voltar |
| 248 | Páginas | Shorts da Página | `/app/paginas/shorts-da-página` | Tela funcional de Shorts da Página | Abrir;Salvar;Voltar |
| 249 | Páginas | Stories da Página | `/app/paginas/stories-da-página` | Tela funcional de Stories da Página | Abrir;Salvar;Voltar |
| 250 | Páginas | Eventos da Página | `/app/paginas/eventos-da-página` | Tela funcional de Eventos da Página | Abrir;Salvar;Voltar |
| 251 | Páginas | Serviços da Página | `/app/paginas/serviços-da-página` | Tela funcional de Serviços da Página | Abrir;Salvar;Voltar |
| 252 | Páginas | Produtos da Página | `/app/paginas/produtos-da-página` | Tela funcional de Produtos da Página | Abrir;Salvar;Voltar |
| 253 | Páginas | Avaliações da Página | `/app/paginas/avaliações-da-página` | Tela funcional de Avaliações da Página | Abrir;Salvar;Voltar |
| 254 | Páginas | Seguidores da Página | `/app/paginas/seguidores-da-página` | Tela funcional de Seguidores da Página | Abrir;Salvar;Voltar |
| 255 | Páginas | Caixa de entrada da Página | `/app/paginas/caixa-de-entrada-da-página` | Tela funcional de Caixa de entrada da Página | Abrir;Salvar;Voltar |
| 256 | Business Suite | Business Suite — Visão geral | `/app/business/business-suite---visão-geral` | Tela funcional de Business Suite — Visão geral | Abrir;Salvar;Voltar |
| 257 | Business Suite | Business Suite — Início | `/app/business/business-suite---início` | Tela funcional de Business Suite — Início | Abrir;Salvar;Voltar |
| 258 | Business Suite | Calendário | `/app/business/calendário` | Tela funcional de Calendário | Abrir;Salvar;Voltar |
| 259 | Business Suite | Planejador de conteúdo | `/app/business/planejador-de-conteúdo` | Tela funcional de Planejador de conteúdo | Abrir;Salvar;Voltar |
| 260 | Business Suite | Publicações | `/app/business/publicações` | Tela funcional de Publicações | Abrir;Salvar;Voltar |
| 261 | Business Suite | Stories publicados | `/app/business/stories-publicados` | Tela funcional de Stories publicados | Abrir;Salvar;Voltar |
| 262 | Business Suite | Shorts publicados | `/app/business/shorts-publicados` | Tela funcional de Shorts publicados | Abrir;Salvar;Voltar |
| 263 | Business Suite | Rascunhos | `/app/business/rascunhos` | Tela funcional de Rascunhos | Abrir;Salvar;Voltar |
| 264 | Business Suite | Agendados | `/app/business/agendados` | Tela funcional de Agendados | Abrir;Salvar;Voltar |
| 265 | Business Suite | Publicados | `/app/business/publicados` | Tela funcional de Publicados | Abrir;Salvar;Voltar |
| 266 | Business Suite | Caixa de entrada | `/app/business/caixa-de-entrada` | Tela funcional de Caixa de entrada | Abrir;Salvar;Voltar |
| 267 | Business Suite | Comentários | `/app/business/comentários` | Tela funcional de Comentários | Abrir;Salvar;Voltar |
| 268 | Business Suite | Mensagens | `/app/business/mensagens` | Tela funcional de Mensagens | Abrir;Salvar;Voltar |
| 269 | Business Suite | Leads | `/app/business/leads` | Tela funcional de Leads | Abrir;Salvar;Voltar |
| 270 | Business Suite | Notificações | `/app/business/notificações` | Tela funcional de Notificações | Abrir;Salvar;Voltar |
| 271 | Business Suite | Insights | `/app/business/insights` | Tela funcional de Insights | Abrir;Salvar;Voltar |
| 272 | Business Suite | Visão diária | `/app/business/visão-diária` | Tela funcional de Visão diária | Abrir;Salvar;Voltar |
| 273 | Business Suite | Visão semanal | `/app/business/visão-semanal` | Tela funcional de Visão semanal | Abrir;Salvar;Voltar |
| 274 | Business Suite | Visão mensal | `/app/business/visão-mensal` | Tela funcional de Visão mensal | Abrir;Salvar;Voltar |
| 275 | Business Suite | Alcance | `/app/business/alcance` | Tela funcional de Alcance | Abrir;Salvar;Voltar |
| 276 | Business Suite | Engajamento | `/app/business/engajamento` | Tela funcional de Engajamento | Abrir;Salvar;Voltar |
| 277 | Business Suite | Seguidores | `/app/business/seguidores` | Tela funcional de Seguidores | Abrir;Salvar;Voltar |
| 278 | Business Suite | Crescimento | `/app/business/crescimento` | Tela funcional de Crescimento | Abrir;Salvar;Voltar |
| 279 | Business Suite | Conteúdo com melhor desempenho | `/app/business/conteúdo-com-melhor-desempenho` | Tela funcional de Conteúdo com melhor desempenho | Abrir;Salvar;Voltar |
| 280 | Business Suite | Público | `/app/business/público` | Tela funcional de Público | Abrir;Salvar;Voltar |
| 281 | Business Suite | Monetização | `/app/business/monetização` | Tela funcional de Monetização | Abrir;Salvar;Voltar |
| 282 | Business Suite | Configurações comerciais | `/app/business/configurações-comerciais` | Tela funcional de Configurações comerciais | Abrir;Salvar;Voltar |
| 283 | Business Suite | Biblioteca de conteúdo | `/app/business/biblioteca-de-conteúdo` | Tela funcional de Biblioteca de conteúdo | Abrir;Salvar;Voltar |
| 284 | Business Suite | Tarefas | `/app/business/tarefas` | Tela funcional de Tarefas | Abrir;Salvar;Voltar |
| 285 | Business Suite | Colaboradores | `/app/business/colaboradores` | Tela funcional de Colaboradores | Abrir;Salvar;Voltar |
| 286 | Ads | Gerenciador de Anúncios | `/app/ads/gerenciador-de-anúncios` | Tela funcional de Gerenciador de Anúncios | Abrir;Salvar;Voltar |
| 287 | Ads | Campanhas | `/app/ads/campanhas` | Tela funcional de Campanhas | Abrir;Salvar;Voltar |
| 288 | Ads | Conjuntos de anúncios | `/app/ads/conjuntos-de-anúncios` | Tela funcional de Conjuntos de anúncios | Abrir;Salvar;Voltar |
| 289 | Ads | Anúncios | `/app/ads/anúncios` | Tela funcional de Anúncios | Abrir;Salvar;Voltar |
| 290 | Ads | Criar campanha | `/app/ads/criar-campanha` | Tela funcional de Criar campanha | Abrir;Salvar;Voltar |
| 291 | Ads | Objetivo da campanha | `/app/ads/objetivo-da-campanha` | Tela funcional de Objetivo da campanha | Abrir;Salvar;Voltar |
| 292 | Ads | Orçamento | `/app/ads/orçamento` | Tela funcional de Orçamento | Abrir;Salvar;Voltar |
| 293 | Ads | Programação | `/app/ads/programação` | Tela funcional de Programação | Abrir;Salvar;Voltar |
| 294 | Ads | Público | `/app/ads/público` | Tela funcional de Público | Abrir;Salvar;Voltar |
| 295 | Ads | Localização | `/app/ads/localização` | Tela funcional de Localização | Abrir;Salvar;Voltar |
| 296 | Ads | Idade e gênero | `/app/ads/idade-e-gênero` | Tela funcional de Idade e gênero | Abrir;Salvar;Voltar |
| 297 | Ads | Segmentação detalhada | `/app/ads/segmentação-detalhada` | Tela funcional de Segmentação detalhada | Abrir;Salvar;Voltar |
| 298 | Ads | Posicionamentos | `/app/ads/posicionamentos` | Tela funcional de Posicionamentos | Abrir;Salvar;Voltar |
| 299 | Ads | Criativo | `/app/ads/criativo` | Tela funcional de Criativo | Abrir;Salvar;Voltar |
| 300 | Ads | Texto do anúncio | `/app/ads/texto-do-anúncio` | Tela funcional de Texto do anúncio | Abrir;Salvar;Voltar |
| 301 | Ads | Título do anúncio | `/app/ads/título-do-anúncio` | Tela funcional de Título do anúncio | Abrir;Salvar;Voltar |
| 302 | Ads | CTA | `/app/ads/cta` | Tela funcional de CTA | Abrir;Salvar;Voltar |
| 303 | Ads | URL de destino | `/app/ads/url-de-destino` | Tela funcional de URL de destino | Abrir;Salvar;Voltar |
| 304 | Ads | Prévia do anúncio | `/app/ads/prévia-do-anúncio` | Tela funcional de Prévia do anúncio | Abrir;Salvar;Voltar |
| 305 | Ads | Publicar anúncio | `/app/ads/publicar-anúncio` | Tela funcional de Publicar anúncio | Abrir;Salvar;Voltar |
| 306 | Ads | Revisão do anúncio | `/app/ads/revisão-do-anúncio` | Tela funcional de Revisão do anúncio | Abrir;Salvar;Voltar |
| 307 | Ads | Anúncio aprovado | `/app/ads/anúncio-aprovado` | Tela funcional de Anúncio aprovado | Abrir;Salvar;Voltar |
| 308 | Ads | Anúncio rejeitado | `/app/ads/anúncio-rejeitado` | Tela funcional de Anúncio rejeitado | Abrir;Salvar;Voltar |
| 309 | Ads | Relatórios | `/app/ads/relatórios` | Tela funcional de Relatórios | Abrir;Salvar;Voltar |
| 310 | Ads | Métricas | `/app/ads/métricas` | Tela funcional de Métricas | Abrir;Salvar;Voltar |
| 311 | Ads | Colunas personalizadas | `/app/ads/colunas-personalizadas` | Tela funcional de Colunas personalizadas | Abrir;Salvar;Voltar |
| 312 | Ads | Filtros | `/app/ads/filtros` | Tela funcional de Filtros | Abrir;Salvar;Voltar |
| 313 | Ads | Comparação | `/app/ads/comparação` | Tela funcional de Comparação | Abrir;Salvar;Voltar |
| 314 | Ads | Exportação | `/app/ads/exportação` | Tela funcional de Exportação | Abrir;Salvar;Voltar |
| 315 | Ads | Biblioteca de anúncios | `/app/ads/biblioteca-de-anúncios` | Tela funcional de Biblioteca de anúncios | Abrir;Salvar;Voltar |
| 316 | Configurações | Configurações gerais | `/app/configuracoes/configurações-gerais` | Tela funcional de Configurações gerais | Abrir;Salvar;Voltar |
| 317 | Configurações | Conta | `/app/configuracoes/conta` | Tela funcional de Conta | Abrir;Salvar;Voltar |
| 318 | Configurações | Perfil | `/app/configuracoes/perfil` | Tela funcional de Perfil | Abrir;Salvar;Voltar |
| 319 | Configurações | Privacidade | `/app/configuracoes/privacidade` | Tela funcional de Privacidade | Abrir;Salvar;Voltar |
| 320 | Configurações | Segurança | `/app/configuracoes/segurança` | Tela funcional de Segurança | Abrir;Salvar;Voltar |
| 321 | Configurações | Senha | `/app/configuracoes/senha` | Tela funcional de Senha | Abrir;Salvar;Voltar |
| 322 | Configurações | Login | `/app/configuracoes/login` | Tela funcional de Login | Abrir;Salvar;Voltar |
| 323 | Configurações | Autenticação 2FA | `/app/configuracoes/autenticação-2fa` | Tela funcional de Autenticação 2FA | Abrir;Salvar;Voltar |
| 324 | Configurações | Dispositivos conectados | `/app/configuracoes/dispositivos-conectados` | Tela funcional de Dispositivos conectados | Abrir;Salvar;Voltar |
| 325 | Configurações | Bloqueios | `/app/configuracoes/bloqueios` | Tela funcional de Bloqueios | Abrir;Salvar;Voltar |
| 326 | Configurações | Silenciamentos | `/app/configuracoes/silenciamentos` | Tela funcional de Silenciamentos | Abrir;Salvar;Voltar |
| 327 | Configurações | Preferências do Feed | `/app/configuracoes/preferências-do-feed` | Tela funcional de Preferências do Feed | Abrir;Salvar;Voltar |
| 328 | Configurações | Preferências de conteúdo | `/app/configuracoes/preferências-de-conteúdo` | Tela funcional de Preferências de conteúdo | Abrir;Salvar;Voltar |
| 329 | Configurações | Idioma | `/app/configuracoes/idioma` | Tela funcional de Idioma | Abrir;Salvar;Voltar |
| 330 | Configurações | Acessibilidade | `/app/configuracoes/acessibilidade` | Tela funcional de Acessibilidade | Abrir;Salvar;Voltar |
| 331 | Configurações | Tema claro | `/app/configuracoes/tema-claro` | Tela funcional de Tema claro | Abrir;Salvar;Voltar |
| 332 | Configurações | Tema escuro | `/app/configuracoes/tema-escuro` | Tela funcional de Tema escuro | Abrir;Salvar;Voltar |
| 333 | Configurações | Notificações | `/app/configuracoes/notificações` | Tela funcional de Notificações | Abrir;Salvar;Voltar |
| 334 | Configurações | E-mail | `/app/configuracoes/e-mail` | Tela funcional de E-mail | Abrir;Salvar;Voltar |
| 335 | Configurações | SMS | `/app/configuracoes/sms` | Tela funcional de SMS | Abrir;Salvar;Voltar |
| 336 | Configurações | Push | `/app/configuracoes/push` | Tela funcional de Push | Abrir;Salvar;Voltar |
| 337 | Configurações | Dados pessoais | `/app/configuracoes/dados-pessoais` | Tela funcional de Dados pessoais | Abrir;Salvar;Voltar |
| 338 | Configurações | Baixar seus dados | `/app/configuracoes/baixar-seus-dados` | Tela funcional de Baixar seus dados | Abrir;Salvar;Voltar |
| 339 | Configurações | Transferência de dados | `/app/configuracoes/transferência-de-dados` | Tela funcional de Transferência de dados | Abrir;Salvar;Voltar |
| 340 | Configurações | Excluir conta | `/app/configuracoes/excluir-conta` | Tela funcional de Excluir conta | Abrir;Salvar;Voltar |
| 341 | Configurações | Desativar conta | `/app/configuracoes/desativar-conta` | Tela funcional de Desativar conta | Abrir;Salvar;Voltar |
| 342 | Configurações | Publicidade | `/app/configuracoes/publicidade` | Tela funcional de Publicidade | Abrir;Salvar;Voltar |
| 343 | Configurações | Preferências de anúncios | `/app/configuracoes/preferências-de-anúncios` | Tela funcional de Preferências de anúncios | Abrir;Salvar;Voltar |
| 344 | Configurações | Atividade fora da plataforma | `/app/configuracoes/atividade-fora-da-plataforma` | Tela funcional de Atividade fora da plataforma | Abrir;Salvar;Voltar |
| 345 | Configurações | Cookies | `/app/configuracoes/cookies` | Tela funcional de Cookies | Abrir;Salvar;Voltar |
| 346 | Segurança e moderação | Central de segurança | `/app/seguranca/central-de-segurança` | Tela funcional de Central de segurança | Abrir;Salvar;Voltar |
| 347 | Segurança e moderação | Denúncias | `/app/seguranca/denúncias` | Tela funcional de Denúncias | Abrir;Salvar;Voltar |
| 348 | Segurança e moderação | Conteúdo denunciado | `/app/seguranca/conteúdo-denunciado` | Tela funcional de Conteúdo denunciado | Abrir;Salvar;Voltar |
| 349 | Segurança e moderação | Contas bloqueadas | `/app/seguranca/contas-bloqueadas` | Tela funcional de Contas bloqueadas | Abrir;Salvar;Voltar |
| 350 | Segurança e moderação | Palavras ocultas | `/app/seguranca/palavras-ocultas` | Tela funcional de Palavras ocultas | Abrir;Salvar;Voltar |