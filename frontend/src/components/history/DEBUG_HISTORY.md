# Debug: Como funciona a ordem do histórico

## Lógica Atual

### 1. Backend retorna
O backend retorna o histórico (pode ser em qualquer ordem)

### 2. Hook ordena (useEntityHistory.ts linha 163)
```typescript
const sortedHistory = sortHistoryByDate(historyData);
// Ordena: MAIS RECENTE PRIMEIRO (newest first)
// Resultado: [v3 (atual), v2, v1 (inicial)]
```

### 3. Timeline renderiza (HistoryTimeline.tsx linha 49)
```typescript
const isLatest = index === 0; // Primeiro item (v3) = true
```

## Cenário Visual

```
┌─────────────────────────────────────┐
│ [VERSÃO ATUAL] ← index 0            │ ← Deveria ter badge
│ Versão 3 - 30/01/2026               │
│ Alterações: valor 200 → 300         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Versão 2 - 29/01/2026               │ ← index 1
│ Alterações: valor 100 → 200         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Versão 1 - 28/01/2026               │ ← index 2 (último)
│ Versão inicial criada               │
└─────────────────────────────────────┘
```

## Problema Possível

**HIPÓTESE 1**: Backend retorna na ordem errada e nosso sort não está funcionando
**HIPÓTESE 2**: Usuário está vendo o último item visualmente (na parte de baixo da tela) e espera que ele seja marcado como "atual"

## Verificação Necessária

1. Verificar se `history[0]` é realmente o mais recente
2. Verificar se a badge aparece no primeiro card
3. Verificar se CSS da badge está aplicado corretamente
