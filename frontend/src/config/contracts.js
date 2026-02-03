export const votingContractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || "0xYourContractAddressHere";

export const votingContractABI = [
    "function vote(uint pollId, uint candidateId) external",
    "function getPollVotes(uint pollId, uint candidateId) external view returns (uint)",
    "function polls(uint) view returns (uint id, string title, bool isActive)",
    "function createPoll(string title) external",
    "function registerVoter(address voter) external",
    "event PollCreated(uint pollId, string title)",
    "event Voted(uint pollId, uint candidateId, address voter)"
];
