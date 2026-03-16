export type DappMessageType =
    | "DAPP_CONNECT"
    | "DAPP_DISCONNECT"
    | "DAPP_GET_ACCOUNTS"
    | "DAPP_SIGN_TRANSACTION"
    | "DAPP_SIGN_MESSAGE"
    | "DAPP_SEND_TRANSACTION"
    | "DAPP_SWITCH_CHAIN"
    | "DAPP_ADD_CHAIN"
    | "DAPP_CHAIN_ID"
    | "DAPP_REQUEST_ACCOUNTS"
    | "DAPP_APPROVAL_RESULT"
    | "DAPP_SIGNING_RESULT"
    | "DAPP_ACCOUNTS_CHANGED"
    | "DAPP_CHAIN_CHANGED"
    | "DAPP_PROVIDER_REQUEST"
    | "DAPP_PROVIDER_RESPONSE"
    | "DAPP_GET_PENDING"
    | "WC_SESSION_PROPOSAL"
    | "WC_SESSION_REQUEST"
    | "WC_SESSION_DELETE"
    | "WC_PAIR"
    | "WC_APPROVE_SESSION"
    | "WC_REJECT_SESSION"
    | "WC_APPROVE_REQUEST"
    | "WC_REJECT_REQUEST"
    | "WC_DISCONNECT"
    | "WC_GET_SESSIONS"
    | "WC_INIT"
    | "WC_READY"
    | "WC_EVENT"
    | "DAPP_CLEANUP_REQUESTS"
    | "DAPP_CANCEL_PENDING_FOR_ORIGIN"
    | "DAPP_FORCE_DISCONNECT_SITE"
    | "DAPP_FORCE_DISCONNECT_ALL";

export interface DappMessage {
    type: DappMessageType;
    payload?: any;
    requestId: string;
    origin?: string;
    tabId?: number;
    timestamp?: number;
}

export interface DappPermission {
    origin: string;
    accounts: string[];
    chainId: number;
    connectedAt: number;
    lastUsed: number;
}

export interface PendingDappRequest {
    id: string;
    type: DappMessageType;
    origin: string;
    tabId?: number;
    method: string;
    params?: any;
    chainId?: number;
    timestamp: number;
    timeoutMs: number;
    resolve?: (value: any) => void;
    reject?: (reason: any) => void;
}

export interface DappConnectionInfo {
    origin: string;
    name?: string;
    icon?: string;
    description?: string;
    url?: string;
    verifyStatus?: VerifyStatus;
}

export type VerifyStatus = "VALID" | "INVALID" | "UNKNOWN" | "THREAT";

export interface VerifyContext {
    verified: {
        origin: string;
        validation: VerifyStatus;
        verifyUrl: string;
        isScam?: boolean;
    };
}

export interface DappApprovalRequest {
    id: string;
    type: "connection" | "sign_transaction" | "sign_message" | "switch_chain";
    origin: string;
    dappInfo: DappConnectionInfo;
    chainId?: number;
    requestedChains?: number[];
    requestedMethods?: string[];
    transactionParams?: DappTransactionDetail;
    messageParams?: DappMessageDetail;
    verifyContext?: VerifyContext;
}

export interface DappTransactionDetail {
    from: string;
    to: string;
    value: string;
    data?: string;
    gasLimit?: string;
    gasPrice?: string;
    nonce?: number;
    chainId: number;
    network: string;
    decodedAction?: DecodedTransaction;
    estimatedGasFiat?: string;
}

export interface DappMessageDetail {
    method: string;
    message: string;
    decodedMessage?: string;
}

export interface DecodedTransaction {
    type:
        | "native_transfer"
        | "erc20_transfer"
        | "erc20_approve"
        | "erc721_transfer"
        | "erc721_approve_all"
        | "contract_interaction"
        | "swap"
        | "unknown";
    description: string;
    to?: string;
    amount?: string;
    tokenSymbol?: string;
    tokenAddress?: string;
    spender?: string;
    tokenId?: string;
    functionName?: string;
    srcToken?: string;
    dstToken?: string;
    srcTokenSymbol?: string;
    dstTokenSymbol?: string;
    amountIn?: string;
    amountOutMin?: string;
}

export interface ChainConfig {
    chainId: number;
    name: string;
    symbol: string;
    rpcUrl?: string;
    blockExplorer?: string;
    network: string;
}

export const SUPPORTED_CHAINS: ChainConfig[] = [
    { chainId: 1, name: "Ethereum", symbol: "ETH", network: "ethereum", blockExplorer: "https://etherscan.io" },
    { chainId: 42161, name: "Arbitrum One", symbol: "ETH", network: "arbitrum", blockExplorer: "https://arbiscan.io" },
    { chainId: 10, name: "Optimism", symbol: "ETH", network: "optimism", blockExplorer: "https://optimistic.etherscan.io" },
    { chainId: 8453, name: "Base", symbol: "ETH", network: "base", blockExplorer: "https://basescan.org" },
    { chainId: 43114, name: "Avalanche", symbol: "AVAX", network: "avalanche", blockExplorer: "https://avascan.info" },
    { chainId: 137, name: "Polygon", symbol: "POL", network: "polygon", blockExplorer: "https://polygonscan.com" },
    { chainId: 56, name: "BNB Chain", symbol: "BNB", network: "binance", blockExplorer: "https://bscscan.com" },
    { chainId: 1404, name: "BlockDAG", symbol: "BDAG", network: "blockdag", blockExplorer: "https://bdagscan.com" },
];

export function getChainConfig(chainId: number): ChainConfig | undefined {
    return SUPPORTED_CHAINS.find((c) => c.chainId === chainId);
}

export function isSupportedChain(chainId: number): boolean {
    return SUPPORTED_CHAINS.some((c) => c.chainId === chainId);
}

export function chainIdToHex(chainId: number): string {
    return `0x${chainId.toString(16)}`;
}

export function hexToChainId(hex: string): number {
    return parseInt(hex, 16);
}
