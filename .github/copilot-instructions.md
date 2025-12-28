# IntentLink Frontend - AI Agent Instructions

## Project Overview

Next.js 15 DeFi application enabling natural language intent execution on BlockDAG and Polygon networks. Users describe financial operations in plain text (e.g., "Stake 1000 BDAG in the safest farm"), and the system parses, plans, and executes multi-step blockchain transactions with AI-powered security validation.

## Architecture & Data Flow

### Core Intent Processing Pipeline

1. **Parse**: Natural language → structured intent (`lib/apiService.ts::parseIntent`)
2. **Plan**: Intent → execution candidates with security scoring (`lib/apiService.ts::getPlan`)
3. **Review**: User reviews AI-recommended strategy with APY/TVL/safety metrics
4. **Prepare**: Get EIP-712 typed data for signing (`lib/apiService.ts::prepareSignature`)
5. **Sign**: User signs with wallet using `ethers.signTypedData()` (EIP-712 standard)
6. **Execute**: Submit signature + metadata to backend (`lib/apiService.ts::submitIntent`)
7. **Poll**: Track transaction status until confirmed

State management flows through `hooks/use-intent.ts` → `components/sections/hero.tsx` UI states:

```typescript
'idle' → 'parsing' → 'planning' → 'review' → 'executing' → 'success'/'error'
```

**Critical Security Flow**: All executions require EIP-712 signatures. The backend validates the signature against the IntentWallet contract before submitting transactions.

**Wallet Address Validation**: The system tracks the wallet address used during parse and validates it hasn't changed before execution. This prevents signature mismatches if users switch accounts mid-flow.

### Backend Integration

- API Base: `http://127.0.0.1:8001/api/v1` (configurable via `NEXT_PUBLIC_API_URL`)
- Critical endpoints: `/parse-intent/`, `/plan/`, `/prepare-signature/`, `/submit-intent/`, `/execution/{id}/status/`
- All requests use axios with 15s timeout (`lib/apiService.ts`)
- Execution tracking: Poll every 2s until `status === 'confirmed'` (see `use-intent.ts::confirmExecution`)
- **EIP-712 Signing**: `/prepare-signature/` returns typed data conforming to IntentWallet contract spec
  - Domain: `{name: "IntentWallet", version: "2", chainId: dynamic, verifyingContract: chain-specific}`
  - IntentWalletV2 addresses: BlockDAG (1043): `0xe3dad1813a5c75fba505780a386a81fd3b8777e4`, Polygon Amoy (80002): `0x0881a837699208342675591b48910e3f5cfd951d`
  - Type: `Intent` with fields `[user, intentType, target, amount, nonce, expiry]`

### Web3 Wallet Integration

- Context: `contexts/WalletContext.tsx` provides global wallet state
- Target chains: BlockDAG Awakening Testnet (1043), Polygon Amoy (80002)
- Auto-reconnect on page load via `ethers.BrowserProvider::listAccounts()`
- Event listeners for `accountsChanged` and `chainChanged` (triggers page reload on network switch)

## Development Workflow

### Running the App

```powershell
cd intentlink
npm run dev  # Uses Turbopack for HMR
# Open http://localhost:3000
```

### Building for Production

```powershell
npm run build  # Next.js build with Turbopack
npm start      # Production server
```

### Linting

```powershell
npm run lint  # ESLint via next.config (eslint.config.mjs)
```

## Code Conventions & Patterns

### Component Organization

```
components/
├── sections/          # Page-level sections (hero.tsx, features.tsx, etc.)
├── ui/               # Reusable UI primitives (shadcn/ui based)
└── intent-input.tsx  # Domain-specific components
```

### Styling System

- **Tailwind 4** with custom design tokens (`tailwind.config.ts`)
- Primary color: `#00f0ff` (cyan), Secondary: `#bd00ff` (magenta)
- Glass morphism: `bg-glass-surface/50 backdrop-blur-xl border-glass-border`
- Gradient utilities: `bg-linear-to-r from-primary to-secondary`
- Custom animations: `animate-gradient-x`, `animate-pulse-slow`, `animate-float`

### Typography Stack

```typescript
font-heading: Rajdhani (700 weight for titles)
font-body: Inter (paragraphs, UI text)
font-mono: JetBrains Mono (wallet addresses, tx hashes)
```

### UI Component Patterns

**GlassCard** - Standard container with glassmorphism:

```tsx
<GlassCard className="border-primary/50 bg-primary/5">
  {/* Content with auto z-10 layering */}
</GlassCard>
```

**ActionButton** - Primary CTA with gradient:

```tsx
<ActionButton onClick={handler} size="lg">
  <Icon className="mr-2 h-5 w-5" />
  Button Text
</ActionButton>
```

**Toast Notifications** - Use `sonner` for all user feedback:

