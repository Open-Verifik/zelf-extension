# Canton frontend foundation

## Scope in this PR

Canton Coin (`CC`) is represented in **Manage Networks** with its own icon and a capability gate. The network remains disabled and cannot be persisted as enabled until the shared backend can prove that the authenticated Zelf ID owns an onboarded Canton party.

This is deliberate: Canton is private and party-scoped. A Canton party is not a public-chain address that can be deterministically derived and queried like an Aptos, TON, or EVM address.

## Shared backend contract reviewed

The backend foundation in `Open-Verifik/zelf-online-version#95` defines protected status, holdings, transaction-history/detail, and transfer prepare/submit routes. The frontend must not enable wallet, receive, history, or send flows until all of these production prerequisites are available:

1. validator/provider and initial environment;
2. OAuth2/server configuration;
3. external-party onboarding and recovery;
4. durable authorization from the current Zelf ID/session to the Canton party;
5. reviewed client signing or delegation/preapproval model.

## Activation follow-up

Once backend exposes an authenticated capability/party bootstrap contract, replace `available: false` in `DEFAULT_NETWORK_CONFIGS` with the server-derived capability and then wire the authorized party into holdings, history, receive, transfer preparation, on-device signing, and submission.

No mnemonic, private key, fabricated party identifier, or cross-user private ledger data is introduced by this foundation.
