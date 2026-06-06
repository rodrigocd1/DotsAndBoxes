# RUNBOOK - execucao rapida

Este arquivo existe para que a proxima execucao local seja direta e sem busca em outros docs.

## Subir o jogo

```powershell
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Abra:

```text
http://127.0.0.1:5173/
```

## Comandos uteis

- `npm test`
- `npm run typecheck`
- `npm run build`
- `npm run preview`
- `npm run apk`

## Se a porta 5173 ja estiver ocupada

- Tente `npm run dev -- --port 5174`
- Confira `vite-dev.out.log` e `vite-dev.err.log` se o servidor nao subir
