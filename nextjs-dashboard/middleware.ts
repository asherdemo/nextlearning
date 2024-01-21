import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
// TODO Step4 : Protecting your routes: import the authConfig object into a Middleware file 
// 1. initializing NextAuth.js with the authConfig object 
// 2. exporting the auth property
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};