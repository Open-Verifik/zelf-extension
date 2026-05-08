# Zelf ID: zkVM Identity & Biometric Wallet Recovery for PolkaVM

**Project name:** Zelf ID: zkVM Identity & Biometric Wallet Recovery for PolkaVM
**Website:** https://zelf.world (and https://zelf.world/zelf-wallet)
**Code repo:** https://github.com/Open-Verifik/verifik-wallet-extension (Open-Source repository integration)
**Documentation:** https://docs.zelf.world
**Kusama Receiver Wallet:** [INSERT KUSAMA WALLET HERE]
**Requested Amount:** 33,600 DOT (equivalent to ~$42,000 USD)
**Amount of Milestones:** 3 (one per calendar month of execution)
**Amount of total hours:** ~600 hours (12 Weeks total)
**Team & blended rate (LATAM):** A four-person **LATAM** core team so we can deliver **SFO/NYC-grade crypto UX at sustainable burn**: **1 mobile engineer**, **1 backend / browser-extension engineer** (Angular, `verifik-wallet-extension`, prover and chain hooks), **1 QA / tester** (E2E, integration, and regression for zkVM and PolkaVM paths), and **1 product / UX designer** (wallet recovery, governance, and compliance demo flows). **~$70.00 USD blended** across all four roles. **100% of the grant is contributor payroll (salary-only) for this delivery** — see _Funding Transparency_ below.
**Project contact email:** miguel@zelf.world

> **Reviewer note for the Kusama curator team:** The original draft of this proposal was denominated in DOT for parity with how the Polkadot Treasury historically pays cross-network bounties. We are happy to switch the denomination to **KSM** if Bounty #35 settles in KSM — please confirm preferred currency and we will re-quote at the same USD target (~$42,000 / $14,000 per milestone) with no change to scope.

---

## Summary of the Proposal
Zelf ID aims to bring decentralized, biometric-based Sybil resistance and zero-knowledge identity validation natively to Kusama and PolkaVM. Using **HumanAuthn** — a proprietary biometric-conditioned cryptography primitive that runs locally on edge devices or secure enclaves — we generate **Zelf ID** payloads off-chain (the same artifacts APIs return as `zelfProof`) and verify them inside an open-source Rust zkVM (SP1 / RISC Zero). **Off-chain,** that container is **variable-size** and can hold structured **public** and **private** JSON plus opaque bytes (including Kusama-compatible ZK material) encrypted under the face; **on-chain,** the result is a **Zelf ID Proof of Humanhood** delivered to PolkaVM as a compact **Groth16-wrapped** verification target (on the order of **~256 bytes** after compression) for ultra-fast, native RISC-V verification. Raw biometrics are never persisted as templates, and the chain verifies cryptographic outputs — not face images, feature vectors, or decrypted private metadata. This infrastructure unlocks Sybil-resistant OpenGov voting, compliance oracles for DeFi parachains, and seedless biometric wallet recovery via the Zelf Name Service (`.ksm`), cementing Kusama as the leader in privacy-preserving Web3 identity.

---

## Acknowledgments
By accepting funding from the Zero Knowledge and Advanced Cryptography Kusama Bounty, we agree to the following:
- We will receive a $DOT equivalent of the amount we requested on the payment date and will not request any top-ups if there is a price difference afterward.
- We will get paid for each milestone after each milestone is delivered.
- We will include "Funded / Secured / Supported by Kusama Network" in the final delivery on websites and in readme’s.
- All creative assets of our campaign will be licensed under a Creative Commons license, granting members of the Polkadot community the right to reuse and share contributions in future campaigns or promotional materials.
- **We are highly motivated to explore doing zk with Rust smart contracts over using solidity as the solidity > polkavm is a big overhead.** (Our architecture relies entirely on native Rust compilation to RISC-V, explicitly avoiding Ethereum virtual machines).
- All integrated code must be open source and publicly available.

---

