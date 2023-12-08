"use client";
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { Chain, configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

// const { chains, publicClient } = configureChains([goerli], [publicProvider()]);

 
const { chains, publicClient } = configureChains(
  [goerli],
  [
    jsonRpcProvider({
      rpc: (chain: Chain) => ({
        http: `https://rpc0-testnet.selendra.org`,
      }),
    }),
  ],
)

const { connectors } = getDefaultWallets({
  appName: "scw",
  projectId: `${process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}`,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
