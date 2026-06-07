# Dots and Boxes - Briefing para ChatGPT

Este documento resume o jogo atual para servir como contexto em pedidos de ideias, evolucoes, balanceamento e novas features.

## Resumo rapido
- Jogo de dots and boxes com foco mobile first.
- O jogador conecta pontos adjacentes, fecha quadrados, marca pontos e tenta vencer a IA ou outros jogadores locais.
- O jogo mistura arcade com progressao de fases, treino contra IA, multijogador local, energia, anuncios recompensados, rank, tema e idioma.
- A base tecnica e em TypeScript, Vite, Canvas e Capacitor para Android.

## Estado atual
- Versao atual: `v0.01.53`
- Stack: TypeScript, Vite, Jest, HTML/CSS/Canvas, Capacitor Android, AdMob recompensado.
- O core do jogo e separado da UI e tem testes.
- As constantes principais ficam centralizadas em `src/config/game-constants.ts`.

## Regra principal do jogo
- Conecte dois pontos adjacentes para desenhar uma linha.
- Ao fechar o 4o lado de um quadrado, o jogador marca ponto e joga de novo.
- Quando todas as linhas acabam, a partida termina.
- Vence quem fizer mais quadrados.
- Empate e possivel.

## Estrutura tecnica
- O motor de jogo e imutavel e funcional.
- O tabuleiro pode ser:
  - denso, em grade quadrada completa
  - esparso, com celulas ativas em formato retangular
- O renderer desenha em Canvas e funciona com mouse e touch.
- Existe suporte para vibracao, musicas, tema, idioma, persistencia e anuncios.

## Modos de jogo

### Arcade
- Existem 60 fases.
- As fases usam 10 templates de tabuleiro que se repetem em ciclo.
- A dificuldade base muda a cada bloco de 10 fases.
- Fases com numero par recebem um boost de dificuldade efetiva.
- As viradas de dificuldade acontecem na fase 1, 11, 21, 31, 41 e 51.
- Nessas viradas aparece uma tela de introducao antes da partida com a mensagem de boas-vindas a dificuldade.
- O titulo da fase aparece como `Fase X - Dificuldade Y`.
- O progresso do arcade fica salvo no perfil local.
- Stars sao calculadas com base no placar real, nao em valor fixo.
- Ao vencer, o jogo registra:
  - estrelas
  - melhor placar
  - XP ganho
- Ao perder, mostra tela de derrota com opcoes de tentar de novo ou voltar ao mapa.
- Existe skip de fase por anuncio, com limite semanal.
- O arcade consome energia para iniciar uma fase, exceto quando o God Mode esta ativo ou a energia ilimitada esta ligada.

### Treino contra IA
- Existe um modo dedicado para jogar contra IA.
- A dificuldade da IA tem 7 niveis:
  - muito-facil
  - facil
  - medio
  - dificil
  - muito-dificil
  - impossivel
  - impulsivo
- O jogador pode escolher tamanho de grade entre 3 e 6.
- A IA tem tempos de pensamento diferentes por dificuldade.
- A IA usa heuristicas e minimax em niveis mais altos.

### Multijogador local
- O jogo aceita 2, 3 ou 4 jogadores no mesmo aparelho.
- Para 4 jogadores existe modo solo ou em duplas 2v2.
- Nao existe multiplayer online ou matchmaking no momento.

### Tutorial
- Existe uma tela de tutorial com 4 passos.
- O tutorial explica:
  - como conectar pontos
  - como fechar quadrados
  - como pontuar
  - como lidar com a IA
- Tambem ha uma dica visual de tabuleiro.

## Templates de tabuleiro do arcade
Os 10 templates atuais sao:
- Mini Classico
- Classico Mobile
- Cruz Compacta
- Diamante Quadriculado
- Ampulheta Quadriculada
- Escadinha
- Ilhas Duplas
- Corredor Vertical
- Campo Tatico
- Labirinto Mobile

## Progressao e meta

### Energia
- Energia maxima atual: 10.
- A regeneracao de energia e controlada por uma unica constante central.
- O tempo de regeneracao esta em minutos e aceita valores como `0.5`, `1`, `1.5`, `2` e assim por diante.
- Atualmente o valor definido e 2 minutos por energia.
- A conversao para milissegundos acontece na logica de armazenamento.
- Energia pode ser recuperada por anuncio recompensado.
- O God Mode pode zerar a energia ou liberar energia ilimitada.

### Skips semanais
- O arcade tem pulos semanais limitados.
- O limite atual e 3 por semana.
- O contador reseta por semana, com inicio na segunda-feira.
- O God Mode pode restaurar os pulos.

### Rank e XP
- O perfil salva XP e progresso das fases.
- O rank sobe por faixas de XP.
- Faixas atuais:
  - Beginner: 0
  - Bronze I: 500
  - Bronze II: 1000
  - Bronze III: 1500
  - Silver I: 2500
  - Silver II: 3500
  - Silver III: 6000
  - Gold I: 10000
  - Gold II: 15000
  - Gold III: 20000
  - Platinum I: 30000
  - Platinum II: 40000
  - Platinum III: 50000
  - Diamond: 75000
  - Master: 150000
