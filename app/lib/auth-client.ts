import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Use empty baseURL to use same origin (relative URLs)
  baseURL: "",
});

export const { signIn, signUp, signOut, useSession } = authClient;
