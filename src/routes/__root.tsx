import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

import { useAuth, type AuthContext } from "../auth"
import { Button } from "@/components/ui/button"
import { useReducer } from "react"

interface MyRouterContext {
  auth: AuthContext
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RouteComponent,
})

function RouteComponent() {
  const auth = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await auth.logout()
    router.invalidate()
  }

  return (
    <>
      <div className="h-12 p-8 flex items-center justify-between border-b border-gray-400">
        <Link to="/">Nevermined</Link>

        <div>
          <Link to="/dashboard">Dashboard</Link>
        </div>

        {auth.isAuthenticated ? (
          <Button onClick={handleLogout}>Log out</Button>
        ) : (
          <Button asChild>
            <Link to="/login">Log in</Link>
          </Button>
        )}
      </div>

      <Outlet />
      <TanStackRouterDevtools position="bottom-right" initialIsOpen={false} />
    </>
  )
}
