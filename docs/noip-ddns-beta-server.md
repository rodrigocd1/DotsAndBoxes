# No-IP / DDNS — Servidor Beta

---

## Visão Geral

Servidor beta caseiro usando No-IP/DDNS para testes internos.

---

## Configuração

| Campo | Valor |
|---|---|
| Hostname | `dbm-beta.myftp.biz` |
| Serviço DDNS | No-IP |
| Protocolo | HTTPS (quando possível) |

---

## Variáveis de Ambiente

Todas as credenciais ficam em `.env` (nunca no código).

Ver `.env.example` na raiz do projeto:

```env
NOIP_DDNS_HOSTNAME=dbm-beta.myftp.biz
NOIP_DDNS_USERNAME=<preencher_localmente>
NOIP_DDNS_PASSWORD=<preencher_localmente>
NOIP_UPDATE_INTERVAL_MINUTES=10
BETA_SERVER_PUBLIC_URL=https://dbm-beta.myftp.biz
```

---

## Segurança

- `.env` está no `.gitignore`
- Nunca commitar credenciais reais
- `.env.example` contém apenas placeholders
- Credenciais reais são preenchidas localmente

---

## Uso no App

- X1 Online (beta interno) usa `dbm-beta.myftp.biz`
- URL do servidor beta pode ser buscada via Salesforce (Account `GAME_CONFIG`)
- Fallback para URL hardcoded se Salesforce não responder

---

## Migração Futura

- Preparar para migração para cloud/VM
- Manter abstração de URL para facilitar troca
- Endpoint do servidor beta configurável via constantes
