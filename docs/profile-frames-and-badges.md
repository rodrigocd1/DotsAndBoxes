# Molduras e Selos — Perfil do Jogador

---

## Tipos de Moldura

| Tipo | Origem | Descrição |
|---|---|---|
| Moldura VIP | Passe VIP ativo | Borda exclusiva para assinantes |
| Moldura Ranked | Tier competitivo | Bronze, Prata, Ouro, Platina, Diamante, Mestre, Lendário |
| Moldura de Temporada | Fim de temporada | Recompensa por participação/rank na temporada |
| Moldura de Evento | Evento especial | Recompensa por participação em evento |
| Moldura Beta Tester | Participação no beta | Exclusiva para beta testers |

---

## Selos / Badges

| Selo | Como obter |
|---|---|
| VIP | Passe VIP ativo |
| Beta Tester | Participação no beta |
| Lendário | Atingir rank Lendário no competitivo |
| Mestre | Atingir rank Mestre no competitivo |
| Top 10 Timer Attack | Ranking semanal |
| Top 10 Nervos de Aço | Ranking semanal |

---

## Campos Conceituais (Perfil)

```ts
interface ProfileFrameConfig {
  equippedFrameId: string | null;
  equippedBadgeId: string | null;
  vipBadgeActive: boolean;
  rankedFrameId: string | null;
  seasonFrameId: string | null;
  eventFrameId: string | null;
  betaTesterFrameId: string | null;
}
```

---

## Card/Banner do Usuário

O card do usuário mostra:
- Avatar (padrão do jogo ou foto SSO, se permitido)
- Nome
- Rank e pontuação
- Moldura equipada (sobreposição)
- Selo(s) ativo(s)
- Fases concluídas (Arcade)
- Win rate

---

## Regras

- Apenas 1 moldura pode ser equipada por vez
- Molduras podem ser trocadas a qualquer momento
- Molduras expiram se vinculadas a assinatura (VIP expira = moldura VIP desativa)
- Selos podem ser empilhados (exibir até 3 simultâneos)
