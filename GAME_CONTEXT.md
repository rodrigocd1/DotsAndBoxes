# GAME_CONTEXT.md

> Contexto específico do jogo. Leia este arquivo antes de alterar qualquer lógica de regra, engine, IA ou modos de jogo.
> Para detalhamento de game design, roadmap e tabelas de progressão consulte `GAME-DESIGN.md`.

---

## Objetivo do jogo

Dots and Boxes clássico com progressão estilo mobile (Arcade) e IA.

- Jogadores conectam pontos adjacentes desenhando linhas.
- Quem fecha o 4º lado de um quadrado pontua e joga novamente.
- Uma linha pode fechar dois quadrados simultaneamente (testado).
- O jogo termina quando todas as linhas possíveis foram desenhadas.
- Vence quem tiver mais quadrados. Empate é tratado.

---

## Tecnologia

| Item | Detalhe |
|---|---|
| Linguagem | TypeScript 5.7 (strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes) |
| Engine / Runtime | Vite 8 (dev server + build) |
| Testes | Jest 29 + ts-jest |
| Renderização | Canvas 2D (sem framework de UI) |
| Persistência | localStorage |
| i18n | Sistema próprio em `src/ui/i18n.ts` |
| Tema | CSS custom properties + `data-theme` no `<html>` |

**Plataformas alvo:**
- Web (PC/Mac): principal
- Android: via Capacitor (planejado, `base: "./"` já configurado no Vite)
- iOS: via Capacitor (planejado)

---

## Estrutura de pastas

```
src/
  models/         # Tipos de domínio puros (Dot, Line, Box, Player)
  services/       # Lógica de regra do jogo (board, move, end-game, scoring)
  queries/        # Consultas de estado (getAvailableLines)
  state/          # Tipo GameState
  validation/     # ValidationResult<T> — erros como valor, não exceção
  ui/
    main.ts       # Ponto de entrada, navegação entre telas, CSS injetado
    renderer.ts   # Renderização Canvas do tabuleiro
    controller.ts # GameController — wrapper de estado para a UI
    bot.ts        # IA com 7 níveis de dificuldade (minimax + alpha-beta)
    i18n.ts       # Sistema de traduções (pt-BR, pt-PT, es, en)
    storage.ts    # localStorage: perfil, energia, god mode, tema
    arcade-stages.ts # Geração determinística das 500 fases
  index.ts        # Re-exports públicos do engine
  demo.ts         # Script CLI de demonstração
```

---

## Engine do jogo (src/services/ + src/models/)

### Princípio central: imutabilidade total

`applyMove(state, line)` **nunca muta** a entrada. Retorna `ValidationResult<GameState>`.

```ts
// Padrão correto — sempre
const result = applyMove(state, line);
if (result.ok) state = result.value;
else console.error(result.code); // LINE_ALREADY_TAKEN | LINE_NOT_FOUND | GAME_FINISHED
```

### Tabuleiro denso

`createBoard(gridSize, players)` cria todas as linhas e quadrados com `ownerId: null`.
Jogar = setar `ownerId`. IA/renderizador = filtrar por `ownerId`.

### Chaves estáveis

- Linhas: `lineKey(line)` → `h-row-col` (horizontal) ou `v-row-col` (vertical)
- Quadrados: `boxKeyFromTopLeft(dot)` → `b-row-col`
- Independentes da ordem de clique — nunca recomputar, só usar a chave.

### Placar

`player.score` é **cache espelho**. A fonte de verdade são os `boxes`.
`getScores(state)` recalcula a partir dos `boxes` — use quando precisar de auditoria.

### Erros como valor

```ts
// ValidationResult<T>: { ok: true, value: T } | { ok: false, error: string, code: string }
```

Nunca lançar exceção para jogada inválida. Sempre usar o retorno tipado.

---

## Modos de jogo

| Modo | Status | Descrição |
|---|---|---|
| Arcade | Ativo | 50 fases (500 planejadas), bot progressivo, 3 estrelas por fase |
| vs Bot | Ativo | Partida avulsa, grade 3×3–6×6, 7 dificuldades |
| Multijogador local | Ativo | 2–4 jogadores, modo duplas (2v2) ou solo |
| Multiplayer online | Planejado | Fora de escopo atual |

---

## Bot / IA (`src/ui/bot.ts`)

**7 níveis**, implementados como função pura `chooseBotMove(state, difficulty)`:

| Nível | Algoritmo |
|---|---|
| `muito-facil` | Linha aleatória |
| `facil` | 50% chance de pegar caixa óbvia; senão aleatório |
| `medio` | Greedy (pega caixa se disponível) + evita dar o 3º lado |
| `dificil` | Minimax depth=3 + alpha-beta |
| `muito-dificil` | Minimax depth=6 + alpha-beta + move ordering |
| `impossivel` | Minimax depth=12 (≤4×4) ou depth=8 (≥5×5) |
| `impulsivo` | 40% Minimax depth=8, 60% aleatório |

