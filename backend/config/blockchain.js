import { ethers } from "ethers";

let provider;
let adminWallet;
let votingContract;
let isSimulation = false;

try {
  const rpcUrl = process.env.RPC_URL;
  const privateKey = process.env.ADMIN_PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!rpcUrl || !privateKey || privateKey.includes("YOUR_PRIVATE_KEY")) {
    throw new Error("Missing credentials");
  }

  provider = new ethers.JsonRpcProvider(rpcUrl);
  adminWallet = new ethers.Wallet(privateKey, provider);

  votingContract = new ethers.Contract(
    contractAddress,
    ["function registerVoter(address voter) external"],
    adminWallet
  );
} catch (error) {
  console.warn("⚠️  Blockchain credentials missing or invalid. Starting in SIMULATION MODE.");
  isSimulation = true;

  // Mock Contract
  votingContract = {
    registerVoter: async (address) => {
      console.log(`[SIMULATION] Registering voter ${address} on blockchain...`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
      return {
        wait: async () => {
          console.log("[SIMULATION] Transaction confirmed.");
          return true;
        },
        hash: "0xSIMULATED_HASH_" + Date.now()
      };
    }
  };
}

export { provider, adminWallet, votingContract, isSimulation };
