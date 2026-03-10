import { ethers } from "ethers";
import { Injectable } from "@angular/core";

import { DecodedTransaction } from "@shared/types/dapp.types";

const ERC20_SIGNATURES: Record<string, { name: string; inputs: string[] }> = {
    "0xa9059cbb": { name: "transfer", inputs: ["address", "uint256"] },
    "0x095ea7b3": { name: "approve", inputs: ["address", "uint256"] },
    "0x23b872dd": { name: "transferFrom", inputs: ["address", "address", "uint256"] },
};

const ERC721_SIGNATURES: Record<string, { name: string; inputs: string[] }> = {
    "0x42842e0e": { name: "safeTransferFrom", inputs: ["address", "address", "uint256"] },
    "0x23b872dd": { name: "transferFrom", inputs: ["address", "address", "uint256"] },
    "0xa22cb465": { name: "setApprovalForAll", inputs: ["address", "bool"] },
    "0x095ea7b3": { name: "approve", inputs: ["address", "uint256"] },
};

// Known DEX swap selectors -- when we can't decode full args we still show
// a meaningful protocol name and action rather than raw hex
const DEX_SWAP_SELECTORS: Record<string, { protocol: string; action: string; srcOffset?: number; dstOffset?: number }> = {
    // Uniswap V2 / forks (Pangolin, Trader Joe V1, Sushi)
    "0x38ed1739": { protocol: "Uniswap V2", action: "Swap exact tokens for tokens" },
    "0x7ff36ab5": { protocol: "Uniswap V2", action: "Swap ETH for exact tokens" },
    "0x18cbafe5": { protocol: "Uniswap V2", action: "Swap exact tokens for ETH" },
    "0x8803dbee": { protocol: "Uniswap V2", action: "Swap tokens for exact tokens" },
    "0x4a25d94a": { protocol: "Uniswap V2", action: "Swap tokens for exact ETH" },
    "0x02751cec": { protocol: "Uniswap V2", action: "Swap ETH for tokens" },
    "0xfb3bdb41": { protocol: "Uniswap V2", action: "Swap ETH for exact tokens" },
    // Uniswap V3
    "0x414bf389": { protocol: "Uniswap V3", action: "Swap (exact input single hop)" },
    "0xc04b8d59": { protocol: "Uniswap V3", action: "Swap (exact input multi-hop)" },
    "0xdb3e2198": { protocol: "Uniswap V3", action: "Swap (exact output single hop)" },
    "0xf28c0498": { protocol: "Uniswap V3", action: "Swap (exact output multi-hop)" },
    "0xac9650d8": { protocol: "Uniswap V3", action: "Token swap (multicall)" },
    "0x5ae401dc": { protocol: "Uniswap V3", action: "Token swap (multicall)" },
    "0x1f0464d1": { protocol: "Uniswap V3", action: "Token swap (multicall)" },
    // KyberSwap
    "0xef2ba631": { protocol: "KyberSwap", action: "Token swap", srcOffset: 1, dstOffset: 2 },
    "0xe21fd0e9": { protocol: "KyberSwap", action: "Token swap", srcOffset: 1, dstOffset: 2 },
    "0x7f2e2eed": { protocol: "KyberSwap", action: "Token swap", srcOffset: 1, dstOffset: 2 },
    "0xaf7a5143": { protocol: "KyberSwap", action: "Token swap (aggregated)" },
    // 1inch
    "0x12aa3caf": { protocol: "1inch", action: "Token swap", srcOffset: 1, dstOffset: 2 },
    "0xe449022e": { protocol: "1inch", action: "Token swap via Uniswap V3", srcOffset: 1, dstOffset: 2 },
    "0x0502b1c5": { protocol: "1inch", action: "Token swap via Uniswap", srcOffset: 1, dstOffset: 2 },
    "0x2e95b6c8": { protocol: "1inch", action: "Token swap", srcOffset: 1, dstOffset: 2 },
    // Trader Joe V2 (Avalanche)
    "0x9a5f6c15": { protocol: "Trader Joe", action: "Token swap" },
    "0x65b9ef95": { protocol: "Trader Joe", action: "Swap exact tokens for tokens" },
    // ParaSwap
    "0x54e3f31b": { protocol: "ParaSwap", action: "Token swap" },
    "0xa94e78ef": { protocol: "ParaSwap", action: "Token swap" },
    // Curve
    "0x3df02124": { protocol: "Curve", action: "Token swap" },
    "0xa6417ed6": { protocol: "Curve", action: "Token swap" },
    // Generic wrappers
    "0xd0e30db0": { protocol: "WETH", action: "Wrap ETH" },
    "0x2e1a7d4d": { protocol: "WETH", action: "Unwrap to ETH" },
};

