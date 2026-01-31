# Icon Import Pattern - cc3-storefront-vite-react

**Date:** 2026-01-30
**Context:** Bundle size optimization created centralized icon barrel

## Critical Rule: Always Use Icon Barrel

All lucide-react icons MUST be imported from `@/lib/icons`, never directly from `lucide-react`.

### ✅ Correct
```typescript
import { Heart, ShoppingCart, AlertTriangle } from '@/lib/icons';
```

### ❌ Wrong
```typescript
import { Heart } from 'lucide-react'; // DON'T DO THIS
```

## Adding New Icons

1. Add to `src/react-app/lib/icons.ts` (alphabetically):
```typescript
export {
  AlertCircle,
  AlertTriangle,  // <- Add new icon here
  Bell,
  // ...
} from 'lucide-react';
```

2. Import in your component:
```typescript
import { AlertTriangle } from '@/lib/icons';
```

## Current Icons (41)
AlertCircle, AlertTriangle, Bell, Check, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock, CreditCard, Eye, Facebook, Globe, Heart, LinkIcon, Loader2, LogOut, Mail, MapPin, Minus, Package, PackageX, Phone, Play, Plus, RotateCcw, Share2, Shield, ShoppingBag, ShoppingCart, Star, Tag, ThumbsUp, Trash2, Truck, Twitter, User, X, XCircle, ZoomIn

## Why This Matters
- Better tree-shaking (reduces bundle size)
- Centralized icon management
- Easier to audit icon usage
- Consistent pattern across codebase

## Path Alias
`@/lib/icons` → `src/react-app/lib/icons.ts`

## Future: Add ESLint Rule
Prevent direct lucide-react imports with:
```json
"no-restricted-imports": ["error", {
  "paths": [{"name": "lucide-react", "message": "Import from '@/lib/icons'"}]
}]
```
