import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/login" })
    }
  },
})

function RouteComponent() {
  return <div>Hello from dashboard component</div>
}
