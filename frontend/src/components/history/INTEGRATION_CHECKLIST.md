# History Integration Checklist

Use this checklist when adding history to a new CRUD detail page.

## Pre-Integration

- [ ] Entity has history endpoint in backend (`/historico/{id}`)
- [ ] Service has `pesquisarHistorico(id: number)` method
- [ ] Entity type is defined in TypeScript (`D[EntityName]`)

## Code Changes

### 1. Imports
```typescript
- [ ] import { useState } from 'react';
- [ ] import { HistoryButton, HistoryModal } from '@/components/history';
- [ ] import { [entity]Service } from '@/services/[entity]Service';
```

### 2. State Management
```typescript
- [ ] const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
```

### 3. UI Integration
```typescript
- [ ] Add HistoryButton in page actions area
- [ ] Add HistoryModal at end of component
- [ ] Pass correct entityId prop
- [ ] Pass correct fetchHistoryFn prop
- [ ] Pass descriptive entityName prop (optional but recommended)
```

### 4. Event Handlers
```typescript
- [ ] onClick={() => setIsHistoryModalOpen(true)} on button
- [ ] onClose={() => setIsHistoryModalOpen(false)} on modal
```

## Testing

### Manual Testing
- [ ] Navigate to entity detail page
- [ ] Click "Visualizar Histórico" button
- [ ] Modal opens with loading indicator
- [ ] History timeline displays after load
- [ ] Latest record shows "Versão Atual" badge
- [ ] Field changes show old → new format
- [ ] Dates formatted as dd/MM/yyyy - HH:mm
- [ ] Close with ESC key works
- [ ] Close with X button works
- [ ] Close by clicking backdrop works
- [ ] Focus returns to button after close

### Error Scenarios
- [ ] Test with invalid entityId (should show error)
- [ ] Test with entity that has no history (shows "Nenhum histórico disponível")
- [ ] Test with network error (shows retry button)
- [ ] Retry button refetches data

### Accessibility
- [ ] Tab to button works
- [ ] Enter/Space activates button
- [ ] Focus trapped in modal when open
- [ ] Screen reader announces content
- [ ] All interactive elements keyboard accessible

## Code Quality

- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Follows existing code patterns
- [ ] Props correctly typed
- [ ] Service method exists and works

## Documentation

- [ ] Code comments added if logic is complex
- [ ] PR description explains integration
- [ ] Screenshots of working feature (optional)

## Performance

- [ ] History only fetches when modal opens (not on page load)
- [ ] No unnecessary re-renders
- [ ] Cache working (check Network tab - no duplicate requests)

## Checklist for Common Entities

### Cor (Color)
- [ ] Button added to Cor detail page
- [ ] Modal integrated with `corService.pesquisarHistorico`
- [ ] Tested with different cor records

### Chapa (Panel)
- [ ] Button added to Chapa detail page
- [ ] Modal integrated with `chapaService.pesquisarHistorico`
- [ ] Tested with different chapa records

### Material
- [ ] Button added to Material detail page
- [ ] Modal integrated with `materialService.pesquisarHistorico`
- [ ] Tested with different material records

### Acessório (Accessory)
- [ ] Button added to Acessório detail page
- [ ] Modal integrated with `acessorioService.pesquisarHistorico`
- [ ] Tested with different acessório records

### [Add your entity]
- [ ] Button added to [Entity] detail page
- [ ] Modal integrated with `[entity]Service.pesquisarHistorico`
- [ ] Tested with different [entity] records

## Quick Reference

### Minimal Integration (Copy & Paste)

```typescript
// 1. Import
import { useState } from 'react';
import { HistoryButton, HistoryModal } from '@/components/history';
import { entityService } from '@/services/entityService';

// 2. Inside component
const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

// 3. In render - Button
<HistoryButton onClick={() => setIsHistoryModalOpen(true)} />

// 4. In render - Modal
<HistoryModal
  isOpen={isHistoryModalOpen}
  onClose={() => setIsHistoryModalOpen(false)}
  entityId={entityId}
  fetchHistoryFn={entityService.pesquisarHistorico}
  entityName={`Entity - ${entity?.descricao}`}
/>
```

## Common Issues & Solutions

### Issue: Modal doesn't open
**Solution**: Check `isHistoryModalOpen` state is being set to `true`

### Issue: History not loading
**Solution**: Verify `fetchHistoryFn` prop points to correct service method

### Issue: "Invalid entity ID" error
**Solution**: Ensure `entityId` is a positive integer

### Issue: Fields not showing changes
**Solution**: Backend must return `diff` field (handled automatically)

### Issue: Dates showing as raw strings
**Solution**: This is a bug - dates should auto-format. Check console for errors.

### Issue: TypeScript errors on props
**Solution**: Import types: `import type { HistoryModalProps } from '@/components/history'`

## Support

- 📖 Full documentation: `INTEGRATION_GUIDE.md`
- 💡 Working example: `HistoryIntegrationExample.tsx`
- 🧪 Test reference: `src/components/history/*.test.tsx`
- 📚 API reference: Component prop types in TypeScript definitions

---

**Remember**: The integration is identical for all entities. If it works for one, it works for all! 🚀
