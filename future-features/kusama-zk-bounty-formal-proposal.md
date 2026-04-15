# Zelf ID: zkVM Identity & Biometric Wallet Recovery for PolkaVM

**Project name:** Zelf ID: zkVM Identity & Biometric Wallet Recovery for PolkaVM
**Website:** https://zelf.world (and https://zelf.world/zelf-wallet)
**Code repo:** https://github.com/Open-Verifik/verifik-wallet-extension (Open-Source repository integration)
**Documentation:** https://docs.zelf.world
**Kusama Receiver Wallet:** [INSERT KUSAMA WALLET HERE]
**Requested Amount:** 24,000 DOT (equivalent to ~$30,000 USD)
**Amount of Milestones:** 3
**Amount of total hours:** ~360 hours (9 Weeks total)
**Project contact email:** [INSERT PROJECT EMAIL HERE]

---

## Summary of the Proposal
Zelf ID aims to bring decentralized, biometric-based Sybil resistance and zero-knowledge identity validation natively to Kusama and PolkaVM. Using HumanAuthn—a proprietary biometric engine that runs locally on edge devices or secure enclaves—we generate off-chain cryptographic payloads that are verified in an open-source Rust zkVM (SP1/RISC Zero). This produces a STARK proof that is submitted to Kusama's brand new PolkaVM for ultra-fast, native RISC-V verification. This infrastructure unlocks Sybil-resistant OpenGov voting, compliance oracles for DeFi parachains, and seedless biometric wallet recovery via the Zelf Name Service (.ksm), cementing Kusama as the leader in privacy-preserving Web3 identity.

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

Traditional zero-knowledge solutions (like Circom) require rewriting logic into complex mathematical circuits which are prone to audits failures and are largely coupled to Ethereum architectures. With Kusama's transition to a native RISC-V environment (PolkaVM), there is a massive opportunity to deploy a modern *zkVM* approach. Zelf provides a highly-adopted biometric identity pipeline (HumanAuthn and Zelf Name Service). By wrapping our cryptographic signature verification into an open-source SP1 Rust circuit, we can verify humanity and identity attributes completely off-chain, and submit the resulting ZK Proof to PolkaVM for native execution, completely protecting the user's data while ensuring network integrity.

---

## Objective: How do we define success?

**Primary Objective:** 
Successfully deploy an end-to-end ZK Identity & Recovery stack for Kusama. This includes the open-source Rust zkVM circuit for verifying Zelf identities off-chain, and the PolkaVM smart contracts/pallets required to verify these STARK proofs natively on Kusama. Finally, we will implement this into the consumer-facing Zelf Wallet Extension, allowing users to recover their `.ksm` domain wallets via biometric scanning using Zero-Knowledge.

### Success Metrics
Success will be defined by the following measurable outcomes:
1. **Core zkVM Infrastructure Delivery**
   - Provide an open-source SP1 (or RISC Zero) Rust circuit capable of verifying a Zelf Ed25519 authentication payload without exposing the raw biometric data.
   - Deploy a PolkaVM validator pallet/contract on the Kusama testnet that successfully verifies the STARK proof deterministically.
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
- Deterministic deployment scripts.
- *Correctness, compatibility, and reproducibility define success (not gas benchmarks, as verification cost depends on blueprint complexity, but we will utilize Substrate precompiles extensively to push efficiency).*

---

## Description

**What is the goal?**
To build the foundational Zero-Knowledge identity and key-management layer for Kusama. Our work maps directly to the specific funding tracks highlighted by the bounty program:
- **Selective Disclosure & ZK Identity:** We deliver *Zero-knowledge identity proofs*, establish *Sybil resistance* for OpenGov, and generate temporary *ZK-sessions* for identity authentication.
- **ZK Execution Environments:** We specifically target *zkVM implementations* and perform *Off-chain computation with on-chain verification*.
- **Data Integrity Proofs:** We perform *Computation integrity checks* verifying the HumanAuthn payload correctness.

**Target Audience:**
- **DeFi Users:** Requiring privacy-preserving compliance on ramps.
- **Consumer-facing dApps:** Needing frictionless, seed-phrase free onboarding via ZNS.
- **Builders:** Seeking privacy-preserving authentication primitives and OpenGov Sybil resistance.

**Scope of Work & Collaboration:**
- **External Companies/Assistance:** We are developing this entirely in-house as Open-Verifik. We require zero external development assistance to execute this roadmap.
- **Collaboration in the Ecosystem:** We operate independently but will openly collaborate with Polkadot/Kusama ecosystem developers building on PolkaVM to ensure our ZK Oracles are easily queryable.
- **Scope:** The scope covers ZK circuit architecture (SP1 Rust), PolkaVM smart contract development (explicitly utilizing Polkadot precompiles for fast cryptography), and Angular UI integration within the Zelf Extension.

**Overview & What this enables on Kusama:**
After completion, Kusama users and developers will be able to:
- Recover `.ksm` domain wallets via biometric ZK proofs without seed phrases.
- Participate anonymously but provably in OpenGov proposals.
- Integrate ZK-powered Sybil resistance natively into PolkaVM decentralized applications.
This reduces trust assumptions and fundamentally improves consumer composability within the ecosystem.

---