// Known top tokens mapping to symbols (primarily Avalanche C-Chain & mainnet)
const KNOWN_TOKENS: Record<string, string> = {
    // Avalanche
    "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e": "USDC",
    "0xa7d7079b0fe9d780e1444d31013ca0121172da0c": "USDC.e",
    "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7": "USDT",
    "0xc7198437980c041c805a1edcba50c1ce5db95118": "USDT.e",
    "0xd586e7f844cea2f87f50152665bcbc2c279d8d70": "DAI.e",
    "0x50b7545627a5162f802cb59afbc5e0d4c88ce8cd": "BTC.b",
    "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7": "WAVAX",
    "0x152b9d0fdc40c096757f570a51e494bd4b943e50": "BTC.b",
    "0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab": "WETH.e",
    "0x120ad3e5a7c7963d8df5a11da06a246835de6987": "SAVAX",
    "0xd00ae08403b9bbb9124bb305c09058e32c39a48c": "JOE",
    // Base/Mainnet/Arbitrum common
    "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913": "USDC (Base)",
    "0xaf88d065e77c8cc2239327c5edb3a432268e5831": "USDC (Arb)",
    "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": "WBTC (Mainnet)",
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "USDC (Mainnet)",
    "0xdac17f958d2ee523a2206206994597c13d831ec7": "USDT (Mainnet)",
    
    // Identity/Native representations
    "0x0000000000000000000000000000000000000000": "AVAX",
    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": "AVAX"
};

const KNOWN_FUNCTION_FRAGMENTS = [
    "function transfer(address to, uint256 amount)",
    "function approve(address spender, uint256 amount)",
    "function transferFrom(address from, address to, uint256 amount)",
    "function safeTransferFrom(address from, address to, uint256 tokenId)",
    "function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)",
    "function setApprovalForAll(address operator, bool approved)",
    "function mint(address to, string uri)",
    "function batchMint(address to, string[] uris)",
    "function listItem(address nftAddress, uint256 tokenId, uint256 price)",
    "function buyItem(address nftAddress, uint256 tokenId)",
    "function makeOffer(address nftAddress, uint256 tokenId)",
    "function acceptOffer(address nftAddress, uint256 tokenId, address offerer)",
    "function cancelListing(address nftAddress, uint256 tokenId)",
    "function createCollection(string name, string symbol, uint256 maxSupply)",
    // Uniswap V2 style
    "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)",
    "function swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)",
    "function swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)",
    "function swapTokensForExactTokens(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline)",
    // Uniswap V3 style (struct as tuple)
    "function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96) params) returns (uint256 amountOut)",
    "function exactInput(tuple(bytes path, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum) params) returns (uint256 amountOut)",
    // Aggregators (Kyber, 1inch)
    "function swap(tuple(address srcToken, address dstToken, address[] srcReceivers, uint256[] srcAmounts, address[] feeReceivers, uint256[] feeAmounts, address feeToken, uint256 amount, uint256 minReturnAmount, uint256 flags, bytes permit) desc, bytes callData)",
    "function swap(address caller, tuple(address srcToken, address dstToken, address srcReceiver, address dstReceiver, uint256 amount, uint256 minReturnAmount, uint256 flags) desc, bytes permit, bytes data)",
    "function multicall(bytes[] data)",
];

@Injectable({
    providedIn: "root",
})
export class TxDecoderService {
    private _iface: ethers.Interface;

