import { ethers } from "ethers"

// ABI for the Governance contract
export const GovernanceABI = [
  "function vote(uint256[] calldata _impactorIds, uint256[] calldata _points) external",
  "function getVotesByUser(address _voter) external view returns (tuple(uint256 impactorId, uint256 points, uint256 weight, uint256 epoch)[])",
  "function getTotalVotes(uint256 _impactorId) external view returns (uint256)",
  "function maxPoints() external view returns (uint256)",
  "function currentEpoch() external view returns (uint256)",
  "event VoteCast(address indexed voter, uint256[] impactorIds, uint256[] points, uint256 votingPower, uint256 epoch)",
]

// Contract addresses
export const GOVERNANCE_CONTRACT_ADDRESS = "0x97259aA76332A3919d0a39aaDFE9231c257779E1"

// Chain configuration
export const GNOSIS_CHAIN = {
  id: 100,
  name: "Gnosis Chain",
  network: "gnosis",
  nativeCurrency: {
    decimals: 18,
    name: "xDAI",
    symbol: "xDAI",
  },
  rpcUrls: {
    default: "https://rpc.gnosischain.com",
    public: "https://rpc.gnosischain.com",
  },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://gnosisscan.io" },
  },
}

// Create a contract instance
export function getGovernanceContract(provider: ethers.Provider | ethers.Signer) {
  return new ethers.Contract(GOVERNANCE_CONTRACT_ADDRESS, GovernanceABI, provider)
}

// Get provider for Gnosis Chain
export function getGnosisProvider() {
  return new ethers.JsonRpcProvider(GNOSIS_CHAIN.rpcUrls.default)
}
