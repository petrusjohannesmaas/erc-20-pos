# Stack

For a React-based POS generating EIP-681 QR codes and watching for `Transfer` events, wagmi gives you wallet connection and contract event subscriptions as hooks out of the box. viem handles the low-level encoding. They're designed to work together.

---

Proposed stack:

| Layer | Choice |
|---|---|
| UI | React + Tailwind |
| Language | TypeScript |
| Blockchain | viem + wagmi |
| QR generation | `qrcode.react` |
| Local ledger | SQLite via `better-sqlite3` |
| Backend | None to start — browser + local node/testnet RPC |

Want me to scaffold the project structure?