**Regras que o bot deve sempre respeitar:**
- Nunca jogar em linha já preenchida (`ownerId !== null`)
- Ganhar turno extra ao fechar quadrado (idêntico ao jogador humano)
- Pontuar múltiplos quadrados fechados na mesma jogada

**Delay de "pensar"** (`botThinkDelay`): 300ms–1200ms por nível, nunca bloqueia a UI.

---

## Sistema de Arcade (`src/ui/arcade-stages.ts`)

- `getStage(id)` é **determinística** — mesma entrada, mesma saída, sem estado externo.
- `INITIAL_STAGES = 50`, `TOTAL_STAGES = 500`.
- Grade e dificuldade determinadas por faixa (TIERS) + `id % gridSizes.length`.
- Objetivo (`objectiveType`) determinado por `id % 5`.
- Desbloquear fase N+1 requer `stars > 0` na fase N.

---

## Energia (`src/ui/storage.ts`)

- `MAX_ENERGY = 15`, regenera 1 a cada 60s.
- `spendEnergy()` retorna `false` se zerada (UI deve tratar e não iniciar partida).
- God Mode com `unlimitedEnergy: true` ignora o consumo.
- Partidas Arcade consomem 1 energia; vs Bot e Multijogador são gratuitos.

---

## i18n (`src/ui/i18n.ts`)

- 4 idiomas: `pt-BR`, `pt-PT`, `es`, `en`.
- Função `t("chave", { variavel: valor })` — nunca hardcode string visível ao usuário.
- Idioma detectado via `navigator.language`, persistido em localStorage.
- Trocar idioma recria a tela atual (via `showMenu()` ou equivalente).

---

## Tema (`src/ui/storage.ts` + CSS em `src/ui/main.ts`)

- `dark` (padrão) e `light`.
- Aplicado via `data-theme` no `<html>` com CSS custom properties (`--bg`, `--text`, etc.).
- `applyTheme()` chamado no boot antes de qualquer render.
- Temas controlam: background pattern, cores de superfície, borda, sombra, gradiente do título.

---

## Tamanhos de tabuleiro

- Mínimo: 3×3 pontos (2×2 quadrados) — `MIN_GRID_SIZE = 2` pontos (garante ≥1 quadrado)
- Máximo usado: 6×6 pontos (5×5 = 25 quadrados)
- A grade é sempre quadrada (NxN pontos → (N-1)×(N-1) quadrados)

---

## Testes (`npm test`)

22 testes cobrindo o engine (não a UI):

| Arquivo | O que cobre |
|---|---|
| `src/models/line.test.ts` | `makeLine`, `lineKey`, adjacência, canonização |
| `src/queries/lines.test.ts` | `getAvailableLines` |
| `src/services/board.test.ts` | `createBoard`, validação de parâmetros |
| `src/services/move.test.ts` | jogada válida, inválida, fechamento, turno extra, fim de jogo |
| `src/services/end-game.test.ts` | `isGameOver`, `getWinner`, empate |

**Ao alterar qualquer arquivo em `src/models/`, `src/services/` ou `src/queries/`, rodar:**
```bash
npm test
npm run typecheck
```

---

## Monetização

- Anúncio simulado (mock) ao falhar fase Arcade: `showAdModal()` em `src/ui/main.ts`.
- Sem SDK de anúncios real integrado atualmente.
- Sem compras in-app no momento.
- God Mode é ferramenta de desenvolvimento, não monetização.

---

## Ranking e XP

- 15 tiers de rank: Iniciante → Bronze I–III → Prata → Ouro → Platina → Diamante → Mestre.
- XP persistido em `dab_profile` (localStorage).
- `rankLabel(xp)` em `storage.ts` usa `t()` para nomes traduzidos.
- Anel de progresso SVG calculado em `rankProgressSVG(xp)` no menu.

---

## Riscos conhecidos

- Minimax com depth alto em grades 6×6 pode ser lento; depth 8 é o limite seguro para UI responsiva.
- `applyMove` em loop de bot pode acumular chamadas se `scheduleBotMove` não verificar `session === s`.
- Troca de idioma durante partida ativa descarta a sessão (comportamento intencional).
- `GAME-DESIGN.md` descreve features planejadas (500 fases, online, cosméticos) que ainda não estão implementadas — não implementar sem pedido.

---

## Fora de escopo recorrente

- Multiplayer online (WebSocket/backend)
- Cosméticos e desbloqueios visuais
- Fases 51–500 (backend de geração está pronto mas o mapa só exibe 50)
- Integração real com Capacitor/APK
- SDK de anúncios (AdMob, etc.)
- Autenticação de usuário / backend de leaderboard
