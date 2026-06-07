# Integração com Salesforce

---

## Visão Geral

O app pode chamar Salesforce diretamente via **Apex REST limitado** para gerenciar dados de jogadores, configurações, feedback e códigos de recompensa.

---

## Arquitetura

- Jogadores/clientes são representados como `Account` no Salesforce
- No começo, dados principais ficam no próprio Account para economizar espaço na Developer Org
- Account especial `GAME_CONFIG` para configurações globais do jogo
- Cache local e fallback offline obrigatórios

---

## Endpoints Planejados

| Endpoint | Função |
|---|---|
| Config | Buscar IP/URL do servidor beta, flags, configurações globais |
| Feedback | Enviar feedback/laboratório como Case ou equivalente |
| Reward Code | Validar e resgatar códigos de recompensa |
| Player Account | CRUD de dados do jogador |
| Recovery | Validar/gerar código de recuperação de conta |

---

## Campos Sugeridos no Account

| Campo | Tipo | Descrição |
|---|---|---|
| `Game_Player_Id__c` | Text | ID único do jogador no jogo |
| `Game_Display_Name__c` | Text | Nome de exibição |
| `Game_Login_Provider__c` | Picklist | google, apple, steam |
| `Game_Google_Id__c` | Text | ID do Google SSO |
| `Game_Apple_Id__c` | Text | ID do Apple SSO |
| `Game_Steam_Id__c` | Text | ID do Steam |
| `Game_Profile_JSON__c` | Long Text | Perfil completo em JSON |
| `Game_Progress_JSON__c` | Long Text | Progresso (fases, estrelas) |
| `Game_Rewards_JSON__c` | Long Text | Recompensas resgatadas |
| `Game_Feedback_JSON__c` | Long Text | Último feedback enviado |
| `Game_Recovery_Hash__c` | Text | Hash da chave de recuperação |
| `Game_Recovery_Code_Created_At__c` | DateTime | Data de criação do código |
| `Game_Passe_VIP_Active__c` | Checkbox | Passe VIP ativo? |
| `Game_Passe_VIP_Expires_At__c` | DateTime | Expiração do Passe VIP |
| `Game_Last_Login_At__c` | DateTime | Último login |
| `Game_Last_Device_Id__c` | Text | Último dispositivo |
| `Game_Is_Beta_Tester__c` | Checkbox | É beta tester? |

---

## Account Especial: GAME_CONFIG

- Account com nome `GAME_CONFIG`
- Contém configurações globais do jogo
- Usado para buscar:
  - URL do servidor beta
  - Flags de feature
  - Mensagens de manutenção
  - Versão mínima obrigatória

---

## Cache e Fallback

- Cache local com TTL configurável
- Fallback offline: usar última resposta cacheada
- Fila de reenvio para operações que falharam
- Nunca travar o app se Salesforce estiver fora

---

## Escopo desta Tarefa

- ✅ Documentar estratégia
- ✅ Preparar interfaces TypeScript
- ❌ Não fazer deploy Salesforce
- ❌ Não criar package.xml
- ❌ Não colocar secrets no código
