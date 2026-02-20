/**
 * WalletConnect Offscreen Document
 *
 * Runs as a Chrome offscreen document to maintain persistent WebSocket
 * connections required by WalletConnect v2 (MV3 service workers go idle).
 *
 * Communicates with the background service worker via chrome.runtime messaging.
 */

import { Core } from "@walletconnect/core";
import { Web3Wallet, IWeb3Wallet } from "@walletconnect/web3wallet";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";

const WC_PROJECT_ID = "YOUR_WALLETCONNECT_PROJECT_ID"; // Replace with actual project ID from cloud.walletconnect.com

const SUPPORTED_CHAINS = ["eip155:1", "eip155:43114", "eip155:137", "eip155:56", "eip155:1404"];
const SUPPORTED_METHODS = [
    "eth_sendTransaction",
    "eth_signTransaction",
    "personal_sign",
    "eth_sign",
    "eth_signTypedData",
    "eth_signTypedData_v3",
    "eth_signTypedData_v4",
    "wallet_switchEthereumChain",
    "wallet_addEthereumChain",
];
const SUPPORTED_EVENTS = ["chainChanged", "accountsChanged"];

let web3wallet: IWeb3Wallet | null = null;
let isInitializing = false;

async function initializeWalletConnect(): Promise<void> {
    if (web3wallet || isInitializing) return;

    isInitializing = true;

    try {
        const core = new Core({
            projectId: WC_PROJECT_ID,
        });

        web3wallet = await Web3Wallet.init({
            core,
            metadata: {
                name: "Zelf Wallet",
                description: "Biometric-secured wallet with face authentication",
                url: "https://zelf.world",
                icons: ["https://zelf.world/icon.png"],
            },
        });

        setupEventListeners();
        await restoreSessions();

        chrome.runtime.sendMessage({ type: "WC_READY", payload: { success: true } });
    } catch (error) {
        console.error("WalletConnect initialization failed:", error);
        chrome.runtime.sendMessage({ type: "WC_READY", payload: { success: false, error: (error as Error).message } });
    } finally {
        isInitializing = false;
    }
}

function setupEventListeners(): void {
    if (!web3wallet) return;

    web3wallet.on("session_proposal", async (proposal) => {
        const verifyContext = (proposal as any).verifyContext || null;

        chrome.runtime.sendMessage({
            type: "WC_SESSION_PROPOSAL",
            payload: {
                id: proposal.id,
                params: proposal.params,
                verifyContext,
            },
        });

        persistSessions();
    });

    web3wallet.on("session_request", async (event) => {
        const { id, topic, params } = event;
        const verifyContext = (event as any).verifyContext || null;

        const session = web3wallet!.engine.signClient.session.get(topic);

        chrome.runtime.sendMessage({
            type: "WC_SESSION_REQUEST",
            payload: {
                id,
                topic,
                params,
                verifyContext,
                peerMeta: session?.peer?.metadata || null,
            },
        });
    });

    web3wallet.on("session_delete", async (event) => {
        chrome.runtime.sendMessage({
            type: "WC_SESSION_DELETE",
            payload: { topic: event.topic },
        });

        persistSessions();
    });
}

async function persistSessions(): Promise<void> {
    if (!web3wallet) return;

    try {
        const sessions = web3wallet.getActiveSessions();
        const pairings = web3wallet.core.pairing.getPairings();

        await chrome.storage.local.set({
            wc_sessions: JSON.stringify(sessions),
            wc_pairings: JSON.stringify(pairings),
        });
    } catch (error) {
        console.error("Failed to persist WC sessions:", error);
    }
}

async function restoreSessions(): Promise<void> {
    // Web3Wallet SDK handles session restoration internally via its storage
    // Just ensure the relayer is connected
    try {
        if (web3wallet?.core?.relayer) {
            await web3wallet.core.relayer.connect();
        }
    } catch (error) {
        console.error("Failed to restore WC sessions:", error);
    }
}

