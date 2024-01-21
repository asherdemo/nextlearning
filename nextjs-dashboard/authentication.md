npm i next-auth@5.0.0-beta.4

The callbacks key is used to define an object containing various callback functions. 

In this case, there is a single callback named authorized. This authorized callback is executed 
when the library determines that a user is authorized to access a specific resource, such as a protected route.

```
export const authConfig = {
  pages: {
    signIn: '/login',
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
```


TODO  what is the relationship b/w NextAuth && const config ??
/middleware.ts

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};


Logic: 
1. Step1(auth.config.ts) : Define authConfig object which will contain the configuration options for NextAuth.js. 
    * Set custom login page for authConfig.
    Why ? specify the route for custom sign-in, sign-out, and error pages.
     The user will be redirected to our custom login page, rather than the NextAuth.js default page.

    * Set callbacks for authConfig:
    Why ? prevent users from accessing the dashboard pages unless they are logged in.

     The callbacks key is used to define an object containing various callback functions. In this case, there is a single callback named authorized. This authorized callback is executed when the library determines that a user is authorized to access a specific resource, such as a protected route.
2. Step2(middleware.ts) : Use Middleware to do following things:  (WHY ?)the protected routes will not even start rendering until the Middleware verifies the authentication
    * initializing NextAuth.js with the authConfig object 
    * exporting the auth property
    *  using the matcher option from Middleware to specify that it should run on specific paths. 

3. Step3 (auth.ts) : spreads  authConfig object TODO (...authConfig)
```
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
});
```

4. Step4 (auth.js) list different login options (providers,eg ,use Credentials provider)
```
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({})],
});

```
5. Step5 (auth.js) handle the authentication logic( use the authorize function )
```
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        
      },
    }),
  ],
});
```

6. Step6(auth.js) type validation  (use Zod)
```
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
      },
    }),
  ],
});
```


7. Step7(auth.js) Compare the data with the database  (Get the data)
```
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        // compare the data with the database data
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
        }
 
        return null;
      },
    }),
  ],
});


async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
```

8. Step8 (auth.js) Compare the data with database (compare the passwd)
```
import bcrypt from 'bcrypt';


if (parsedCredentials.success) {
  const { email, password } = parsedCredentials.data;
  const user = await getUser(email);
  if (!user) return null;
  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (passwordsMatch) return user;
}
```



9. Step9(actions.tsx) Create a authenticate function to connect Form and signIn 
```
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
 
// ...
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
```


10. Form related (app/ui/login-form.tsx) Link form with authenticate
```
import { authenticate } from '@/app/lib/actions';

export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
 
  return (
    <form action={dispatch} className="space-y-3">
    </form>

```

11. Form related   (app/ui/login-form.tsx) add error msg for login 
```
<LoginButton />
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
```

12. Define  <LoginButton />  : use useFormStatus()
```
function LoginButton() {
  const { pending } = useFormStatus();
 
  return (
    <Button className="mt-4 w-full" aria-disabled={pending}>
      Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
```