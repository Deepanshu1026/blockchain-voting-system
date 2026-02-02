import { ethers } from "ethers";

export const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL
);

export const adminWallet = new ethers.Wallet(
  process.env.ADMIN_PRIVATE_KEY,
  provider
);

export const votingContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  [
    "function registerVoter(address voter) external",
  ],
  adminWallet
);