## Long-Term Vision
Our long-term vision is to position Zelf ID as the standard decentralized biometric oracle for the Polkadot and Kusama ecosystems. By keeping the grant request aggressively low ($30k total), we provide Kusama with a high-ROI open-source integration. Once parachains implement this technology, Zelf intends to propose a Yearly Service Level Agreement (SLA) / Enterprise License to the Treasury to maintain the high-availability API infrastructure, cover computation costs for edge/enclave biometric processing, and guarantee enterprise-grade uptime for the underlying identity matrix.

---

## Budget Breakdown and Milestones

**Amount of Milestones:** 3
**Cost per hour:** ~$83.00 USD (Blended rate for advanced ZK cryptography, Rust compiling, and Frontend UI implementation)
**All code will be publicly available in this git repo:** https://github.com/Open-Verifik/verifik-wallet-extension

### Proposed Timeline
We estimate that it will take **9 weeks** to deliver all milestones, greatly accelerated utilizing advanced LLM tooling (Claude Opus / Gemini Pro) for rapid boilerplate generation and circuit scaffolding.

### Milestone 1: Zelf ID Core zkVM Generation & PolkaVM Verifier
**Estimated delivery time for milestone 1:** 3 weeks  
**Amount of hours:** 120  
**FTE:** 1.5  
**Cost of Milestone 1:** 8,000 DOT (~$10,000)

| Number | Name | Description | Hours |
|---|---|---|---|
| **0a** | Documentation | Public documentation and how-tos for compiling the zkVM circuits. | 10 |
| **0b** | License | All integrated Kusama/SP1 code shipped under open source licenses. | 2 |
| **0c** | Tests | Unit tests for Zelf signature validation inside the SP1 zkVM. | 18 |
| **1** | zkVM Circuit Generation (Off-chain) | Scaffold the off-chain SP1 (RISC-V) zero-knowledge circuit that takes HumanAuthn success payloads and strictly verifies the Zelf cryptographic signature. | 45 |
| **2** | PolkaVM Verifier Pallet (Precompiles) | Develop the natively optimized RISC-V verifier smart contract for Kusama runtimes. We will explicitly utilize Polkadot smart contract precompiles for hashing and standard cryptography to guarantee low execution overhead when verifying the STARK proof on-chain. | 45 |

### Milestone 2: ZNS Wallet Recovery Integration (Extension UX)
**Estimated delivery time for milestone 2:** 3 weeks  
**Amount of hours:** 120  
**FTE:** 1.5  
**Cost of Milestone 2:** 8,000 DOT (~$10,000)

| Number | Name | Description | Hours |
|---|---|---|---|
| **0a** | Documentation | UI/UX flow documentation for Extension developers. | 10 |
| **0b** | License | All code shipped is available publicly under open-source license. | 2 |
| **0c** | Tests | E2E Playwright tests covering the wallet recovery logic. | 18 |
| **1** | ZNS `.ksm` Smart Contract Logic | Map Zelf Name Service domains logically to Kusama wallets in the contract state, utilizing the Milestone 1 verifier for validation. | 45 |
| **2** | Wallet Extension UX Integration | Build the Angular UI flow inside `verifik-wallet-extension`: User inputs `maria.ksm`, performs local/secure enclave face scan, routes payload to SP1, and finalizes key reassignment. | 45 |

### Milestone 3: Sybil-Resistant Governance & Compliance Connectors
**Estimated delivery time for milestone 3:** 3 weeks  
**Amount of hours:** 120  
**FTE:** 1.5  
**Cost of Milestone 3:** 8,000 DOT (~$10,000)

| Number | Name | Description | Hours |
|---|---|---|---|
| **0a** | Documentation | Integration tutorials for Parachain developers to utilize the Compliance Oracle and OpenGov pallets. | 15 |
| **0b** | License | All code shipped is available publicly under open-source license. | 2 |
| **0c** | Tests | Automated fuzzing and end-to-end integration tests over the Risc-V execution flows. | 23 |
| **1** | Private Vote Proxy Contract | Build the proxy contract that permits an anonymous user possessing a valid ZKP (Proof of Unique Human) to cast votes in Kusama OpenGov without revealing their identity. | 40 |
| **2** | DeFi Compliance Oracle | Develop the queryable endpoint for DeFi parachains to assert a user's ZK KYC status securely and autonomously. | 40 |

---

## Delivery
After each milestone, the team will record a video walking through the shipped features and demoing the milestone. This ensures ease of review for the Kusama curators.

**All code and delivery will be published here:**
https://github.com/Open-Verifik/verifik-wallet-extension

---

## Team

- **Registered Company or Individual:** [INSERT COMPANY/INDIVIDUAL INFO: e.g., Open-Verifik / Zelf, Registration Number, Address]
- **Team Members:** 
  - [INSERT NAME, Role: Lead Cryptography / zkVM Engineer, LinkedIn Profile]
  - [INSERT NAME, Role: Frontend / Extension Developer (Angular), LinkedIn Profile]
- **Previous Work & Portfolio:** 
  - Maintainers of the fast-growing Zelf ID ecosystem and the open-source Verifik Wallet Extension.
  - [Add links to other relevant Web3 repos or past successful bounty programs]

---

## Additional Information

- **Have you or any of your team mates received funding from Polkadot and/or Kusama before?**
  [YES/NO - Insert explanation if yes]

- **Has your team applied to any of the other bounties on Kusama?**
  [YES/NO - Insert explanation if yes]

*(Note: We intend to rigorously follow the suggested Kusama bounty guidelines, including exploring the use of precompiles where applicable to ensure absolute efficiency in the PolkaVM environment).*