```typescript
import { toast } from "sonner";
toast.success("Title", { description: "Details", duration: 5000 });
toast.error("Error", { description: error.message });
```

### State Management Patterns

**Wallet State** - Always use context hook:

```typescript
const { walletAddress, chainId, connectWallet, disconnectWallet } = useWallet();
```

**Intent Processing** - Use custom hook:

```typescript
const {
  status,
  chosenCandidate,
  txHash,
  processIntent,
  confirmExecution,
  reset,
} = useIntent();
// confirmExecution requires chainId and currentWallet for validation
confirmExecution(chainId, walletAddress);
```

**Conditional Rendering** - AnimatePresence for smooth transitions:

```tsx
<AnimatePresence mode="wait">
  {status === "idle" ? (
    <InputView />
  ) : status === "review" ? (
    <ReviewView />
  ) : status === "success" ? (
    <SuccessView />
  ) : null}
</AnimatePresence>
```

## Type System

All API types defined in `lib/types.ts`:

- `ParseIntentRequest/Response` - Natural language processing
- `PlanRequest/Response` - Execution planning with `Candidate[]`
- `SubmitIntentRequest/Response` - Transaction submission
- `ExecutionStatusResponse` - Status polling with `tx_hash` and `logs[]`

**Critical Type Usage**:

```typescript
interface Candidate {
  address: string; // Contract address
  apy: number; // Decimal format (0.12 = 12%)
  tvl: number; // USD value
  safety_score: number; // 0-100 (GoPlus score)
  utility: number; // AI ranking
  warnings: string[]; // Security alerts
  protocol: string; // "staking" | "lending"
}
```

## Common Pitfalls & Solutions

1. **Ethers v6 Account Handling**: `listAccounts()` returns `JsonRpcSigner[]` not `string[]` - access via `.address`
2. **Chain ID Type**: Store as `number`, convert hex with `parseInt(chainId, 16)` in event listeners
3. **Toast on Network Change**: Always reload page after `chainChanged` event (1s delay)
4. **Execution Polling**: Clear interval on `confirmed` or `failed` to prevent memory leaks
5. **Background Image Layering**: Fixed positioning with z-index layers (0: image/effects, 10: content)
6. **EIP-712 Signature Chain Validation**: ALWAYS validate `typed_data.domain.chainId === walletChainId` before calling `signTypedData()` - mismatched chains cause contract reverts
7. **Wallet Address Consistency**: Validate wallet address hasn't changed between parse and execute steps - prevents signature verification failures
8. **EIP712Domain Type Removal**: Remove `EIP712Domain` from types object before passing to `signTypedData()` - ethers v6 handles domain internally
9. **Signature Error Handling**: Error code `4001` or `ACTION_REJECTED` = user rejected signature in wallet popup
10. **Poll Timeout**: Implement timeout (60 polls = 2 minutes) to prevent infinite polling

## Integration Points

### Block Explorers

- BlockDAG: `https://awakening.bdagscan.com/tx/${txHash}`
- Polygon Amoy: Update URLs when chain ID is 80002

### External Dependencies

- **Framer Motion**: All page transitions and AnimatePresence usage
- **Radix UI**: Dialog, AlertDialog components (low-level primitives)
- **Lucide React**: Icon system (import from `lucide-react`)
- **ethers.js**: v6 API for wallet interactions (BrowserProvider pattern)

## Security Considerations

- Always validate `walletAddress` exists before API calls
- Display safety_score prominently in review UI (yellow < 80, green ≥ 80)
- Show warnings from `Candidate.warnings[]` before execution
- **EIP-712 Signature Security**: Backend validates signatures against IntentWallet contract (0x718a09...c7)
  - Signature validation failure returns `401 Unauthorized`
  - Nonce must match user's on-chain nonce (auto-fetched by backend)
  - Expiry timestamp prevents replay attacks
- **User Verification**: Signature pop-up allows users to review plan details before execution
- MetaMask error code handling: `4001` = user rejection of signature request

## File Naming & Import Conventions

- Use kebab-case for filenames: `use-intent.ts`, `api-test-button.tsx`
- Absolute imports via `@/` alias (tsconfig paths)
- Client components: `"use client"` directive at top
- Type-only imports: Separate from value imports in `lib/types.ts`

## When Making Changes

1. **New Components**: Add to `components/ui/` if reusable, `components/sections/` if page-specific
2. **API Changes**: Update types in `lib/types.ts` first, then `lib/apiService.ts`
3. **Styling**: Use Tailwind utilities; add custom animations in `tailwind.config.ts`
4. **State Updates**: Prefer context/hooks over prop drilling (see WalletContext pattern)
5. **Testing Backend**: Use ApiTestButton (bottom-right) to verify connection before debugging frontend