    constructor() {
        this._iface = new ethers.Interface(KNOWN_FUNCTION_FRAGMENTS);
    }

    decode(to: string, data: string | undefined, value: string | undefined): DecodedTransaction {
        if (!data || data === "0x" || data.length < 10) {
            return this._decodeNativeTransfer(to, value);
        }

        const selector = data.slice(0, 10).toLowerCase();

        try {
            const parsed = this._iface.parseTransaction({ data, value: value || "0" });

            if (parsed) {
                return this._formatParsedTransaction(parsed, to, value);
            }
        } catch {
            // Fall through to signature-based matching
        }

        return this._decodeBySelector(selector, data, to, value);
    }

    private _decodeNativeTransfer(to: string, value: string | undefined): DecodedTransaction {
        const amount = value ? this._formatEther(value) : "0";

        return {
            type: "native_transfer",
            description: `Send ${amount} to ${this._shortAddr(to)}`,
            to,
            amount,
        };
    }

    private _formatParsedTransaction(parsed: ethers.TransactionDescription, to: string, value: string | undefined): DecodedTransaction {
        const name = parsed.name;

        switch (name) {
            case "transfer":
                return {
                    type: "erc20_transfer",
                    description: `Transfer tokens to ${this._shortAddr(String(parsed.args[0]))}`,
                    to: String(parsed.args[0]),
                    amount: String(parsed.args[1]),
                    tokenAddress: to,
                    functionName: name,
                };

            case "approve": {
                const spender = String(parsed.args[0]);
                const amount = parsed.args[1];
                const isUnlimited = BigInt(String(amount)) >= BigInt("0xffffffffffffffffffffffffffffffff");
                const symbol = KNOWN_TOKENS[to.toLowerCase()] || this._shortAddr(to);
                const desc = isUnlimited
                    ? `Approve unlimited spending of ${symbol}`
                    : `Approve token spending of ${symbol}`;

                return {
                    type: "erc20_approve",
                    description: desc,
                    spender,
                    amount: String(amount),
                    tokenAddress: to,
                    tokenSymbol: KNOWN_TOKENS[to.toLowerCase()],
                    functionName: name,
                };
            }

            case "transferFrom":
            case "safeTransferFrom":
                return {
                    type: "erc721_transfer",
                    description: `Transfer NFT #${String(parsed.args[2])} to ${this._shortAddr(String(parsed.args[1]))}`,
                    to: String(parsed.args[1]),
                    tokenId: String(parsed.args[2]),
                    tokenAddress: to,
                    functionName: name,
                };

            case "setApprovalForAll": {
                const operator = String(parsed.args[0]);
                const approved = Boolean(parsed.args[1]);
                return {
                    type: "erc721_approve_all",
                    description: approved
                        ? `Approve ${this._shortAddr(operator)} to manage all your NFTs`
                        : `Revoke NFT management for ${this._shortAddr(operator)}`,
                    spender: operator,
                    functionName: name,
                };
            }

            case "mint":
                return {
                    type: "contract_interaction",
                    description: `Mint NFT to ${this._shortAddr(String(parsed.args[0]))}`,
                    to: String(parsed.args[0]),
                    functionName: name,
                };

            case "listItem":
                return {
                    type: "contract_interaction",
                    description: `List NFT #${String(parsed.args[1])} for sale`,
                    tokenId: String(parsed.args[1]),
                    tokenAddress: String(parsed.args[0]),
                    functionName: name,
                };

            case "buyItem":
                return {
                    type: "contract_interaction",
                    description: `Buy NFT #${String(parsed.args[1])}`,
                    tokenId: String(parsed.args[1]),
                    tokenAddress: String(parsed.args[0]),
                    amount: value ? this._formatEther(value) : undefined,
                    functionName: name,
                };

            case "makeOffer":
                return {
                    type: "contract_interaction",
                    description: `Make offer on NFT #${String(parsed.args[1])}`,
                    tokenId: String(parsed.args[1]),
                    tokenAddress: String(parsed.args[0]),
                    amount: value ? this._formatEther(value) : undefined,
                    functionName: name,
                };

            case "acceptOffer":
                return {
                    type: "contract_interaction",
                    description: `Accept offer on NFT #${String(parsed.args[1])}`,
                    tokenId: String(parsed.args[1]),
                    tokenAddress: String(parsed.args[0]),
                    functionName: name,
                };

            case "cancelListing":
                return {
                    type: "contract_interaction",
                    description: `Cancel listing for NFT #${String(parsed.args[1])}`,
                    tokenId: String(parsed.args[1]),
                    tokenAddress: String(parsed.args[0]),
                    functionName: name,
                };

            case "createCollection":
                return {
                    type: "contract_interaction",
                    description: `Create collection "${String(parsed.args[0])}" (${String(parsed.args[1])})`,
                    functionName: name,
                };

            case "exactInputSingle":
            case "exactInput":
            case "exactOutputSingle":
            case "exactOutput": {
                const params = parsed.args.params || parsed.args[0];
                return {
                    type: "swap",
                    description: `Token swap via Uniswap V3`,
                    to,
                    functionName: name,
                    srcToken: params?.tokenIn,
                    dstToken: params?.tokenOut,
                    amountIn: params?.amountIn ? String(params.amountIn) : undefined,
                    amountOutMin: params?.amountOutMinimum ? String(params.amountOutMinimum) : undefined,
                };
            }

            case "swapExactTokensForTokens":
            case "swapExactETHForTokens":
            case "swapExactTokensForETH":
            case "swapTokensForExactTokens":
            case "swapTokensForExactETH": {
                const path = parsed.args.path || parsed.args[2] || parsed.args[1];
                let srcToken, dstToken;
                if (Array.isArray(path) && path.length > 0) {
                    srcToken = path[0];
                    dstToken = path[path.length - 1];
                }
                const amountIn = parsed.args.amountIn || parsed.args.amountInMax || value;
                const amountOutMin = parsed.args.amountOutMin || parsed.args.amountOut;
                return {
                    type: "swap",
                    description: `Token swap`,
                    to,
                    functionName: name,
                    srcToken,
                    dstToken,
                    amountIn: amountIn ? String(amountIn) : undefined,
                    amountOutMin: amountOutMin ? String(amountOutMin) : undefined,
                };
            }

            case "swap": {
                let srcToken, dstToken, amountIn, amountOutMin;
                // Try desc struct or direct args
                const desc = parsed.args.desc || parsed.args[0];
                if (desc?.srcToken) {
                    srcToken = desc.srcToken;
                    dstToken = desc.dstToken;
                    amountIn = desc.amount;
                    amountOutMin = desc.minReturnAmount;
                } else if (parsed.args[1]?.srcToken) { 
                    // 1inch has address caller as arg 0
                    srcToken = parsed.args[1].srcToken;
                    dstToken = parsed.args[1].dstToken;
                    amountIn = parsed.args[1].amount;
                    amountOutMin = parsed.args[1].minReturnAmount;
                }
                return {
                    type: "swap",
                    description: `Token swap`,
                    to,
                    functionName: name,
                    srcToken,
                    dstToken,
                    srcTokenSymbol: srcToken && KNOWN_TOKENS[String(srcToken).toLowerCase()],
                    dstTokenSymbol: dstToken && KNOWN_TOKENS[String(dstToken).toLowerCase()],
                    amountIn: amountIn ? String(amountIn) : (value && value !== "0" ? value : undefined),
                    amountOutMin: amountOutMin ? String(amountOutMin) : undefined,
                };
            }

            case "multicall":
                return {
                    type: "swap",
                    description: `Token swap (bundled transaction)`,
                    to,
                    functionName: name,
                };

            default:
                return {
                    type: "contract_interaction",
                    description: `Call ${name}() on ${this._shortAddr(to)}`,
                    to,
                    functionName: name,
                };
        }
    }

