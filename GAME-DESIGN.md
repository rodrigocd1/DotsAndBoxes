# Dots & Boxes — Game Design Document

## Visão Geral

Dots & Boxes com três modos de jogo: **Arcade**, **vs Bot** e **Multijogador**. O progresso do jogador é rastreado por um sistema de **Rank** global baseado em pontuação acumulada nos modos competitivos.

---

## 1. Modo Arcade

Inspirado em jogos de puzzle por fase (ex.: Candy Crush). O jogador avança por estágios com dificuldade crescente, desbloqueando ranks ao completar faixas de níveis.

### 1.1 Estrutura de Fases

| Faixa       | Estágios    | Grade       | Oponente (Bot)  | Objetivo especial         |
|-------------|-------------|-------------|-----------------|---------------------------|
| Iniciante   | 1 – 50      | 3×3 – 4×4   | Muito Fácil     | Vencer por qualquer placar|
| Bronze      | 51 – 100    | 4×4         | Fácil           | Vencer por ≥2 caixas      |
| Prata       | 101 – 200   | 4×4 – 5×5   | Médio           | Vencer por ≥3 caixas      |
| Ouro        | 201 – 300   | 5×5         | Difícil         | Vencer sem perder >50%    |
| Platina     | 301 – 400   | 5×5 – 6×6   | Muito Difícil   | Vencer com caixas extras  |
| Diamante    | 401 – 500   | 6×6         | Impossível      | Vencer em ≤N jogadas      |

- Cada fase tem **3 estrelas**: 1 = venceu; 2 = cumpriu objetivo; 3 = cumpriu objetivo com margem.
- Estrelas acumuladas desbloqueiam cosméticos (cores de jogador, fundos de tabuleiro).
- Fase falha → tenta novamente sem penalidade. Não há vidas (design inclusivo).

### 1.2 Objetivos Especiais por Fase

| Tipo de Objetivo         | Descrição                                                         |
|--------------------------|-------------------------------------------------------------------|
| Margem de vitória        | Vencer com pelo menos N caixas de diferença                       |
| Velocidade               | Vencer em menos de T segundos de tempo total de jogada            |
| Economia de linhas       | Fechar todas as caixas possíveis sem dar nenhuma ao bot           |
| Dominância               | Terminar com ≥70% das caixas                                      |
| Sequência perfeita       | Fechar 3 caixas consecutivas em um único turno                    |

### 1.3 Pontuação de Fase

```
Pontos = (Caixas próprias × 100) + (Estrelas × 50) + Bônus de velocidade − Penalidade por tentativas extras
```

Os pontos acumulados alimentam o **Rank Global** (seção 4).

---

## 2. Modo vs Bot

Partida avulsa contra a IA. O jogador escolhe grade e dificuldade livremente.

### 2.1 Níveis de Dificuldade do Bot

| Nível          | Comportamento da IA                                                                 |
|----------------|-------------------------------------------------------------------------------------|
| **Muito Fácil**| Joga linha aleatória a cada turno. Sem estratégia.                                  |
| **Fácil**      | 70% aleatório; 30% pega caixa óbvia (3 lados fechados).                            |
| **Médio**      | Sempre pega caixa disponível. Evita completar cadeias curtas para o adversário.     |
| **Difícil**    | Minimax profundidade 3. Aplica regra de cadeia (evita dar sequências longas).       |
| **Muito Difícil**| Minimax profundidade 6 com poda alfa-beta. Controla cadeias e sacrifícios.        |
| **Impossível** | Minimax profundidade máxima + teoria de cadeias (Berlekamp). Quase imbatível.      |
| **Impulsivo**  | Alterna entre Impossível e Muito Fácil aleatoriamente por turno (imprevisível).    |

### 2.2 Algoritmo por Nível

```
Muito Fácil  →  random()
Fácil        →  random() com 30% chance de greedy
Médio        →  greedy (pega caixa) + heurística de cadeia simples
Difícil      →  minimax(depth=3) + alpha-beta
Muito Difícil→  minimax(depth=6) + alpha-beta + ordering
Impossível   →  minimax(depth=∞ até folha) em grades ≤4×4; depth=8 em ≥5×5
Impulsivo    →  por turno: 40% Impossível, 60% aleatório (surpresa garantida)
```

### 2.3 Partida vs Bot

- Grade: 3×3 a 6×6.
- Vencedor recebe XP para o Rank (metade do XP do modo Arcade).
- Derrota não penaliza, mas não dá XP.

---

## 3. Modo Multijogador

Partida local (mesmo dispositivo) ou futuro online.

### 3.1 Configuração de Jogadores

| Parâmetro        | Opções                                    |
|------------------|-------------------------------------------|
| Nº de jogadores  | 2, 3 ou 4                                 |
| Modo de equipe   | Solo (todos contra todos) ou Duplas (2v2) |
| Grade            | 3×3 a 6×6 (6×6 recomendado para 4 players)|
| Tempo por turno  | Livre, 15s, 30s, 60s (countdown)          |

### 3.2 Modo Duplas (2v2)

