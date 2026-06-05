# CLAUDE.md

## Objetivo

Atue como agente de desenvolvimento sênior neste projeto Dots and Boxes.

Priorize qualidade, simplicidade, performance, baixo risco de regressão, boa UX e economia de tokens.

Execute apenas o que foi solicitado. Não invente regra de negócio. Não altere escopo. Não modifique partes não relacionadas ao pedido. Não crie novo padrão se já existir padrão no projeto. Não quebre comportamento existente.

**Antes de alterar lógica do jogo, leia `GAME_CONTEXT.md`.** Para game design e roadmap, consulte `GAME-DESIGN.md`.

---

## Contexto do projeto

**Tecnologia:** TypeScript + Vite (web) + Jest + Canvas 2D. Sem framework de UI.

**Plataformas:** Web (principal). Android/iOS via Capacitor (planejado — `base: "./"` já configurado).

**Arquitetura em duas camadas:**

| Camada | Pasta | Regra |
|---|---|---|
| Engine puro | `src/models/`, `src/services/`, `src/queries/`, `src/state/`, `src/validation/` | Sem dependência de UI. Funções puras, estado imutável. Testado por Jest. |
| UI | `src/ui/` | Canvas, navegação, bot, i18n, storage, temas. Sem testes automatizados. |

**Comandos:**
```bash
npm run dev        # Vite dev server em localhost:5173
npm test           # Jest (22 testes no engine)
npm run typecheck  # tsc --noEmit strict
npm run build      # Build de produção em dist/
```

---

## Economia de tokens e leitura de contexto

Ao iniciar conversa nova, leia uma única vez:
- `CLAUDE.md`
- `GAME_CONTEXT.md`
- `GAME-DESIGN.md` (apenas se a tarefa envolver game design ou novos modos)
- `README.md` (apenas se precisar de setup/arquitetura)

Depois informe:

```
Contexto carregado. Não vou reler os mesmos arquivos nesta thread, salvo alteração, solicitação explícita ou necessidade real.
```

Durante a mesma thread:
- não releia os mesmos arquivos a cada pedido;
- use o contexto já carregado;
- releia apenas se o arquivo mudou ou se a tarefa envolver área ainda não consultada.

Nunca use economia de tokens para ignorar regra crítica, teste, segurança ou lógica central do jogo.

---

## Estilo de resposta

Responda com máxima objetividade. Não repita o pedido. Não explique teoria sem solicitação. Mostre apenas o necessário.

Ao alterar código, responda sempre neste formato:

1. Causa
2. Arquivo(s) alterado(s)
3. Diff apenas (não o arquivo inteiro)
4. Como validar

Se a solução for direta, entregue apenas a solução. Se faltar informação essencial, faça no máximo uma pergunta objetiva.

---

## Antes de alterar qualquer arquivo

Analise e identifique:
- em qual camada a mudança se encaixa (engine vs UI);
- se já existe padrão para o que será implementado;
- quais arquivos serão afetados;
- se há testes a atualizar.

Reutilize código existente. Não duplique lógica. Não assuma regra de negócio sem evidência no código, em `GAME_CONTEXT.md` ou no pedido.

---

## Regras técnicas obrigatórias

- Mantenha TypeScript strict (sem `any`, sem `!` desnecessário).
- Mantenha imutabilidade no engine: `applyMove` nunca muta entrada.
- Use `ValidationResult<T>` para erros do engine — nunca `throw` em lógica de jogo.
- Use `t("chave")` de `src/ui/i18n.ts` para toda string visível ao usuário — nunca hardcode.
- Use `loadTheme()` / `saveTheme()` de `src/ui/storage.ts` — nunca acesse `localStorage` diretamente para tema.
- Chaves de linha são canônicas via `lineKey()` — nunca recomputar manualmente.
- Não introduza dependência nova sem justificar e sem solicitação explícita.
- Não altere `tsconfig.json` sem necessidade (configuração strict deliberada: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).
- CSS de UI fica injetado em `src/ui/main.ts` — não criar arquivos `.css` separados sem pedido.

---

## Regras do jogo Dots and Boxes

A lógica clássica está em `src/services/move.ts`. Não altere sem pedido explícito:

- Jogadores alternam turnos desenhando linhas entre pontos adjacentes.
- Uma linha só pode ser desenhada se ainda não existir (`ownerId === null`).
- Fechar o 4º lado de um quadrado → jogador pontua **e joga novamente**.
- Uma jogada pode fechar mais de um quadrado — todos pontuados.
- Jogo termina quando todas as linhas foram preenchidas.
- Vence quem tiver mais quadrados. Empate tratado.

Antes de alterar lógica central, identificar onde estão no código:

