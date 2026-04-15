# Zelf Chat (XMTP) Implementation Plan

This document details the implementation of a new "Zelf Chat" feature using the XMTP Web3 messaging protocol inside the `verifik-wallet-extension`. The new option will be accessible via the bottom expanding menu under "Zelf Keys," enabling encrypted conversations directly from the wallet.

---

## 1. Dependency Integration

### Adding XMTP
- Install `@xmtp/xmtp-js`.
- **Polyfill Confidence Check**: XMTP uses `crypto` and `stream` modules heavily. Webpack 5 doesn't include these by default. However, looking at the extension's existing `package.json` (`devDependencies`), you already have `crypto-browserify`, `stream-browserify`, `buffer`, and are using `ngx-build-plus` with `ethers.js`. This indicates that your custom Webpack configuration already polyfills the necessary Node modules for cryptography. We are highly confident that `@xmtp/xmtp-js` will work correctly using your existing build architecture without major adjustments.

---

## 2. Authentication & Keys

To initialize XMTP, we use:
```ts
const client = await Client.create(signer, { env: "production" });
```

### Accessing the Private Key (User Feedback Applied)
- **When to Ask**: We will only request the private key at the exact moment it's necessary (e.g., when the user opens the chat heavily requiring client initialization or sends the initial registration payload). We won't block pure UI loads unnecessarily.
- **How to Ask**: We will rely on the existing `VaultService` decryption flow. As noted, access isn't strictly "Wallet PIN or Biometrics"—it relies dynamically on whether the PGP keys are in the vault. If the vault doesn't have the PGP keys, it will gracefully fall back to requiring Biometrics + Password (if optional constraints apply). We will hook directly into this generalized flow to retrieve the unencrypted Ethereum private key and cast it to an `ethers.Wallet(privateKey)` for XMTP to consume.

---

## 3. Advanced Messaging (Images, Voice, & Attachments)

By default, XMTP handles basic text (`ContentTypeText`). However, to support rich media like images, voice notes, and document attachments, we must configure **XMTP Content Types**.

- **Remote Attachments (`@xmtp/content-type-remote-attachment`)**: Instead of passing heavy media directly through the messaging network, this content type encrypts the file locally, uploads it to decentralized storage (e.g., via the existing `ipfs.service.ts` in Zelf), and sends the IPFS URI plus the decryption key as a tiny payload across XMTP.

### Architecture: Remote Attachment Cryptography
You mentioned ensuring that the secret key lives inside the chat so users can decrypt historical media days later, potentially using Shamir's Secret sharing. Fortunately, **XMTP's Remote Attachment protocol handles exactly this problem natively**, negating the need for custom complex cryptographic implementations:

1. **Local Encryption**: When a user selects an image or records voice, the XMTP SDK automatically generates a unique, one-time symmetric AES-GCM key. The media is encrypted locally using this key.
2. **IPFS Hosting**: Only the scrambled, ciphertext representation of the media is uploaded to your IPFS node.
3. **Key Delivery**: The SDK packages the IPFS URI alongside the symmetric AES key into a tiny JSON descriptor.
4. **End-to-End Encryption**: This descriptor is then sent as a standard XMTP message. XMTP encrypts this message using its native Double Ratchet protocol (bound to the Ethereum private keys of both the sender and the receiver).
5. **Historical Decryption**: Because the symmetric key literally "lives inside the encrypted chat history," whenever either user opens the conversation—even days later—their wallet automatically decrypts the chat history, reads the descriptor, fetches the IPFS blob, and decrypts the media locally in memory. 

