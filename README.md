# ERC-20 Point of Sale System

## Vision
A self-hostable PoS that can process transactions using ERC-20 tokens

**1. Cart & Itemization**
- Map SKUs to qty, price, modifiers
- Prices stored and calculated in token base units (wei-equivalent integers, no floats)
- No tax layer needed unless you add it — simplify for now

**2. Payment Request**
- POS generates a payment request: `{ merchant_address, token_contract, amount, cart_hash, nonce }`
- Rendered as QR code or deep link (EIP-681 URI format)
- Customer wallet parses and prompts a `transfer()` call — no custom contract needed at this stage

**3. Transaction State Machine**
- States: `Draft → Requested → Pending (mempool) → Confirmed → Failed`
- POS polls or subscribes to `Transfer` events filtered by `to=merchant_address` and `amount` match
- Nonce in the request ties the on-chain event back to the cart

**4. Immutable Ledger**
- Append-only local record: cart snapshot, tx hash, block number, timestamp, token amount
- The blockchain is your source of truth — local ledger is your queryable index

**5. Receipt Generation**
- Digital only — JSON payload with tx hash, block explorer link, items, amount
- No ESC/POS needed unless you want it later

---

**Transaction Lifecycle**

`Draft` → build cart
`Requested` → generate EIP-681 URI, display QR
`Pending` → customer signs and broadcasts
`Confirmed` → Transfer event received, local ledger written
`Archived` → receipt issued

---

**What drops out vs the traditional version**

- No cash/change logic
- No payment gateway or webhooks — the chain is the gateway
- No offline journaling — if the node is down, payment can't proceed anyway
- Rollback is replaced by on-chain finality — you wait for confirmation before committing locally
