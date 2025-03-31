import { parseAbi } from "viem";

const transferContract = (address: string) => ({
    address,
    abi: parseAbi(["function balanceOf(address) view returns (uint256)", "function totalSupply() view returns (uint256)"]),
});

export const ethContracts = {
    transferContract,
};
