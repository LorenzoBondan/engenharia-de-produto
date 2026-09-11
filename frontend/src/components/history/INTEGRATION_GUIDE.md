# History Integration Guide

## Overview

This guide shows how to integrate history functionality into any CRUD detail page. The integration is generic and works with all 40+ entity types in the system.

## Prerequisites

- Entity must have a history endpoint in the backend service
- Service must implement `pesquisarHistorico(entityId: number)` method
- User must have appropriate permissions (handled automatically)

## Step-by-Step Integration

### 1. Import Required Components and Hooks

```typescript
import { useState } from 'react';
import { HistoryButton } from '../components/history/HistoryButton';
import { HistoryModal } from '../components/history/HistoryModal';
import { corService } from '../services/corService'; // Your entity service
```

### 2. Add State Management

Add state to control modal visibility:

```typescript
export function CorDetailPage() {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Your existing state...
  const corId = 123; // From route params or props

  // ... rest of component
}
```

### 3. Add History Button

Place the button in your page header or actions area:

```typescript
<div className="page-header">
  <h1>Cor - {cor?.descricao}</h1>

  <div className="actions">
    {/* Your existing action buttons */}
    <button onClick={handleEdit}>Editar</button>
    <button onClick={handleDelete}>Excluir</button>

    {/* Add history button */}
    <HistoryButton onClick={() => setIsHistoryModalOpen(true)} />
  </div>
</div>
```

### 4. Add History Modal

Place the modal at the end of your component (outside main content):

```typescript
return (
  <div className="cor-detail-page">
    {/* Your existing page content */}
    <div className="details">
      <p>Código: {cor?.codigo}</p>
      <p>Descrição: {cor?.descricao}</p>
      {/* ... */}
    </div>

    {/* History Modal */}
    <HistoryModal
      isOpen={isHistoryModalOpen}
      onClose={() => setIsHistoryModalOpen(false)}
      entityId={corId}
      fetchHistoryFn={corService.pesquisarHistorico}
      entityName={`Cor - ${cor?.descricao}`}
    />
  </div>
);
```

## Complete Example

Here's a full working example for a Color (Cor) detail page:

```typescript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HistoryButton } from '../components/history/HistoryButton';
import { HistoryModal } from '../components/history/HistoryModal';
import { corService } from '../services/corService';
import type { DCor } from '../models/cor';

export function CorDetailPage() {
  // Route params
  const { id } = useParams<{ id: string }>();
  const corId = parseInt(id || '0');

  // State
  const [cor, setCor] = useState<DCor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Load entity data
  useEffect(() => {
    const loadCor = async () => {
      try {
        setLoading(true);
        const response = await corService.buscarPorId(corId);
        setCor(response.data);
      } catch (error) {
        console.error('Error loading cor:', error);
      } finally {
        setLoading(false);
      }
    };

    if (corId > 0) {
      loadCor();
    }
  }, [corId]);

  if (loading) return <div>Carregando...</div>;
  if (!cor) return <div>Cor não encontrada</div>;

  return (
    <div className="cor-detail-page">
      {/* Header */}
      <div className="page-header">
        <h1>Cor - {cor.descricao}</h1>

        <div className="actions">
          <button onClick={() => console.log('Edit')}>Editar</button>
          <button onClick={() => console.log('Delete')}>Excluir</button>

          {/* History button */}
          <HistoryButton
            onClick={() => setIsHistoryModalOpen(true)}
          />
        </div>
      </div>

      {/* Details */}
      <div className="details">
        <div className="field">
          <label>Código:</label>
          <span>{cor.codigo}</span>
        </div>
        <div className="field">
          <label>Descrição:</label>
          <span>{cor.descricao}</span>
        </div>
        <div className="field">
          <label>Hexa:</label>
          <span>{cor.hexa}</span>
        </div>
        <div className="field">
          <label>Situação:</label>
          <span>{cor.situacao}</span>
        </div>
      </div>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        entityId={corId}
        fetchHistoryFn={corService.pesquisarHistorico}
        entityName={`Cor - ${cor.descricao}`}
      />
    </div>
  );
}
```

## Integration for Other Entities

The pattern is **identical** for all entity types. Simply replace:

1. **Service**: `corService` → `chapaService`, `materialService`, etc.
2. **Type**: `DCor` → `DChapa`, `DMaterial`, etc.
3. **Entity Name**: `"Cor"` → `"Chapa"`, `"Material"`, etc.

