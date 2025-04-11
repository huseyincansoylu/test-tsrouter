import  { useState, useEffect } from 'react'
import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi'
import { useAuth } from '../auth'

export function WalletInfo() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({ address })
  const { web3auth, login } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (web3auth) {
      setIsLoading(false)
    }
  }, [web3auth])

  const handleConnect = async () => {
    if (!web3auth) return
    
    try {
      // Use the existing login function from auth context
      await login()
      
      // After successful login, connect with Wagmi
      // Find the Web3Auth connector from the available connectors
      const web3authConnector = connectors.find(
        (connector) => connector.id === 'web3auth'
      )
      
      if (web3authConnector) {
        await connect({ connector: web3authConnector })
      } else {
        console.error('Web3Auth connector not found')
      }
    } catch (error) {
      console.error('Error connecting with Web3Auth:', error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Wallet Information</h2>
      
      {isConnected ? (
        <div className="space-y-2">
          <p><strong>Address:</strong> {address}</p>
          {balance && (
            <p>
              <strong>Balance:</strong> {balance.formatted} {balance.symbol}
            </p>
          )}
          <button
            onClick={() => disconnect()}
            className="bg-red-500 text-white py-2 px-4 rounded-md"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-4">Not connected to a wallet</p>
          <button
            onClick={handleConnect}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Connect with Web3Auth
          </button>
        </div>
      )}
    </div>
  )
} 