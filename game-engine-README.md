# @dots-and-boxes/game-engine

Lógica pura do jogo **Dots and Boxes**, sem nenhuma dependência de React Native.
Tudo é função pura sobre estado imutável — 100% testável sem UI.

## Princípios de arquitetura

- **Imutabilidade total.** `applyMove(state, line)` nunca muta a entrada; retorna
  um novo `GameState`. Isso habilita *desfazer*, *replay* e *IA com lookahead* de graça.
- **Erros como valor, não exceção.** `applyMove` retorna `ValidationResult<GameState>`
  com códigos (`LINE_ALREADY_TAKEN`, `LINE_NOT_FOUND`, `GAME_FINISHED`) que a camada
  `errors/` da UI traduz para mensagem amigável (mesmo padrão do projeto Veo).
- **Fonte única de verdade do placar = os `boxes`.** `player.score` é só um cache
  espelho; `getScores()` recalcula a partir da posse dos quadrados.
- **Tabuleiro denso.** Todas as linhas e quadrados existem desde `createBoard`,
  com `ownerId: null`. Jogar = setar o dono. Renderizar/IA = filtrar.
- **Chaves estáveis.** `lineKey` é canônica (`h-row-col` / `v-row-col`),
  independente da ordem em que os dois pontos foram clicados.

## API pública

```ts
import {
  createPlayer, createBoard, applyMove, makeLine, dot,
  getScores, isGameOver, getWinner, getAvailableLines,
} from "@dots-and-boxes/game-engine";

const players = [createPlayer("p1", "Rodrigo", "#032D60"),
                 createPlayer("p2", "Michaell", "#FFD500")];

let state = createBoard(5, players);            // 5x5 pontos => 4x4 quadrados

const result = applyMove(state, makeLine(dot(0, 0), dot(0, 1)));
if (result.ok) {
  state = result.value;                          // novo estado
} else {
  console.log(result.code, result.error);        // jogada inválida
}

getScores(state);        // { p1: 0, p2: 0 }
getAvailableLines(state) // linhas ainda jogáveis (base da IA e da renderização)
getWinner(state);        // Player | "draw" | null (null = jogo em andamento)
```

## Regras implementadas

- Grade de N×N pontos; jogadores se alternam clicando em linhas entre pontos vizinhos.
- Fechar o 4º lado de um quadrado dá o quadrado **e uma jogada extra**.
- Uma única linha pode fechar **dois** quadrados de uma vez (testado).
- O jogo termina quando todas as linhas foram jogadas; vence quem tiver mais quadrados.

## Como rodar os testes

```bash
npm install
npm test            # jest
npm run typecheck   # tsc --noEmit (strict)
```

22 testes, ~95% de cobertura no core. Typecheck sob `strict`,
`noUncheckedIndexedAccess` e `exactOptionalPropertyTypes`.

## Próximos passos sugeridos

- `packages/game-engine/src/ai/` — IA simples (evitar dar o 3º lado) usando
  `getAvailableLines` + simulação de `applyMove` (estado imutável já permite).
- Histórico de jogadas para *undo/redo*: guardar a pilha de `Line` jogadas.