    private _decodeBySelector(selector: string, data: string, to: string, value: string | undefined): DecodedTransaction {
        // Check known DEX swap selectors first
        const dexEntry = DEX_SWAP_SELECTORS[selector];
        if (dexEntry) {
            let srcToken, dstToken;
            
            // Fast reliable extraction for Kyber/1inch inline structures
            if (dexEntry.srcOffset !== undefined && dexEntry.dstOffset !== undefined) {
                const words = this._getHexWords(data);
                if (words.length > Math.max(dexEntry.srcOffset, dexEntry.dstOffset)) {
                    srcToken = ethers.getAddress("0x" + words[dexEntry.srcOffset].slice(24));
                    dstToken = ethers.getAddress("0x" + words[dexEntry.dstOffset].slice(24));
                }
            } else {
                const tokens = this._extractPossibleTokens(data, to);
                srcToken = tokens.srcToken;
                dstToken = tokens.dstToken;
            }

            return {
                type: "swap",
                description: `${dexEntry.action} via ${dexEntry.protocol}`,
                to,
                functionName: selector,
                srcToken: srcToken,
                dstToken: dstToken,
                srcTokenSymbol: srcToken && KNOWN_TOKENS[srcToken.toLowerCase()],
                dstTokenSymbol: dstToken && KNOWN_TOKENS[dstToken.toLowerCase()]
            };
        }

        if (ERC20_SIGNATURES[selector]) {
            const sig = ERC20_SIGNATURES[selector];
            try {
                const decoded = ethers.AbiCoder.defaultAbiCoder().decode(sig.inputs, "0x" + data.slice(10));

                if (sig.name === "transfer") {
                    return {
                        type: "erc20_transfer",
                        description: `Transfer tokens to ${this._shortAddr(String(decoded[0]))}`,
                        to: String(decoded[0]),
                        amount: String(decoded[1]),
                        tokenAddress: to,
                        functionName: sig.name,
                    };
                }

                if (sig.name === "approve") {
                    const symbol = KNOWN_TOKENS[to.toLowerCase()] || this._shortAddr(to);
                    return {
                        type: "erc20_approve",
                        description: `Approve token spending of ${symbol}`,
                        spender: String(decoded[0]),
                        amount: String(decoded[1]),
                        tokenAddress: to,
                        tokenSymbol: KNOWN_TOKENS[to.toLowerCase()],
                        functionName: sig.name,
                    };
                }
            } catch {
                // Fall through
            }
        }

        if (ERC721_SIGNATURES[selector]) {
            const sig = ERC721_SIGNATURES[selector];
            return {
                type: "erc721_transfer",
                description: `NFT interaction: ${sig.name}`,
                to,
                functionName: sig.name,
            };
        }

        return {
            type: "unknown",
            description: `Contract interaction with ${this._shortAddr(to)}`,
            to,
            functionName: selector,
        };
    }