async function handlePair(uri: string): Promise<void> {
    if (!web3wallet) {
        await initializeWalletConnect();
    }

    try {
        await web3wallet!.pair({ uri });
    } catch (error) {
        console.error("WC pairing failed:", error);
        throw error;
    }
}

async function handleApproveSession(proposalId: number, accounts: string[]): Promise<any> {
    if (!web3wallet) throw new Error("WalletConnect not initialized");

    const proposal = web3wallet.engine.signClient.proposal.get(proposalId);

    const namespaces = buildApprovedNamespaces({
        proposal: proposal,
        supportedNamespaces: {
            eip155: {
                chains: SUPPORTED_CHAINS,
                methods: SUPPORTED_METHODS,
                events: SUPPORTED_EVENTS,
                accounts: SUPPORTED_CHAINS.flatMap((chain) => accounts.map((addr) => `${chain}:${addr}`)),
            },
        },
    });

    const session = await web3wallet.approveSession({
        id: proposalId,
        namespaces,
    });

    await persistSessions();

    return session;
}

async function handleRejectSession(proposalId: number): Promise<void> {
    if (!web3wallet) return;

    await web3wallet.rejectSession({
        id: proposalId,
        reason: getSdkError("USER_REJECTED"),
    });
}

async function handleApproveRequest(topic: string, requestId: number, result: any): Promise<void> {
    if (!web3wallet) return;

    await web3wallet.respondSessionRequest({
        topic,
        response: {
            id: requestId,
            jsonrpc: "2.0",
            result,
        },
    });
}

async function handleRejectRequest(topic: string, requestId: number): Promise<void> {
    if (!web3wallet) return;

    await web3wallet.respondSessionRequest({
        topic,
        response: {
            id: requestId,
            jsonrpc: "2.0",
            error: getSdkError("USER_REJECTED"),
        },
    });
}

async function handleDisconnect(topic: string): Promise<void> {
    if (!web3wallet) return;

    await web3wallet.disconnectSession({
        topic,
        reason: getSdkError("USER_DISCONNECTED"),
    });

    await persistSessions();
}

function getActiveSessions(): any {
    if (!web3wallet) return {};
    return web3wallet.getActiveSessions();
}

async function emitSessionEvent(topic: string, event: string, data: any, chainId: string): Promise<void> {
    if (!web3wallet) return;

    await web3wallet.emitSessionEvent({
        topic,
        event: { name: event, data },
        chainId,
    });
}

// Listen for messages from the background service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { type, payload } = message;

    const handleAsync = async () => {
        try {
            switch (type) {
                case "WC_INIT":
                    await initializeWalletConnect();
                    sendResponse({ success: true });
                    break;

                case "WC_PAIR":
                    await handlePair(payload.uri);
                    sendResponse({ success: true });
                    break;

                case "WC_APPROVE_SESSION":
                    const session = await handleApproveSession(payload.proposalId, payload.accounts);
                    sendResponse({ success: true, data: session });
                    break;

                case "WC_REJECT_SESSION":
                    await handleRejectSession(payload.proposalId);
                    sendResponse({ success: true });
                    break;

                case "WC_APPROVE_REQUEST":
                    await handleApproveRequest(payload.topic, payload.requestId, payload.result);
                    sendResponse({ success: true });
                    break;

                case "WC_REJECT_REQUEST":
                    await handleRejectRequest(payload.topic, payload.requestId);
                    sendResponse({ success: true });
                    break;

                case "WC_DISCONNECT":
                    await handleDisconnect(payload.topic);
                    sendResponse({ success: true });
                    break;

                case "WC_GET_SESSIONS":
                    const sessions = getActiveSessions();
                    sendResponse({ success: true, data: sessions });
                    break;

                case "WC_EVENT":
                    await emitSessionEvent(payload.topic, payload.event, payload.data, payload.chainId);
                    sendResponse({ success: true });
                    break;

                default:
                    sendResponse({ success: false, error: `Unknown WC message type: ${type}` });
            }
        } catch (error) {
            sendResponse({ success: false, error: (error as Error).message });
        }
    };

    handleAsync();
    return true;
});

// Auto-initialize on load
initializeWalletConnect();
