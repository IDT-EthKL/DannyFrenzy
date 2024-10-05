// config.js
import { defineChain } from "thirdweb/chains";

export const MANTA_PACIFIC_SEPOLIA = defineChain(3441006);
export const SCROLL_SEPOLIA = defineChain(534351);
export const FACTORY_ADDRESS = "0xDE6A35183197A6Fc0b27a18A9d54D1AD26f53f40";
export const FISH_GAME_ADDRESS_MANTA = "0x2B47266fBBcC6BeA15C307DFcd5b2233e4275A18";
export const FISH_GAME_ADDRESS_SCROLL = "0x6696283e07ce0619f6d88626a77a41978517dd1f";
// config.js
export const FISH_GAME_ADDRESS = {
  [MANTA_PACIFIC_SEPOLIA.chainId]: "0x2B47266fBBcC6BeA15C307DFcd5b2233e4275A18",
  [SCROLL_SEPOLIA.chainId]: "0x6696283e07ce0619f6d88626a77a41978517dd1f" 
};

export const REWARD_TOKEN_ADDRESS = {
  [MANTA_PACIFIC_SEPOLIA.chainId]: "0xe3ba6f3debe7c639c6f57bfc451ce3fe979748e3", // Replace with actual address
  [SCROLL_SEPOLIA.chainId]: "0x893677ba1b1f794bbc836ac3fb8f5950a0c47436" // Replace with actual address
};