- Times: **Time A** (Jogadores 1 e 3) vs **Time B** (Jogadores 2 e 4).
- Caixas fechadas somam ao placar do **time**, não do jogador individual.
- A ordem de turno é: J1 → J2 → J3 → J4 → J1 → …
- Comunicação entre parceiros: sem dicas visuais da IA (jogo justo).
- Placar exibido por time + contribuição individual (para estatísticas).

### 3.3 Regras de Turno com Timer

- Expirou o tempo → linha aleatória jogada automaticamente.
- Jogador sem movimento disponível (impossível em Dots & Boxes, mas tratado como proteção) → turno pulado.

### 3.4 Fim de Partida Multijogador

- **Solo**: maior número de caixas vence. Empate → ambos são co-vencedores.
- **Duplas**: time com mais caixas vence. Empate → partida empate.
- Tela de resultado mostra ranking final, caixas por jogador, tempo total.

---

## 4. Sistema de Rank

### 4.1 Ranks e Faixas de XP

| Rank          | Ícone | XP necessário | Bônus visual               |
|---------------|-------|---------------|----------------------------|
| Iniciante     | ⚪    | 0             | —                          |
| Bronze I–III  | 🥉    | 500 – 2.499   | Borda bronze               |
| Prata I–III   | 🥈    | 2.500 – 9.999 | Borda prata + trilha       |
| Ouro I–III    | 🥇    | 10.000–29.999 | Borda dourada + partículas |
| Platina I–III | 💎    | 30.000–74.999 | Efeito de brilho           |
| Diamante      | 🔷    | 75.000–149.999| Animação de diamante       |
| Mestre        | 👑    | 150.000+      | Coroa animada + top global |

### 4.2 Ganho de XP

| Ação                             | XP     |
|----------------------------------|--------|
| Vencer fase Arcade               | +100   |
| Estrela extra (objetivo)         | +50    |
| Vencer vs Bot (Difícil+)         | +60    |
| Vencer vs Bot (Médio)            | +30    |
| Vencer Multijogador              | +80    |
| Vitória por dominância (≥70%)    | +30 bônus |
| Sequência de vitórias (streak)   | +20 por vitória consecutiva |

### 4.3 Leaderboard

- Top 100 global por XP total.
- Top 10 por nível de fase Arcade concluído.
- Filtros: global / amigos / semanal / mensal.
- Perfil público: rank, fases completadas, estrelas totais, win rate vs bot por dificuldade.

---

## 5. Progressão e Desbloqueios

### 5.1 Cosméticos (sem pay-to-win)

| Item                | Como desbloquear              |
|---------------------|-------------------------------|
| Cor de jogador      | Atingir rank Prata            |
| Fundo de tabuleiro  | Completar faixa de estágios   |
| Estilo de linha     | Streak de 10 vitórias         |
| Animação de caixa   | 3 estrelas em 20 fases        |
| Efeito de vitória   | Atingir rank Ouro             |

### 5.2 Conquistas

| Conquista                  | Critério                                      |
|----------------------------|-----------------------------------------------|
| Primeiro Sangue            | Fechar primeira caixa                         |
| Mestre das Cadeias         | Fechar 5 caixas em um único turno             |
| Inquebrável                | Vencer sem que o bot feche nenhuma caixa      |
| Lendário                   | Completar fase 500                            |
| Impiedoso                  | Vencer no modo Impossível 10 vezes            |
| Social                     | Completar 10 partidas multijogador            |
| Velocista                  | Vencer uma fase em menos de 30 segundos       |

---

## 6. Roadmap de Implementação

### Fase 1 — MVP (atual)
- [x] Engine de jogo puro (imutável, testável)
- [x] UI Web com Vite + Canvas
- [x] Tabuleiro interativo (3×3 a 6×6)
- [x] Modo 2 jogadores local

### Fase 2 — Bot + Arcade Base
- [ ] Bot Muito Fácil, Fácil e Médio
- [ ] Modo Arcade estágios 1–50
- [ ] Sistema de estrelas por fase
- [ ] Tela de seleção de fases

### Fase 3 — Multijogador e Rank
- [ ] Suporte 3–4 jogadores locais
- [ ] Modo duplas (2v2)
- [ ] Timer por turno
- [ ] Sistema de XP e Rank (localStorage)
- [ ] Leaderboard local

### Fase 4 — Bot Avançado + Arcade Completo
- [ ] Bot Difícil, Muito Difícil, Impossível, Impulsivo
- [ ] Arcade estágios 51–500
- [ ] Objetivos especiais por fase
- [ ] Cosméticos e conquistas

### Fase 5 — Mobile (Capacitor)
- [ ] Configurar Capacitor (Android/iOS)
- [ ] Ajustes de touch e responsividade mobile
- [ ] Gerar APK de debug
- [ ] Publicar na Play Store

### Fase 6 — Online (futuro)
- [ ] Backend de leaderboard online
- [ ] Multijogador online em tempo real (WebSocket)
- [ ] Sistema de amigos e desafios
