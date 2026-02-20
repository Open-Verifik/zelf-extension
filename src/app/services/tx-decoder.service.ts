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

const ZELF_FACTORY_SIGNATURES: Record<string, { name: string; inputs: string[] }> = {
    "0x": { name: "createCollection", inputs: ["string", "string", "uint256"] },
};

const ZELF_MARKETPLACE_SIGNATURES: Record<string, { name: string; inputs: string[] }> = {};

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
    "function swap(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOutMin)",
    "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)",
    "function swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)",
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
                const desc = isUnlimited
                    ? `Approve unlimited spending by ${this._shortAddr(spender)}`
                    : `Approve spending by ${this._shortAddr(spender)}`;

                return {
                    type: "erc20_approve",
                    description: desc,
                    spender,
                    amount: String(amount),
                    tokenAddress: to,
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
                    return {
                        type: "erc20_approve",
                        description: `Approve spending by ${this._shortAddr(String(decoded[0]))}`,
                        spender: String(decoded[0]),
                        amount: String(decoded[1]),
                        tokenAddress: to,
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
            functionName: `0x${selector.slice(2)}`,
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
}