- O rank e mostrado com anel de progresso.

### Perfil
- O perfil local guarda:
  - nome
  - XP
  - progresso das fases
  - estrelas por fase
  - melhor score por fase
- O botao de perfil na UI ainda e um atalho simples com mensagem de "em breve".

## UI e experiencia
- O jogo tem 3 temas visuais:
  - dark
  - light
  - pink
- Existe uma tela inicial para escolher tema quando necessario.
- O idioma e selecionavel e salvo em localStorage.
- Idiomas disponiveis:
  - pt-BR
  - pt-PT
  - es
  - en
- O idioma tambem pode ser detectado automaticamente pelo navegador.
- A UI e responsiva e pensada para mobile.
- O fundo muda por tema.
- Ha animacoes de celebracao, confetti, overlays de vitoria/derrota e modal de anuncio.
- A vibracao pode ser ativada/desativada.
- A musica de fundo tem controle de volume e fade-in.
- O controle de som existe na tela, mas o slider de volume de efeito ainda e apenas placeholder/desativado.
- O canvas usa area de toque maior no celular.

## Anuncios e monetizacao
- O jogo usa AdMob recompensado via Capacitor no Android.
- Os IDs de producao e teste ficam centralizados nas constantes do jogo.
- A producao de anuncios esta desativada por seguranca no estado atual.
- Em plataformas nao suportadas, o fluxo recompensa fica indisponivel.
- O anuncio recompensado principal da energia da +5 energia.
- O skip de fase usa um modal de anuncio simulado no proprio jogo antes de consumir o pulo.

## God Mode
O God Mode e feito para teste e QA.

### Acessos
- Botao de coroa no menu.
- Botao de coroa durante a partida.
- Atalho antigo: 7 cliques no titulo do menu.

### Funcoes atuais
- Ativar/desativar energia ilimitada.
- Recarregar energia.
- Zerar energia.
- Restaurar skips semanais.
- Ir para uma fase especifica.
- Completar fase atual como vitoria.
- Completar fase atual como derrota.
- Ir para a proxima fase.

## Detalhes de gameplay que importam para futuras ideias
- O arcade tem progressao persistente e nao e so um modo infinito.
- O jogo ja combina habilidade, replay e monetizacao leve.
- A dificuldade da IA ja existe em varios niveis e pode ser refinada.
- O tabuleiro pode ser rectangular e esparso, entao novas fases podem variar bastante a forma.
- O game ja tem suporte a telemetria visual local, como XP, rank, estrelas e energia.
- O fluxo de vitoria e derrota ja esta bem separado por modo.
- O jogo ja tem boa base para eventos, desafios diarios, cosmesticos e novos tipos de recompensas.

## Partes do codigo que concentram a logica
Se for sugerir mudancas de produto ou implementar features, estes arquivos sao os principais:
- `src/config/game-constants.ts`
- `src/ui/main.ts`
- `src/ui/storage.ts`
- `src/ui/arcade-stages.ts`
- `src/ui/bot.ts`
- `src/ui/renderer.ts`
- `src/ui/admob.ts`
- `src/services/board.ts`
- `src/services/move.ts`
- `src/ui/i18n.ts`

## O que nao deve ser quebrado
- Energia, regeneracao e anuncios.
- Progresso do arcade e salvamento local.
- 60 fases atuais.
- Templates de tabuleiro e a progressao de dificuldade.
- Jogabilidade local contra IA.
- Multijogador local.
- Persistencia de tema, idioma, vibracao e musica.
- Compatibilidade com Android via Capacitor.
- Estrutura mobile first e responsiva.

## Como pedir ideias ao ChatGPT
Use este briefing e responda com:

```text
Quero ideias de evolucao para o Dots and Boxes com base neste briefing.
Me entregue:
1. 20 ideias de features, separadas por impacto e custo.
2. 5 ideias de baixo risco que eu consigo implementar rapido.
3. 5 ideias de medio prazo.
4. 5 ideias mais ousadas.
5. Para cada ideia, diga: objetivo, como funcionaria, beneficio para o jogador, risco e dependencia tecnica.
6. Nao sugira nada que quebre energia, anuncios, progresso ou o modo arcade.
7. Priorize ideias que aumentem retenção, rejogabilidade e clareza da experiencia.
8. Se alguma ideia exigir backend, diga isso claramente.
```

## Versao curta do prompt
Se quiser algo ainda mais direto, use:

```text
Analise o Dots and Boxes descrito neste briefing e me sugira evolucoes de gameplay, meta, monetizacao leve e UX sem quebrar o que ja existe. Quero ideias praticas, priorizadas e com riscos apontados.
```
