// config.js
import { Scroll, ScrollSepoliaTestnet } from "@thirdweb-dev/chains";

export const MANTA_PACIFIC_SEPOLIA = {
  chainId: 3441006,
  rpc: ["https://pacific-rpc.sepolia-testnet.manta.network/http"],
  nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  shortName: "manta-sepolia",
  slug: "manta-sepolia",
  testnet: true,
  chain: "Manta Pacific Sepolia",
  name: "Manta Pacific Sepolia Testnet",
};

export const SCROLL_SEPOLIA = ScrollSepoliaTestnet;

export const FISH_GAME_ADDRESS = {
  [MANTA_PACIFIC_SEPOLIA.chainId]: "0x5600a56980492570B74C71B16A242544208e4E53",
  [SCROLL_SEPOLIA.chainId]: "0x6696283e07ce0619f6d88626a77a41978517dd1f"
};

export const REWARD_TOKEN_ADDRESS = {
  [MANTA_PACIFIC_SEPOLIA.chainId]: "0x15455Ee837cf3E8115862900AA9434E92d95c662",
  [SCROLL_SEPOLIA.chainId]: "0x893677ba1b1f794bbc836ac3fb8f5950a0c47436"
};

export const FISH_NFT_ADDRESS = {
  [MANTA_PACIFIC_SEPOLIA.chainId]: "0x42EDfF2AB874c94F843C8112629313066eb82847",
  [SCROLL_SEPOLIA.chainId]: "0x1022f54be54e5bd3161f090356cb1356e5c69c92"
};

export const HYPERLANE_MAILBOX = {
  [MANTA_PACIFIC_SEPOLIA.chainId]: "0xAF85A0023fAc623fCE4F20f50BD475C01e6791B1",
  // Add Scroll Sepolia mailbox address if available
};