## Context of the Proposal
The Kusama Network requires robust, privacy-preserving infrastructure for its parachains. The current Web3 landscape struggles with public voting (Sybil attacks and whales dominating OpenGov), impossible compliance (DeFi users refusing to doxx their wallets by uploading KYC directly to public chains), and poor UX (millions of dollars lost due to forgotten seed phrases). 

Traditional zero-knowledge solutions (like Circom) require rewriting logic into complex mathematical circuits which are prone to audits failures and are largely coupled to Ethereum architectures. With Kusama's transition to a native RISC-V environment (PolkaVM), there is a massive opportunity to deploy a modern *zkVM* approach. Zelf provides a highly-adopted biometric identity pipeline (HumanAuthn and Zelf Name Service). By wrapping **HumanAuthn's ephemeral-key reconstruction and Zelf ID decryption** inside an open-source SP1 Rust circuit, we can prove humanhood and identity attributes completely off-chain, then submit the resulting **Zelf ID Proof of Humanhood** artifact to PolkaVM for native execution, protecting the user's biometric data, decrypted metadata, and recovery secrets while preserving network integrity.

---

## Why Kusama, Why Now (and why we are committing exclusively)

Earlier in 2025 we shipped a parallel integration into another L1 ecosystem (BlockDAG) under the assumption that we would receive ecosystem co-marketing and curator endorsement once the work landed. That assumption did not hold — the integration shipped, the engineering was sound, but the ecosystem never publicly endorsed the work and we burned a quarter of runway with no compounding effect for either side. We learned an expensive but useful lesson: open-source biometric cryptography only compounds value when it is built on a chain whose stated values match the technology's values.

**Kusama is that chain, and PolkaVM is the right execution environment, for three concrete reasons:**

1. **PolkaVM's RISC-V transition is the first L1 environment where our SP1 / RISC Zero zkVM circuits can be verified natively, without forcing us through an EVM compatibility layer.** Every other "ZK-friendly" chain we have evaluated (Ethereum L2s, BlockDAG-class chains, Cosmos zk-rollups) requires a Solidity/Yul rewrite that voids the audit surface of the underlying SP1 circuit. Kusama lets us compile once, in Rust, and verify natively.
2. **The Kusama ZK Bounty's stated philosophy — "mathematical trust over institutional trust" (per the [KSM Privacy Bounty Q1 Report](https://forum.polkadot.network/t/the-ksm-privacy-bounty-initiative-q1-report/17418)) — is the exact thesis behind Zelf ID.** We do not store biometrics; we replace institutional KYC with a **Zelf ID Proof of Humanhood**, generated by **HumanAuthn** and verified in zero knowledge. There is no other treasury whose mandate matches our primitive this cleanly.
3. **OpenGov is the highest-profile public good in Web3 that demonstrably needs Sybil-resistant, anonymous voting.** Shipping Zelf ID into OpenGov is a marketing and product win for both sides simultaneously — Kusama gets the first credibly anonymous on-chain vote, Zelf gets the most credible reference deployment imaginable.

**We are not asking Kusama to bet on us. We are committing to bet on Kusama, exclusively, for the next phase of Zelf ID.** This is the only ZK identity grant we are pursuing in 2026, we are not running parallel grant applications in adjacent ecosystems. 

---

## Objective: How do we define success?

**Primary Objective:** 
Successfully deploy an end-to-end ZK Identity & Recovery stack for Kusama. This includes the open-source Rust zkVM circuit for verifying **Zelf ID** payloads off-chain, and the PolkaVM smart contracts / pallets required to verify the resulting **Zelf ID Proof of Humanhood** artifacts natively on Kusama. Finally, we will implement this into the consumer-facing Zelf Wallet Extension, allowing users to recover their `.ksm` domain wallets via biometric scanning using Zero-Knowledge.

