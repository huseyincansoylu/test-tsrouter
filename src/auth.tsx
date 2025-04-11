import {
  createContext, ReactNode, useCallback, useContext, useEffect, useState
} from "react"
import {
  IProvider,
  WALLET_ADAPTERS,
  UX_MODE,
  WEB3AUTH_NETWORK,
  getEvmChainConfig,
} from "@web3auth/base"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import { Web3AuthNoModal } from "@web3auth/no-modal"
import { AuthAdapter } from "@web3auth/auth-adapter"
import { WagmiProvider, createConfig } from "wagmi"
import { getWagmiConfig } from "./wagmi"

export interface AuthContext {
  isAuthenticated: boolean
  login: (
    provider: "google" | "github" | "facebook" | "reddit"
  ) => Promise<void>
  logout: () => Promise<void>
  user: string | null
  provider: IProvider | null
  web3auth: Web3AuthNoModal | null
  wagmiConfig: ReturnType<typeof createConfig> | null
}

const AuthContext = createContext<AuthContext | null>(null)

const key = "tanstack.auth.user"

function getStoredUser() {
  return localStorage.getItem(key)
}

function setStoredUser(user: string | null) {
  if (user) {
    localStorage.setItem(key, user)
  } else {
    localStorage.removeItem(key)
  }
}

// Web3Auth configuration
const clientId = import.meta.env.VITE_WEB3AUTH_CLIENT_ID
const chainConfig = getEvmChainConfig(0xaa36a7, clientId)!

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(getStoredUser())
  const [provider, setProvider] = useState<IProvider | null>(null)
  const [web3authInstance, setWeb3authInstance] =
    useState<Web3AuthNoModal | null>(null)
  const [wagmiConfig, setWagmiConfig] = useState<ReturnType<typeof createConfig> | null>(null)
  const isAuthenticated = !!user
  const iconUrl = "https://avatars.githubusercontent.com/u/72553858?s=200&v=4"

  // Initialize Web3Auth
  useEffect(() => {
    const init = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: {
            chainConfig,
          },
        })

        const web3AuthInstance = new Web3AuthNoModal({
          clientId: clientId,
          chainConfig,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          enableLogging: false,
          privateKeyProvider,
        })

        const authAdapter = new AuthAdapter({
          privateKeyProvider,
          clientId: clientId,
          adapterSettings: {
            network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
            uxMode: UX_MODE.REDIRECT,
            replaceUrlOnRedirect: false,
            storageKey: "local",
            redirectUrl: window.location.href,
            loginConfig: {
              google: {
                verifier: "nvm-subverifier-testnet",
                typeOfLogin: "google",
                clientId:
                  "112425687177-oaedru3vc9m7c45hsg3ka1n08svcn0eq.apps.googleusercontent.com",
                verifierSubIdentifier: "nvm-testnet-google-subverifier",
              },
            },
            whiteLabel: {
              appName: "Nevermined app",
              logoLight: iconUrl,
              logoDark: iconUrl,
              defaultLanguage: "en",
            },
          },
        })

        web3AuthInstance.configureAdapter(authAdapter)
        await web3AuthInstance.init()
        setWeb3authInstance(web3AuthInstance)
        setProvider(web3AuthInstance.provider)

        // Initialize Wagmi config
        const config = getWagmiConfig(web3AuthInstance)
        setWagmiConfig(config)

        if (web3AuthInstance.connected) {
          const userInfo = await web3AuthInstance.getUserInfo()
          setUser(userInfo.email || userInfo.name || "User")
          setStoredUser(userInfo.email || userInfo.name || "User")
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error)
      }
    }

    init()
  }, [])

  const logout = useCallback(async () => {
    try {
      if (web3authInstance) {
        await web3authInstance.logout()
        setProvider(null)
        setStoredUser(null)
        setUser(null)
      }
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }, [web3authInstance])

  const login = useCallback(
    async (provider: "google" | "github" | "facebook" | "reddit") => {
      try {
        console.log(`login: starting with ${provider}`)

        if (!web3authInstance) {
          throw new Error("Web3Auth not initialized")
        }

        const web3authProvider = await web3authInstance.connectTo(
          WALLET_ADAPTERS.AUTH,
          {
            loginProvider: provider,
          }
        )

        if (web3authProvider) {
          setProvider(web3authProvider)

          if (web3authInstance.connected) {
            const userInfo = await web3authInstance.getUserInfo()
            setUser(userInfo.email || userInfo.name || "User")
            setStoredUser(userInfo.email || userInfo.name || "User")
          }
        }
      } catch (error) {
        console.error(`Error logging in with ${provider}:`, error)
      }
    },
    [web3authInstance]
  )

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, provider, web3auth: web3authInstance, wagmiConfig }}>
      {wagmiConfig ? (
        <WagmiProvider config={wagmiConfig}>
          {children}
        </WagmiProvider>
      ) : (
        <div>Loading...</div>
      )}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
