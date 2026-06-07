# Sistema de Códigos de Recompensa

---

## Visão Geral

Sistema para resgate de códigos promocionais que concedem recompensas in-game.

---

## Código Permanente

| Campo | Valor |
|---|---|
| Código | `PUTZFORCE` |
| Expira? | Não (permanente) |
| Limite | 1 uso por conta |
| Exige login/SSO? | Sim |
| Origem | Final dos vídeos do canal Putz!Force |

### Recompensa Sugerida

- +5 energia
- +1 Dica do Mestre
- +1 retry grátis

---

## Tipos de Código

| Tipo | Expiração | Exemplo |
|---|---|---|
| Permanente | Nunca | `PUTZFORCE` |
| Temporário | Data definida | Códigos de evento, campanha |
| Sem expiração | Nunca (mas pode ser desativado) | Promoções especiais |

---

## Regras

- Limite de 1 uso por conta para cada código
- Login/SSO obrigatório para resgatar
- Validação futura via Salesforce/Apex REST
- Recompensas configuráveis por código
- Código não diferencia maiúsculas/minúsculas na entrada, mas armazena em caixa alta

---

## Fluxo de Resgate

1. Jogador acessa tela "Resgatar Código"
2. Digita o código
3. App valida (local ou via Salesforce)
4. Se válido e não usado: aplica recompensa
5. Se já usado: mostra mensagem "Código já resgatado"
6. Se inválido/expirado: mostra mensagem "Código inválido ou expirado"
