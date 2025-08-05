export interface TransactionFeeEstimate {
    fee: number;
    fiatFee: number;
    total: number;
    networkPrice?: number;
}

export interface FeeCalculationParams {
    network: string;
    receiverAddress: string;
    amount: number;
    tokenType: string;
    tokenAddress?: string;
    tokenDecimals?: number;
    tokenPrice?: number;
    selectedFeeRate?: number;
    senderAddress?: string;
}

export interface TransactionParams {
    from: string;
    to: string;
    value: string;
    network: string;
    data?: string;
    chainId?: number;
    privateKey?: string;
    mnemonic?: string;
    tokenAddress?: string;
    tokenDecimals?: number;
}

export interface TransactionResult {
    hash: string;
    status?: string;
}