    private _formatEther(value: string): string {
        try {
            if (value.startsWith("0x")) {
                return ethers.formatEther(BigInt(value));
            }
            if (/^\d+$/.test(value) && value.length > 10) {
                return ethers.formatEther(BigInt(value));
            }
            return value;
        } catch {
            return value;
        }
    }

    private _shortAddr(address: string): string {
        if (!address || address.length < 10) return address;
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    private _extractPossibleTokens(data: string, to: string): { srcToken?: string, dstToken?: string } {
        const tokens: string[] = [];
        const words = this._getHexWords(data);
        for (const word of words) {
            if (word.length === 64 && word.startsWith("000000000000000000000000")) {
                const addr = "0x" + word.slice(24);
                if (addr !== "0x0000000000000000000000000000000000000000" && addr.toLowerCase() !== to.toLowerCase()) {
                    if (!tokens.some(t => t.toLowerCase() === addr.toLowerCase())) {
                        tokens.push(ethers.getAddress(addr));
                    }
                }
            }
        }
        return {
            srcToken: tokens[0],
            dstToken: tokens[1]
        };
    }

    private _getHexWords(data: string): string[] {
        const words: string[] = [];
        const cleanData = data.startsWith("0x") ? data.slice(10) : data.slice(8);
        for (let i = 0; i < cleanData.length; i += 64) {
            words.push(cleanData.substring(i, i + 64));
        }
        return words;
    }
}
