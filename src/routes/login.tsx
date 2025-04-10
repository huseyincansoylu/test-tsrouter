import { createFileRoute, redirect, useRouter } from "@tanstack/react-router"

import { useAuth } from "../auth"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: LoginComponent,
})

function LoginComponent() {
  const auth = useAuth()
  const router = useRouter()

  const handleLogin = async (
    provider: "google" | "github" | "facebook" | "reddit"
  ) => {
    try {
      await auth.login(provider)
      await router.invalidate()

      await router.navigate({ to: "/dashboard" })
    } catch (err) {
      console.error("Login failed", err)
    }
  }

  return (
    <div className="grid gap-6 max-w-[420px] mx-auto mt-40">
      <div className="grid gap-4 place-items-center">
        <Button className="w-full" onClick={() => handleLogin("google")}>
          Login with Google
        </Button>

        <div className="grid grid-cols-3 gap-4 w-full">
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => handleLogin("github")}
          >
            Github
          </Button>

          <Button
            className="w-full"
            variant="secondary"
            onClick={() => handleLogin("facebook")}
          >
            Facebook
          </Button>

          <Button
            className="w-full"
            variant="secondary"
            onClick={() => handleLogin("reddit")}
          >
            Reddit
          </Button>
        </div>
      </div>
      <div className="grid gap-4">
        <Input placeholder="Email/Phone" />

        <Button className="bg-purple-400 hover:bg-purple-300">Continue</Button>
      </div>
    </div>
  )
}
