import { createFileRoute } from "@tanstack/react-router"
import { WalletInfo } from "../components/WalletInfo"

export const Route = createFileRoute("/wallet")({
  component: WalletPage,
})

function WalletPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Web3Auth with Wagmi Example</h1>
      <WalletInfo />
    </div>
  )
} 