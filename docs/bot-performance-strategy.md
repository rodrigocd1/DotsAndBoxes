# Performance do Bot / IA

---

## Problema

A IA pode ser lenta em tabuleiros grandes (5×5, 6×6) com profundidade alta de minimax, travando a UI.

---

## Timeouts por Dificuldade

| Dificuldade | Timeout Sugerido |
|---|---|
| Muito Fácil | 100ms |
| Fácil | 200ms |
| Médio | 500ms |
| Difícil | 1000ms |
| Muito Difícil | 1500ms |
| Impossível | 2000ms |
| Impulsivo | Rápido com aleatoriedade |

Se ultrapassar o timeout: usar melhor jogada encontrada até o momento ou fallback heurístico.

---

## Estratégias de Otimização

### Fallback Heurístico
- Se minimax exceder timeout, usar heurística (greedy + evitar 3º lado)
- Sempre retornar uma jogada válida, nunca travar

### Cache de Estados
- Cache de avaliações de estados já computados
- Invalidar cache entre partidas
- Limite de memória para evitar leak

### Pré-análise
- Enquanto o jogador pensa, calcular jogadas prováveis
- Background computation sem bloquear UI

### Web Worker (Futuro)
- Mover minimax para Web Worker
- Comunicação via postMessage
- UI nunca trava independente da profundidade

### Profundidade Dinâmica
- Ajustar profundidade baseado no tamanho do tabuleiro
- Grids maiores = profundidade menor
- Monitorar tempo real e reduzir profundidade se necessário

---

## Métricas

- Medir tempo médio por jogada da IA
- Medir tempo máximo por jogada da IA
- Registrar no Laboratório de Teste
- Alertar se tempo médio > timeout configurado

---

## Regras

- Nunca travar a UI
- Sempre retornar jogada em tempo hábil
- `scheduleBotMove()` deve verificar `session === s` antes de jogar
- Depth máximo seguro: 12 para ≤4×4; 8 para ≥5×5
