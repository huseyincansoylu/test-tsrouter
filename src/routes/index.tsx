import { Link, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Welcome to the Web3Auth with Wagmi Example</h1>
      <div className="space-y-4">
        <p>This is a simple example of using Web3Auth with Wagmi in a React application.</p>
        <div className="flex gap-4">
          <Link to="/wallet" className="bg-blue-500 text-white py-2 px-4 rounded-md">
            Go to Wallet Page
          </Link>
          <Link to="/login" className="bg-green-500 text-white py-2 px-4 rounded-md">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
