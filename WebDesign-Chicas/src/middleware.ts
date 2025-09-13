import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Se autenticado e tentando acessar /login, redireciona para /profile
    if (req.nextUrl.pathname === "/login" && req.nextauth.token) {
      return Response.redirect(new URL("/profile", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Rotas públicas
        if (req.nextUrl.pathname === "/login" || 
            req.nextUrl.pathname.startsWith("/api/auth")) {
          return true
        }
        
        // Todas as outras rotas precisam de autenticação
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ]
}



