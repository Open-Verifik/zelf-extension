export interface Token {
    address: string;
    chainId: number;
    symbol: string;
    decimals: number;
    name: string;
    coinKey: string;
    logoURI: string;
    priceUSD: string;
}

export interface ToolDetails {
    key: string;
    name: string;
    logoURI: string;
}

export interface GasCost {
    type: string;
    price: string;
    estimate: string;
    limit: string;
    amount: string;
    amountUSD: string;
    token: Token;
}

export interface Action {
    fromToken: Token;
    fromAmount: string;
    toToken: Token;
    fromChainId: number;
    toChainId: number;
    slippage: number;
    fromAddress: string;
    toAddress: string;
}

export interface Estimate {
    tool: string;
    approvalAddress: string;
    toAmountMin: string;
    toAmount: string;
    fromAmount: string;
    feeCosts: any[];
    gasCosts: GasCost[];
    executionDuration: number;
    fromAmountUSD: string;
    toAmountUSD: string;
}

export interface IncludedStep {
    id: string;
    type: string;
    action: Action;
    estimate: Estimate;
    tool: string;
    toolDetails: ToolDetails;
}

export interface TransactionRequest {
    value: string;
    to: string;
    data: string;
    chainId: number;
    gasPrice: string;
    gasLimit: string;
    from: string;
}

export interface LifiQuote {
    type: string;
    id: string;
    tool: string;
    toolDetails: ToolDetails;
    action: Action;
    estimate: Estimate;
    includedSteps: IncludedStep[];
    integrator: string;
    transactionRequest: TransactionRequest;
}

export interface LifiToken {
    address: string;
    decimals: number;
    symbol: string;
    chainId: number;
    coinKey: string;
    name: string;
    logoURI: string;
    priceUSD: string;
}

export interface LifiTokensResponse {
    data: {
        tokens: {
            [chainId: string]: LifiToken[];
        };
    };
}