### Success Metrics
Success will be defined by the following measurable outcomes:
1. **Core zkVM Infrastructure Delivery**
   - Provide an open-source SP1 (or RISC Zero) Rust circuit capable of verifying a **Zelf ID** (HumanAuthn) authentication payload — ECDSA secp256k1 plus biometric-conditioned entropy — without exposing the raw biometric data.
   - Deploy a PolkaVM validator pallet / contract on the Kusama testnet that successfully verifies the **Zelf ID Proof of Humanhood** artifact deterministically.
2. **Ecosystem Use Case Implementation (OpenGov & DeFi)**
   - Deliver a demonstrable Private Governance smart contract where a user submits a ZKP of humanity to cast an anonymous vote.
   - Deliver a Compliance Oracle contract enabling DeFi parachains to verify user jurisdiction/age without knowing their identity.
3. **Consumer Adoption & Wallet Recovery UX**
   - Successfully integrate the Biometric ZK Wallet Recovery flow natively into the open-source `verifik-wallet-extension`.
   - Ensure a user can input `[name].ksm`, perform an off-chain face scan, and recover the private keys via on-chain ZK verification in under 60 seconds.

### Quality Assurance
Quality assurance will include:
- End-to-end proof verification tests (spanning Mobile Edge generation to Pallet verification).
- Testnet validation before Kusama mainnet deployment.
- Internal security review of the smart contract adaptations targeting PolkaVM.
- Deterministic, reproducible builds (`flake.nix`-pinned SP1 toolchain so curators can rebuild the verifier image bit-for-bit).
- **Published PVM gas-benchmark report at Milestone 1 delivery** (target ≤ 8M PVM gas per verification), measured on Kusama testnet for both happy-path and adversarial inputs. Substrate / Polkadot precompiles for Keccak / Poseidon / BLS12-381 pairing are used wherever available to push efficiency.

---

## Description

