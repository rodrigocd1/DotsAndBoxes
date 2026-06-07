# Recuperação de Conta

---

## Visão Geral

Chave de recuperação forte, sem hífen, acessível no perfil do jogador.

---

## Características da Chave

| Propriedade | Valor |
|---|---|
| Formato | Alfanumérico maiúsculo, sem hífen |
| Comprimento | 28 caracteres |
| Exemplo | `DBM8XQ7M2PL9A4ZK6TNY3RW5CJV` |
| Fixo até regenerar? | Sim |
| Armazena no backend | Somente hash (nunca o código puro) |

---

## Fluxo no Perfil

### Sem login/SSO

- A seção "Recuperação de Conta" aparece
- Ao tentar copiar, o app oferece fazer login/SSO
- Sem login, o código é local e não tem backup

### Com login/SSO

- Botões disponíveis:
  - **Mostrar**: revela o código
  - **Copiar**: copia para clipboard
  - **Gerar novo**: regenera o código (confirmação obrigatória)
  - **Ocultar**: esconde o código

---

## Segurança

- Código nunca é salvo em texto puro no backend/Salesforce
- Backend armazena apenas o hash
- Hash gerado com algoritmo seguro (SHA-256 + salt)
- Código exibido ao jogador apenas na tela do perfil
- Não enviar código em logs, analytics ou telemetria

---

## Geração

- Caracteres: `A-Z`, `0-9` (sem `O`, `I`, `L` para evitar confusão)
- 28 caracteres
- Sem hífen
- Gerado com `crypto.getRandomValues()` quando disponível
