import { createConfig, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
import { Web3AuthNoModal } from '@web3auth/no-modal'

// Create a function to get the Wagmi config with Web3Auth connector
export function getWagmiConfig(web3authInstance: Web3AuthNoModal) {
  return createConfig({
    chains: [sepolia],
    transports: {
      [sepolia.id]: http(),
    },
    connectors: [
      Web3AuthConnector({
        web3AuthInstance: web3authInstance,
        loginParams: {
          loginProvider: 'google',
        },
      }),
    ],
  })
}