- **Implementation Requirements**:
  - Install `@xmtp/content-type-remote-attachment`.
  - Register the content type when initializing the client: `client.registerCodec(new AttachmentCodec())`.
  - Integrate Zelf's `ipfs.service.ts` to host the encrypted IPFS blobs for images and voice notes.
  - Build UI elements for a media picker (images) and a microphone recorder (voice notes using the browser's `MediaRecorder` API).

## 4. Interactive Mini-Apps & Payments (Open Frames)

To untap the thousands of existing apps across the XMTP network and support rich, interactive components like the USDC payment requests shown in the examples, Zelf Chat needs to support **Custom Content Types** and **Open Frames**.

### In-Chat Payments (Zelf Native)
To exactly replicate the "$5.00 USDC Request" functionality:
- We will define custom XMTP content types: `@zelf/content-type-payment-request` and `@zelf/content-type-payment-receipt`.
- When the chat UI detects these content types in the message stream, it will bypass standard text rendering and instead mount an interactive Angular component (the sleek black "You requested $5.00" card).
- When the receiving user clicks "Pay" on this card, we dynamically route them to Zelf's existing `/send` flow, pre-filling the target wallet address, network, and token amount. 
- **UX Loop (Return to Chat)**: Crucially, we will pass a state parameter (e.g., `?returnToChat=peerAddress`) into the routing. We must update the `send-confirm`, `transaction-receipt`, and transaction error screens to detect this parameter. If present, the final default "Go to Home" buttons will be replaced/complemented with a prominent **"Return to Chat"** call-to-action button so the user can seamlessly slide right back into the conversation, whether the transaction succeeded or failed.
- Once the blockchain transaction confirms, Zelf will dispatch the `payment-receipt` payload back over XMTP to update the sender's chat UI with a green checkmark.

### Third-Party Apps (Open Frames)
XMTP supports interactive mini-apps natively mapped inside chats across the ecosystem.
- When an XMTP message contains a URL tied to a mini-app (like Kalshi, Uno, etc.), Zelf Chat will act as an **Open Frames Client**.
- We will integrate `@xmtp/frames-client` to safely parse these payloads and render standard buttons inside the chat feed (e.g., "Trade on Events" -> "Open").
- This transforms Zelf Chat from a simple messenger into a Web3 app store interface.

---

## 5. Network Infrastructure & Cryptography (Alchemy & MLS)

### Quantum-Resistant MLS Encryption
The features you highlighted (Quantum-Resistant Hybrid Encryption, Perfect Forward Secrecy, Post-Compromise Security) are completely built-in by default in **XMTP's V3 Protocol**, which uses the IETF standard **MLS (Message Layer Security)**. 
- You do **not** need to code any of this complex cryptography. The `@xmtp/xmtp-js` SDK handles the key generation, MLS ratcheting, and encryption automatically under the hood purely by initializing the client with the user's Ethereum signer. 

### XMTP Node Connections (Alchemy vs. Default)
While XMTP is a messaging protocol, it does **not** use your standard EVM/Blockchain RPC (like Avalanche or BlockDAG) to send messages. Instead, it uses specialized XMTP network nodes.
- **Default Public Nodes**: By default, running `Client.create(signer, { env: "production" })` connects your users to XMTP's free, public network nodes. This is great for bootstrapping but is subject to global rate limits.
- **Alchemy / Infrastructure Providers**: As your extension scales to thousands of users, the free public nodes will rate-limit you. Alchemy provides dedicated, enterprise-grade **XMTP Network Endpoints**. 
  - *Recommendation*: During this implementation, we will configure the client to allow an environmental variable for the XMTP API Endpoint. We will start on the public `production` environment, but architecture will be in place so you can instantly switch to an Alchemy XMTP URL if/when you subscribe to one for high traffic scaling.

---

## 6. UI Implementation Details

### Footer Menu Updates
- Modify `footer-menu.component.html` and `.ts` to add a **Zelf Chat** entry directly beneath **Zelf Keys**.
- Use the translation key `{{ t("common.zelf_chat") }}`.
- Apply a minimalist SVG icon (e.g. a stylized chat bubble) that fits the existing Zelf visual identity.
- Add `navigateToZelfChat()` routing logic, mirroring `navigateToZelfKeys()`.

### Routing Structure
Add a child route to `app-routing.module.ts` under the authenticated path (guarded by `LoginGuard` and `ZelfWalletGuard`):

```ts
{
    path: "zelf-chat",
    loadComponent: () => import("./zelf-chat/zelf-chat.component").then((m) => m.ZelfChatComponent),
}
```

### Module Architecture
Create a new `src/app/zelf-chat/` feature component structure:
1. **`ZelfChatComponent`**: The master wrapper component.
2. **`ZelfChatListComponent`**: To display the user's active conversations.
3. **`ZelfChatConversationComponent`**: To display the chat interface against a specific target address.
4. **`ChatService`**: A service isolating the `@xmtp/xmtp-js` logic: `initClient()`, `getConversations()`, `streamMessages()`, `sendMessage()`.

---

## 6. Verification Plan

- Install dependencies and run `npm run watch`.
- Verify the Angular compiler and Webpack gracefully resolve XMTP.
- Verify the Footer Menu properly visualizes "Zelf Chat".
- Test the chat initialization flow: ensuring the Vault accurately prompts the user relying on the PGP/Biometrics dynamics, and strictly only when keys are genuinely needed.

---

## 7. Implementation Tasks (Agent Checklist)

This granular checklist is designed for an AI agent to execute sequentially or pick up task-by-task.

- [ ] **Phase 1: Environment & Setup**
  - [ ] Install `@xmtp/xmtp-js`, `@xmtp/content-type-remote-attachment`, and `@xmtp/frames-client`.
  - [ ] Run `npm run watch` to verify that the existing `crypto-browserify` and `stream-browserify` setups handle dependencies.

- [ ] **Phase 2: Footer UI Integration**
  - [ ] Edit `src/app/zelf-footer/footer-menu/footer-menu.component.html` and add a new menu item explicitly for "Zelf Chat". Place it directly under the "Zelf Keys" entry.
  - [ ] Ensure SVG and translation strings (`common.zelf_chat`) are correctly mapped.

- [ ] **Phase 3: Module & Routing Scaffolding**
  - [ ] Create the `src/app/zelf-chat` folder and map `{ path: "zelf-chat" }` in `app-routing.module.ts`.

- [ ] **Phase 4: XMTP Cryptography & Auth Logic**
  - [ ] Create `src/app/zelf-chat/chat.service.ts` injecting `VaultService`.
  - [ ] Trigger the generalized decryption flow to extract the Ethereum private key and initialize the `Client.create(signer)`.

- [ ] **Phase 5: Chat UI Construction & Rich Media**
  - [ ] Generate lists and chat windows.
  - [ ] Build the UI payload for reading/writing standard text messages.
  - [ ] **Rich Media Implementation**: Implement IPFS uploads using `ipfs.service.ts` and dispatch `RemoteAttachment` URIs over XMTP.
  - [ ] Attach `client.conversations.streamAllMessages()` to provide real-time updates.

- [ ] **Phase 6: In-Chat Payments & Mini-Apps**
  - [ ] Define custom Zelf content types: `PaymentRequestCodec` and `PaymentReceiptCodec`.
  - [ ] Build Angular components inside the chat view that render these codecs as stylized "Request" or "Receipt" cards.
  - [ ] Bind the 'Pay' button on a Request card to intercept the payload and trigger `this._router.navigate(['/send'], { queryParams: { returnToChat: targetAddress, amount: ... } })` with pre-filled parameters.
  - [ ] **UX Integration:** Modify the existing `/send-confirm`, `transaction-receipt`, and transaction error Angular components to accept the `returnToChat` parameter. If detected, inject a "Return to Chat" button as the primary call-to-action on the success/error screens.
  - [ ] Integrate `@xmtp/frames-client` logic inside the message parser to render standardized Open Frames mini-app URLs as interactive buttons (e.g. Kalshi, Uno).

- [ ] **Phase 7: Polish & Verification**
  - [ ] Test the Vault key access dynamically and re-run i18n synchronization.
  - [ ] Perform a full Mock Payment flow: Ensure clicking "Pay" in chat properly routes through Zelf's native sending interface, displays the custom "Return to Chat" button at the end, and correctly drops you back right into the specific peer's chat window.

---

## 8. AI-Assisted Implementation Estimations

Assuming this 7-phase plan is executed by modern AI Coding Agents (such as **Gemini 3.1 Pro**, **Claude 3.5 Sonnet**, or via **Cursor Composer 2**), here are the realistic time estimations. These estimates account for prompt crafting, context window loading, generating code, resolving typical Webpack/Angular compilation errors organically, and manual visual verifications.

*Traditional Engineering Sprint comparison: 2 to 3 weeks.*

| Phase | Description | AI Estimation | Primary Agent Complexity |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Setup & Polyfills | **~15 mins** | Low. Standard npm installs. The agent might need 1-2 loops if Webpack 5 complains about Node crypto modules. |
| **Phase 2** | Footer UI Integration | **~15 mins** | Low. HTML slicing, CSS adjustments, and straightforward Angular routing. |
| **Phase 3 & 4** | Scaffolding & Auth (Vault) | **~45 mins** | Medium. Requires the agent to deeply read `VaultService` constraints to properly execute key generation without locking the user out. |
| **Phase 5** | Chat UI & Remote Attachments | **~90 mins** | High. High layout volume (chat bubbles, lists, inputs), real-time RXJS subscriptions, and safely hooking into `ipfs.service.ts` for media uploads. |
| **Phase 6** | Payments, Custom Codecs & Open Frames | **~90 mins** | High. Creating custom classes for `PaymentRequestCodec`, updating the `/send` flow state parameters, and safely rendering Open Frame button blocks. |
| **Phase 7** | Polish & E2E Verification | **~30 mins** | Medium. Resolving lingering i18n variables, typescript strictness issues, and UX loop edge-cases. |

### Total AI Agent Execution Time: ~4 to 4.5 Hours
*Note: Using an autonomous agent pipeline (like Gemini 3.1 Pro) sequentially working through this checklist using direct repository access will vastly speed up the boring scaffolding. Cursor Composer 2 shines in Phase 5 and 6, where you can visually highlight the generated UI and fast-prompt specific CSS or component adjustments in real-time.*