| Conceito | Localização |
|---|---|
| Estado global da partida | `src/state/game-state.ts` → `GameState` |
| Criar tabuleiro | `src/services/board.ts` → `createBoard()` |
| Aplicar jogada | `src/services/move.ts` → `applyMove()` |
| Linhas disponíveis | `src/queries/lines.ts` → `getAvailableLines()` |
| Fim de jogo / vencedor | `src/services/end-game.ts` |
| Placar (auditoria) | `src/services/scoring.ts` → `getScores()` |
| Modelo de linha | `src/models/line.ts` → `makeLine()`, `lineKey()` |
| Controle de UI | `src/ui/controller.ts` → `GameController` |
| Bot / IA | `src/ui/bot.ts` → `chooseBotMove()` |

---

## Bot e IA

Se alterar `src/ui/bot.ts`:
- Não tornar nenhum nível mais fácil ou mais difícil sem pedido.
- Não bloquear a UI durante cálculo (timeout via `setTimeout` já existe).
- Garantir que o bot respeite `ownerId === null` antes de jogar.
- Garantir que o bot ganhe turno extra ao fechar quadrado (a engine já cuida disso via `applyMove` — não reimplementar).
- Depth máximo seguro: 12 para ≤4×4; 8 para ≥5×5.

---

## Arcade e Fases

`src/ui/arcade-stages.ts` é **determinístico** — `getStage(id)` sempre retorna o mesmo resultado. Não adicionar estado externo ou randomização não-semeada a essa função.

Fases 51–500 estão especificadas no código mas o mapa Arcade exibe apenas `INITIAL_STAGES = 50`. Não alterar esse limite sem pedido.

---

## i18n

Toda nova string visível ao usuário deve ter entrada nos 4 idiomas em `src/ui/i18n.ts`: `pt-BR`, `pt-PT`, `es`, `en`. Usar `t("nova_chave")` — nunca hardcode em português.

---

## Tema

Os dois temas (`dark`, `light`) usam CSS custom properties definidas em `src/ui/main.ts`. Ao adicionar novo elemento visual, usar as variáveis existentes (`--bg`, `--bg-2`, `--bg-3`, `--border`, `--text`, `--text-2`, `--shadow`, etc.) — não hardcode cor hex diretamente.

---

## Interface e UX

Não alterar visual sem solicitação explícita. Preservar:
- Feedback de linha hover (cor do jogador atual semi-transparente)
- Indicação de turno ativo (chip com borda colorida)
- Celebração de vitória (confetti + animação de estrelas)
- Banner de derrota com opções de retry/anúncio
- Toast de feedback (`showToast()`)
- God Mode (👑, ativado com 7 cliques no título)

O Canvas é escalonado via CSS (`max-width: 100%`) — coordenadas de clique devem sempre usar `getScaledCoords()` / o padrão de `scaled()` existente.

---

## Testes

Ao alterar engine (`src/models/`, `src/services/`, `src/queries/`), criar ou atualizar testes em Jest.

Cenários obrigatórios se alterar `applyMove` ou regras:
- jogada válida
- jogada inválida (linha já tomada, linha inexistente, jogo finalizado)
- fechamento de um quadrado → turno extra
- fechamento de múltiplos quadrados na mesma jogada
- alternância de turno quando não fecha quadrado
- fim de jogo: vencedor e empate

```bash
npm test           # rodar antes e depois da alteração
npm run typecheck  # obrigatório em qualquer PR
```

---

## Performance

- Não recalcular o tabuleiro inteiro a cada frame. Renderizar apenas no evento `draw()`.
- Minimax com depth > 8 em grade 6×6 pode travar a UI — não aumentar sem medir.
- `scheduleBotMove()` verifica `session === s` antes de jogar — preservar essa guarda.

---

## Segurança e privacidade

- Não expor tokens, chaves ou credenciais.
- Não adicionar tracking, analytics ou coleta de dados sem pedido.
- `localStorage` contém apenas dados de jogo locais (perfil, energia, tema, progresso).

---

## Git

Não criar branch, commit, push, pull, merge ou rebase sem solicitação explícita. Não executar comandos destrutivos. Não instalar dependências sem pedido. Não publicar build. Não alterar configurações de bundle id, signing ou loja sem solicitação.

---

## Validação

Sempre informar como validar. Incluir:
- Comando de teste ou tela/fluxo manual
- Cenário de jogo específico
- Resultado esperado
- Casos de regressão relevantes

---

## Proibições

- Não inventar regra de jogo.
- Não alterar comportamento existente sem pedido.
- Não alterar visual sem solicitação.
- Não adicionar dependência sem necessidade e sem explicar motivo.
- Não criar código morto ou duplicar lógica.
- Não deixar arquivos temporários.
- Não simular execução — nunca afirmar que executou sem executar.
- Não criar solução grande quando alteração pequena resolve.
- Não implementar features do roadmap (`GAME-DESIGN.md` fase 3+) sem pedido explícito.
