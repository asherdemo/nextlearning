import type { NextAuthConfig } from 'next-auth';
 
// Step1 : Define authConfig object which will contain the configuration options for NextAuth.js. 
export const authConfig = {
  pages: {
    // Step2: Set custom login page. The user will be redirected to our custom login page, rather than the NextAuth.js default page.
    signIn: '/login',
  },

  // Step3  define The callbacks key is used to define an object containing various callback functions. In this case, there is a single callback named authorized. This authorized callback is executed when the library determines that a user is authorized to access a specific resource, such as a protected route.
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;