**What is the goal?**
To build the foundational Zero-Knowledge identity and key-management layer for Kusama. Our work maps directly to the open RFPs published at [zk.kusama.vision/rfps](https://zk.kusama.vision/rfps/) and to the funding tracks highlighted by the bounty program:
- **Selective Disclosure & ZK Identity:** We deliver *Zero-knowledge identity proofs*, establish *Sybil resistance* for OpenGov, and generate temporary *ZK-sessions* for identity authentication.
- **ZK Execution Environments:** We specifically target *zkVM implementations* and perform *Off-chain computation with on-chain verification*.
- **Data Integrity Proofs:** We perform *Computation integrity checks* verifying the HumanAuthn payload correctness.
- **Proof-of-Personhood (cross-bounty alignment):** Milestone 3's anonymous-vote proxy is directly usable by the Kusama Proof-of-Personhood bounty as a reference Sybil-resistant primitive.

**Cryptographic stack (concrete):**
- **Core technology — HumanAuthn (the primitive that ships the Proof of Humanhood):** **HumanAuthn** is a biometric-conditioned cryptography primitive (ECDSA secp256k1 + high-entropy stored randomness) that runs locally on the user's device or in a secure enclave. Given a live face scan plus optional password, HumanAuthn derives an **ephemeral key** in real time and uses it to encrypt the action context (e.g. _"recover wallet `maria.ksm`"_) into a **Zelf ID** payload — a privacy-preserving, non-biometric structure (APIs expose the same material as `zelfProof`; Verifik docs call the same thing _HumanID_, and older Zelf product docs called it _ZelfProof_). **Size is not fixed:** [Zelf’s how-it-works documentation](https://docs.zelf.world/docs/getting-started/how-it-works) cites on the order of **~350 bytes** as a **typical lower bound** for the lean ZelfProof / identity payload, not a hard maximum; in real deployments the artifact is a **base64-encoded blob** whose length **grows with content** because we support flexible **JSON** in both **private `metadata`** (encrypted) and **public `publicData`**, so teams can carry whatever the product needs — including **opaque byte fields** for **Kusama-compatible verification material** (e.g. serialized ZK/SNARK outputs or other chain-ready proofs) **encrypted under the same HumanAuthn model**, without ever storing or transmitting raw biometrics. No biometric template, feature vector, or ephemeral key is ever stored or transmitted; authentication = the user's live face being able to regenerate the same ephemeral key and decrypt the Zelf ID.
- **zkVM circuit (Milestone 1) — the in-circuit Proof of Humanhood:** the **variable-size Zelf ID** (`zelfProof`) payload is consumed by an **SP1 RISC-V zkVM circuit** (RISC Zero is our fallback if the SP1 zkVM execution proof exceeds our PVM gas target). The circuit re-runs the HumanAuthn ephemeral-key reconstruction in-circuit and attempts decryption over the same fields the product uses (including private JSON / opaque metadata). **Successful in-circuit decryption is the Zelf ID Proof of Humanhood.** The SP1 circuit then emits its standard **zkVM execution envelope — a STARK on the order of ~250 KB** (not a fixed cap; measured in our benchmark report) that attests the in-circuit decryption succeeded honestly **without revealing biometric data, the ephemeral key, or the decrypted metadata** — which we wrap in a **Groth16 compression layer** to produce an on-chain artifact on the order of **~256 bytes** for PolkaVM submission. In other words: the *trust primitive* we ship Kusama is the **Zelf ID Proof of Humanhood**; the STARK is the cryptographic envelope SP1 uses to prove that primitive was honestly produced.
- **On-chain verifier (Milestone 1):** a PolkaVM ink! / Rust contract verifies the Groth16-wrapped **Zelf ID Proof of Humanhood** (i.e. the SP1 zkVM execution envelope) using Polkadot precompiles for Keccak / Poseidon / BLS12-381 pairing. **Target gas budget: ≤ 8M PVM gas per proof verification** — this is the metric the curators specifically called out as missing from earlier proposals (see the [research proposal forum thread](https://forum.polkadot.network/t/make-everything-totally-anonymous-a-research-proposal-for-kusama/17065)). Our final benchmark report will publish measured PVM gas for both happy-path and adversarial inputs.
- **Determinism guarantees:** the SP1 toolchain version, RISC-V target triple, and circuit hash are pinned in `flake.nix` so curators can reproduce the exact verifier image bit-for-bit.

### Privacy, biometrics, and modality

- **What we store:** the durable artifact is encrypted **Zelf ID** / `zelfProof` material plus high-entropy randomness. That artifact can contain public JSON, encrypted private JSON, and opaque chain-facing proof bytes.
- **What we do not store:** HumanAuthn does **not** store raw face images, biometric templates, feature vectors, or reusable private keys. The live biometric input is used during the session to regenerate ephemeral key material and is then discarded.
- **What Kusama verifies:** Kusama / PolkaVM sees a Groth16-wrapped proof artifact that attests the HumanAuthn / Zelf ID decryption succeeded inside the zkVM. It does **not** see a face, a template, a feature vector, or decrypted private metadata.
- **Face is the shipped modality, not a protocol prison:** this bounty scope uses face because that is the production HumanAuthn path we have built end-to-end (capture UX, optional liveness, mobile support, and QA). The architecture is biometric-conditioned key derivation plus entropy; other biometric modalities are possible future R&D, but they are not claimed as drop-in deliverables in this grant.
- **Defense in depth:** optional password protection can be layered on top of the live face scan for flows that require a second factor. This keeps HumanAuthn flexible without changing the core no-biometric-storage guarantee.
- **Auditable source of truth:** the HumanAuthn model is documented at [docs.verifik.co/biometrics/humanauthn](https://docs.verifik.co/biometrics/humanauthn/) for reviewers who want to verify the no-template / successful-decryption model directly.

**Target Audience:**
- **DeFi Users:** Requiring privacy-preserving compliance on ramps.
- **Consumer-facing dApps:** Needing frictionless, seed-phrase free onboarding via ZNS.
- **Builders:** Seeking privacy-preserving authentication primitives and OpenGov Sybil resistance.

**Scope of Work & Collaboration:**
- **External Companies/Assistance:** We are developing this entirely in-house as Open-Verifik. We require zero external development assistance to execute this roadmap.
- **Collaboration in the Ecosystem:** We operate independently but will openly collaborate with Polkadot/Kusama ecosystem developers building on PolkaVM to ensure our ZK Oracles are easily queryable. We will also publish in the `#kusama-zk:virto.community` Matrix space at each milestone for open curator review.
- **Scope:** The scope covers ZK circuit architecture (SP1 Rust), PolkaVM smart contract development (explicitly utilizing Polkadot precompiles for fast cryptography), **mobile** HumanAuthn / Zelf client flows, **browser-extension** (Angular) integration in the Zelf stack, **QA** for E2E and on-chain verification paths, and **product design** for the public demo surfaces.

**Overview & What this enables on Kusama:**
After completion, Kusama users and developers will be able to:
- Recover `.ksm` domain wallets via biometric ZK proofs without seed phrases.
- Participate anonymously but provably in OpenGov proposals.
- Integrate ZK-powered Sybil resistance natively into PolkaVM decentralized applications.
This reduces trust assumptions and fundamentally improves consumer composability within the ecosystem.

---

## Long-Term Vision
Our long-term vision is to position Zelf ID as the standard decentralized biometric oracle for the Polkadot and Kusama ecosystems. **This 12-week, $42,000 scope is the totality of our Kusama treasury ask in 2026** — we will not request any follow-up grant, top-up, or extension this year. If parachains adopt the oracle in production, we may revisit the Treasury in 2027 with a discrete SLA proposal to cover infrastructure and uptime guarantees, evaluated on its own merits at that time.

---

## Funding Transparency — How the 33,600 DOT is Spent

We are choosing to be radically transparent about where every DOT lands, because this proposal is structured as a **public-infrastructure grant, not a startup investment**.

| Category | Amount (USD) | Amount (DOT) | % of grant |
|---|---|---|---|
| Contributor payroll (4 roles — mobile, backend/extension, QA, design — 12 weeks, LATAM) | $42,000 | 33,600 | **100%** |
| Profit margin / company P&L | $0 | 0 | 0% |
| Subcontracting / agency overhead | $0 | 0 | 0% |
| Marketing / token activity | $0 | 0 | 0% |
| Infrastructure (testnet RPC, CI, IPFS) | $0 (absorbed by Verifik LLC) | 0 | 0% |

**Concretely:**
- We staff **entirely from Latin America** so the same **$14,000 / month** total team burn that would cover one senior US or Western European engineer can instead cover all four delivery roles: **mobile**, **backend + extension**, **QA**, and **design** — without cutting scope or quality. That regional efficiency is *why* the $42,000 / 12-week line item is defensible, not a discount on rigor.
- 12 weeks ÷ 4 weeks per milestone = **3 months** at **$14,000 / month** = **$42,000 = 33,600 DOT** (at the same $1.25/DOT ratio used in the original draft; we will re-quote at submission-day spot if requested).
- Each milestone payout (11,200 DOT / ~$14,000) corresponds to **exactly one calendar month of team payroll**, so the milestone structure is also our cash-flow structure.

**Why we are framing it this way:** Open-Verifik is not asking Kusama to fund growth — the consumer-facing Zelf product, the ZNS token pre-sale, and our partner integrations are funded independently. We are asking Kusama to fund the **execution cost** of porting open-source ZK identity infrastructure into PolkaVM, infrastructure that will remain MIT-licensed and free for every parachain to consume in perpetuity. This aligns with the curators' "strict funding philosophy" documented in the [KSM Privacy Bounty Q1 Report](https://forum.polkadot.network/t/the-ksm-privacy-bounty-initiative-q1-report/17418): paying execution cost for verifiable public goods, not subsidising consultancy margins.

If, after delivery, the curators evaluate the work and feel the salary-only framing was too generous or too austere, we are explicitly open to that conversation — we would rather ship the work and have an honest post-mortem than over-quote a private margin we cannot justify.

---

## Budget Breakdown and Milestones

**Amount of Milestones:** 3
**Total grant:** 33,600 DOT (~$42,000 USD)
**Cost per hour:** ~$70.00 USD blended across **all four roles** (mobile, backend/extension, QA, design) — feasible because the team is **LATAM**-based; the critical-path zkVM and PolkaVM work is still **senior** time, with QA and design preventing rework.
**Total hours:** ~600 over 12 weeks
**Per-milestone payout:** 11,200 DOT (~$14,000) = exactly one calendar month of **four-person** team payroll
**All code will be publicly available in this git repo:** https://github.com/Open-Verifik/verifik-wallet-extension

### Proposed Timeline
We estimate that it will take **12 weeks** to deliver all milestones — three discrete 4-week sprints, one per milestone. The original 9-week estimate was aspirational and assumed zero context-switching; the 12-week schedule is the realistic delivery window with built-in buffer for curator review feedback at each milestone gate. We will continue to leverage advanced LLM tooling (Claude Opus / Gemini Pro / Codex) for rapid boilerplate generation and circuit scaffolding, but the gating-path work (SP1 circuit correctness, PVM gas tuning, Groth16 wrapping) is human-driven cryptography work that does not compress.

### Milestone 1: Zelf ID Core zkVM Generation & PolkaVM Verifier
**Estimated delivery time for milestone 1:** 4 weeks  
**Amount of hours:** 200  
**FTE:** Four-person **LATAM** team; heaviest on **backend (zkVM, PolkaVM, contracts)** and **QA** (circuit/contract and testnet); **mobile** and **design** in support (prover wiring, spec alignment, early flows).  
**Cost of Milestone 1:** 11,200 DOT (~$14,000)

| Number | Name | Description | Hours |
|---|---|---|---|
| **0a** | Documentation | Public documentation and reproducible build guide (`flake.nix` pinned SP1 toolchain) for compiling the zkVM circuits and the PolkaVM verifier from scratch. | 18 |
| **0b** | License | All integrated Kusama/SP1 code shipped under MIT + Apache-2.0 dual license. | 2 |
| **0c** | Tests | Unit tests for the in-circuit HumanAuthn ephemeral-key reconstruction and Zelf ID decryption (ECDSA secp256k1 plus the entropy-mixing step), with differential tests against the off-circuit Verifik HumanAuthn reference implementation to prove circuit correctness. | 30 |
| **1** | zkVM Circuit (Off-chain) | Scaffold the off-chain **SP1 RISC-V zkVM circuit** that consumes the **variable-size Zelf ID** (`zelfProof`) payload produced by **HumanAuthn** (lean payloads start around **~350 bytes** as a reference minimum; real artifacts scale with public/private JSON and opaque metadata), re-runs the ephemeral-key reconstruction in-circuit, and verifies decryption. Successful in-circuit decryption is the **Zelf ID Proof of Humanhood**, emitted as an SP1 zkVM execution envelope (on the order of **~250 KB**) wrapped in a Groth16 layer (on-chain target on the order of **~256 bytes**). RISC Zero is held as a fallback if the SP1 envelope exceeds our PVM gas budget. | 75 |
| **2** | PolkaVM Verifier Contract (Precompiles) | Develop the natively optimized **RISC-V verifier ink!/Rust contract** for Kusama runtimes, **targeting ≤ 8M PVM gas per verification**. Uses Polkadot precompiles for Keccak / Poseidon / BLS12-381 pairing. Deliverable includes a published gas-benchmark report measured on Kusama testnet for both happy-path and adversarial inputs. | 75 |

### Milestone 2: ZNS Wallet Recovery Integration (Extension UX)
**Estimated delivery time for milestone 2:** 4 weeks  
**Amount of hours:** 200  
**FTE:** Four-person team; heaviest on **extension + mobile + design** (recovery UX end-to-end); **backend** for contract and prover integration; **QA** on **Playwright** and mobile regression.  
**Cost of Milestone 2:** 11,200 DOT (~$14,000)

| Number | Name | Description | Hours |
|---|---|---|---|
| **0a** | Documentation | UI/UX flow documentation for Extension developers, plus a public integration tutorial showing how any wallet (not just Zelf) can call the ZNS recovery contract. | 18 |
| **0b** | License | All code shipped is available publicly under MIT + Apache-2.0 dual license. | 2 |
| **0c** | Tests | E2E Playwright tests covering the full wallet recovery flow (`name.ksm` → face scan → on-chain ZK verification → key reassignment) under 60 seconds. | 30 |
| **1** | ZNS `.ksm` Smart Contract Logic | Map Zelf Name Service domains to Kusama wallets in PolkaVM contract state, utilizing the Milestone 1 verifier as a callable dependency. Includes a domain-collision policy and a revocation pathway for compromised proofs. | 75 |
| **2** | Wallet Extension UX Integration | Build the Angular UI flow inside [`verifik-wallet-extension`](https://github.com/Open-Verifik/verifik-wallet-extension): user inputs `maria.ksm`, performs a local / secure-enclave face scan, **HumanAuthn** produces the **Zelf ID** payload, the client routes it to the SP1 prover, submits the Groth16-wrapped proof to PolkaVM, and finalizes key reassignment in-extension. | 75 |

### Milestone 3: Sybil-Resistant Governance & Compliance Connectors
**Estimated delivery time for milestone 3:** 4 weeks  
**Amount of hours:** 200  
**FTE:** Full four-person team in parallel: **backend** (governance and oracle contracts), **extension + mobile** (demo and integration surfaces), **QA** (fuzzing, E2E, integration), **design** (developer-facing and governance demo polish).  
**Cost of Milestone 3:** 11,200 DOT (~$14,000)

> Note: Milestone 3 is also directly consumable by the **Kusama Proof-of-Personhood bounty** — the Private Vote Proxy contract is a reference Sybil-resistant primitive that any PoP project can embed without modification.

| Number | Name | Description | Hours |
|---|---|---|---|
| **0a** | Documentation | Integration tutorials for parachain developers to consume the Compliance Oracle and the Private Vote Proxy from their own runtimes; published to [docs.zelf.world](https://docs.zelf.world) under a Kusama-dedicated section. | 25 |
| **0b** | License | All code shipped is available publicly under MIT + Apache-2.0 dual license. | 2 |
| **0c** | Tests | Automated fuzzing and end-to-end integration tests over the RISC-V execution flows; includes a property-based test harness for the anonymous-vote nullifier set to prove uniqueness without linkability. | 38 |
| **1** | Private Vote Proxy Contract | Build the proxy PolkaVM contract that permits an anonymous user possessing a valid ZKP of unique humanity to cast votes in Kusama OpenGov **without revealing their identity**, using a nullifier scheme to prevent double-voting. | 67 |
| **2** | DeFi Compliance Oracle | Develop the queryable PolkaVM endpoint that lets DeFi parachains assert a user's ZK KYC status (jurisdiction / age / sanctions-list-clear) **without learning the user's identity**, using selective disclosure on the Milestone 1 **Zelf ID Proof of Humanhood** artifact. | 68 |

---

## Delivery
After each milestone, the team will record a video walking through the shipped features and demoing the milestone. This ensures ease of review for the Kusama curators.

**All code and delivery will be published here:**
https://github.com/Open-Verifik/verifik-wallet-extension

---

## Team

- **Registered Company or Individual:** [INSERT COMPANY/INDIVIDUAL INFO: e.g., Open-Verifik / Zelf, Registration Number, Address]
- **Team Members (all LATAM):** 
  - [INSERT NAME, Role: Mobile Engineer (Zelf / HumanAuthn client flows, iOS and/or Android as applicable), LinkedIn Profile]
  - [INSERT NAME, Role: Backend / Browser-Extension Engineer (Angular, `verifik-wallet-extension`, prover and PolkaVM hooks), LinkedIn Profile]
  - [INSERT NAME, Role: QA / Tester (E2E, integration, zkVM and on-chain paths), LinkedIn Profile]
  - [INSERT NAME, Role: Product / UX Designer (recovery, OpenGov, and compliance demo flows), LinkedIn Profile]
- **Previous Work & Portfolio:** 
  - Maintainers of the open-source [`verifik-wallet-extension`](https://github.com/Open-Verifik/verifik-wallet-extension) browser wallet (already shipped, in production).
  - Authors of the [Zelf ID](https://zelf.world) consumer product and the [Zelf Name Service](https://docs.zelf.world) infrastructure.
  - All source under the [`Open-Verifik`](https://github.com/Open-Verifik) GitHub organization, fully auditable today.

### Validated by the market (no toy project)

Zelf ID is not a research demo — it is shipped technology with publicly listed integration partners. **HumanAuthn** (the core biometric engine), **Zelf ID** (the identity credential it produces), and **ZNS** (the naming and routing layer that Milestone 2 plugs into) are all live and consumed by:

- **[Circle](https://www.circle.com)** — USDC issuer, integration around biometric wallet recovery flows
- **[Pinata](https://www.pinata.cloud)** — IPFS pinning provider, used as one of the storage layers for Zelf ID QR codes
- **[ID R&D](https://www.idrnd.ai)** — biometric liveness vendor, technology partner for the anti-spoofing layer
- **[Ar.io](https://ar.io)** — Arweave gateway, decentralized storage backend for encrypted **Zelf ID** material persistence
- **[OffChain Global](https://offchain.global)** & **OffChain**

(Logos and partner badges are publicly displayed at [zelf.world](https://zelf.world).)

### Independent funding posture (important for curators)

To make sure the curators have full context on our cap-table and product funding:

- **The ZNS token pre-sale is live and funded independently of this grant.** No part of the requested 33,600 DOT is used for token activity, market-making, or pre-sale liquidity.
- **The Zelf consumer wallet, marketing, and partner integrations are funded by Open-Verifik's own runway**, not by Kusama Treasury.
- **This grant exclusively funds contributor payroll** (the four roles above) for the PolkaVM-specific port — work that would not happen on this timeline without Kusama support, because our existing runway is allocated to the consumer product.

---

## Additional Information

- **Have you or any of your team mates received funding from Polkadot and/or Kusama before?**
  **No.** This is our first application to any Polkadot or Kusama treasury / bounty program. We have no prior or in-flight grants from the Web3 Foundation either.

- **Has your team applied to any of the other bounties on Kusama?**
  **No.** As stated in the _Why Kusama, Why Now_ section, this is the only ZK identity grant we are pursuing in 2026 across any ecosystem. We did complete one prior integration with the BlockDAG L1 ecosystem in 2025 — that work is shipped and open-source, but did not receive ecosystem endorsement, and we have publicly stepped back from active development in that ecosystem. We are happy to share that codebase with the curators on request as a reference for engineering quality.

- **Are you running parallel grant applications in adjacent ecosystems for the same scope?**
  **No.** No part of this scope is being pitched to Ethereum Foundation, Cosmos ICF, Solana Foundation, or any other treasury. Funding this work means funding it exclusively for Kusama.

*(Note: We intend to rigorously follow the suggested Kusama bounty guidelines, including the explicit use of Polkadot precompiles for hashing/pairing and a published PVM gas-benchmark report at Milestone 1 delivery, to ensure absolute efficiency in the PolkaVM environment.)*
