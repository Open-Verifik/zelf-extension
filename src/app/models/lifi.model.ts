export type LifiQuote = {
    id: string;
    type: string;
    tool: string;
    toolDetails: {
        key: string;
        logoURI: string;
        name: string;
    };
    action: {
        fromChainId: number;
        toChainId: number;
        fromToken: {
            address: string;
            symbol: string;
            decimals: number;
            chainId: number;
            name: string;
            coinKey: string;
            priceUSD: string;
            logoURI: string;
        };
        toToken: {
            name: string;
            symbol: string;
            coinKey: string;
            decimals: number;
            chainId: number;
            logoURI: string;
            address: string;
        };
        fromAmount: string;
        slippage: number;
        fromAddress: string;
        toAddress: string;
    };
    estimate: {
        fromAmount: string;
        toAmount: string;
        toAmountMin: string;
        approvalAddress: string;
        feeCosts: any[];
        gasCosts: Array<{
            type: string;
            price: string;
            estimate: string;
            limit: string;
            amount: string;
            amountUSD: string;
            token: {
                address: string;
                symbol: string;
                decimals: number;
                chainId: number;
                name: string;
                coinKey: string;
                priceUSD: string;
                logoURI: string;
            };
        }>;
        data: {
            fromToken: {
                name: string;
                address: string;
                symbol: string;
                decimals: number;
                logoURI: string;
            };
            toToken: {
                name: string;
                address: string;
                symbol: string;
                decimals: number;
                logoURI: string;
            };
            toTokenAmount: string;
            fromTokenAmount: string;
            protocols: Array<
                Array<
                    Array<{
                        name: string;
                        part: number;
                        fromTokenAddress: string;
                        toTokenAddress: string;
                    }>
                >
            >;
            estimatedGas: number;
        };
    };
    integrator: string;
    transactionRequest: {
        from: string;
        to: string;
        chainId: number;
        data: string;
        value: string;
        gasPrice: string;
        gasLimit: string;
    };
    includedSteps: Array<{
        id: string;
        type: string;
        tool: string;
        toolDetails: {
            key: string;
            logoURI: string;
            name: string;
        };
        action: {
            fromChainId: number;
            toChainId: number;
            fromToken: {
                address: string;
                symbol: string;
                decimals: number;
                chainId: number;
                name: string;
                coinKey: string;
                priceUSD: string;
                logoURI: string;
            };
            toToken: {
                name: string;
                symbol: string;
                coinKey: string;
                decimals: number;
                chainId: number;
                logoURI: string;
                address: string;
            };
            fromAmount: string;
            slippage: number;
            fromAddress: string;
            toAddress: string;
        };
        estimate: {
            fromAmount: string;
            toAmount: string;
            toAmountMin: string;
            approvalAddress: string;
            feeCosts: any[];
            gasCosts: Array<{
                type: string;
                price: string;
                estimate: string;
                limit: string;
                amount: string;
                amountUSD: string;
                token: {
                    address: string;
                    symbol: string;
                    decimals: number;
                    chainId: number;
                    name: string;
                    coinKey: string;
                    priceUSD: string;
                    logoURI: string;
                };
            }>;
            data: {
                fromToken: {
                    name: string;
                    address: string;
                    symbol: string;
                    decimals: number;
                    logoURI: string;
                };
                toToken: {
                    name: string;
                    address: string;
                    symbol: string;
                    decimals: number;
                    logoURI: string;
                };
                toTokenAmount: string;
                fromTokenAmount: string;
                protocols: Array<
                    Array<
                        Array<{
                            name: string;
                            part: number;
                            fromTokenAddress: string;
                            toTokenAddress: string;
                        }>
                    >
                >;
                estimatedGas: number;
            };
        };
    }>;
};
