**Build Order and Validation Criteria**

1. **Local testnet + wallet connection**
   - Spin up Hardhat or Anvil, deploy a minimal ERC-20
   - Validation: wagmi connects to a local wallet (MetaMask on localhost), reads token balance correctly

2. **Cart state**
   - Hardcode 3-5 items, build cart logic with integer arithmetic in token base units
   - Validation: add/remove items, totals are correct, no float arithmetic anywhere

3. **EIP-681 QR generation**
   - Take cart total + merchant address, encode as EIP-681 URI, render QR
   - Validation: scan QR with MetaMask mobile — it should pre-fill the correct token, address, and amount

4. **Transfer event listener**
   - Subscribe to the token contract's Transfer event filtered by merchant address and expected amount
   - Validation: complete a transfer from a second test wallet, POS detects and matches it to the open cart

5. **Transaction state machine**
   - Wire states `Draft → Requested → Pending → Confirmed → Failed` to the cart and event listener
   - Validation: every state transition is triggered by a real event, no manual state setting in UI code

6. **SQLite ledger**
   - On Confirmed, write an append-only record: tx hash, block number, items snapshot, token amount, timestamp
   - Validation: complete 5 transactions, query the DB directly and verify records are complete and no duplicates exist

7. **Receipt**
   - Generate a JSON receipt with tx hash, block explorer link, and cart snapshot
   - Validation: receipt ties back 1:1 to the ledger record and the on-chain transaction