### Examples for Other Entities

#### Chapa (Panel)
```typescript
<HistoryModal
  isOpen={isHistoryModalOpen}
  onClose={() => setIsHistoryModalOpen(false)}
  entityId={chapaId}
  fetchHistoryFn={chapaService.pesquisarHistorico}
  entityName={`Chapa - ${chapa?.descricao}`}
/>
```

#### Material
```typescript
<HistoryModal
  isOpen={isHistoryModalOpen}
  onClose={() => setIsHistoryModalOpen(false)}
  entityId={materialId}
  fetchHistoryFn={materialService.pesquisarHistorico}
  entityName={`Material - ${material?.descricao}`}
/>
```

#### Acessório (Accessory)
```typescript
<HistoryModal
  isOpen={isHistoryModalOpen}
  onClose={() => setIsHistoryModalOpen(false)}
  entityId={acessorioId}
  fetchHistoryFn={acessorioService.pesquisarHistorico}
  entityName={`Acessório - ${acessorio?.descricao}`}
/>
```

## Props Reference

### HistoryButton

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `onClick` | `() => void` | Yes | - | Callback when button is clicked |
| `label` | `string` | No | `"Visualizar Histórico"` | Custom button label |

### HistoryModal

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | `boolean` | Yes | - | Controls modal visibility |
| `onClose` | `() => void` | Yes | - | Callback to close modal |
| `entityId` | `number` | Yes | - | ID of the entity to fetch history for |
| `fetchHistoryFn` | `(id: number) => Promise<AxiosResponse<HistoryRecord<T>[]>>` | Yes | - | Service method to fetch history |
| `entityName` | `string` | No | `"Histórico de Alterações"` | Display name for modal title |

## Testing Integration

After integrating, test the following workflow:

1. ✅ Navigate to entity detail page
2. ✅ Click "Visualizar Histórico" button
3. ✅ Modal opens with loading state
4. ✅ History timeline displays after data loads
5. ✅ Each record shows field changes with old → new format
6. ✅ Latest record has "Versão Atual" badge
7. ✅ Date and author are formatted correctly
8. ✅ Close modal with ESC key
9. ✅ Close modal with X button
10. ✅ Close modal by clicking backdrop

## Error Handling

The integration handles all errors automatically:

- **404**: "Histórico não encontrado para esta entidade"
- **403**: "Você não tem permissão para visualizar o histórico"
- **500**: "Erro no servidor ao carregar histórico"
- **Network**: "Erro de rede. Verifique sua conexão"

All errors display a "Tentar novamente" button for retry.

## Performance Considerations

- **Caching**: History is cached per entity for the session duration
- **Cache Size**: Maximum 20 entities cached (oldest removed first)
- **Refresh**: Manual refresh bypasses cache
- **Loading**: Only fetches when modal opens (not on page load)

## Accessibility Features

The integration provides full keyboard accessibility:

- **Focus Management**: Focus trapped in modal when open
- **ESC Key**: Closes modal
- **Enter/Space**: Activates history button
- **ARIA Labels**: Screen reader friendly
- **Focus Restoration**: Returns focus to button after close

## Common Questions

### Q: Do I need to add permissions checking?
**A**: No, the backend handles permissions. The components will display appropriate error messages if user lacks access.

### Q: Can I customize the button label?
**A**: Yes, use the `label` prop:
```typescript
<HistoryButton
  onClick={() => setIsHistoryModalOpen(true)}
  label="Ver Histórico"
/>
```

### Q: What if my entity has a compound name?
**A**: Use template literals in `entityName`:
```typescript
entityName={`${entityType} - ${entity?.codigo} - ${entity?.descricao}`}
```

### Q: Can I style the button differently?
**A**: Yes, the button uses CSS modules. Override styles in your page's CSS:
```css
.actions .historyButton {
  /* Your custom styles */
}
```

### Q: What if history endpoint has different name?
**A**: Wrap it in an adapter function:
```typescript
const fetchHistory = (id: number) => myService.getHistory(id);

<HistoryModal
  fetchHistoryFn={fetchHistory}
  // ...
/>
```

## Support

For issues or questions:
- Check test files for usage examples
- Review component props in TypeScript definitions
- Consult this guide for common patterns
