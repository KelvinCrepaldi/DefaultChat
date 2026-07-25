import NextAuth, { type AuthOptions, type Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "@/services";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  image: string;
  token: string;
};

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await api.post("api/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });
          const { user, token } = response.data;

          if (!user) {
            return null;
          }
          return { ...user, token } as AuthUser;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      const authUser = user as AuthUser | undefined;
      if (authUser) {
        token.accessToken = authUser.token;
        token.sub = authUser.id;
        token.name = authUser.name;
        token.email = authUser.email;
        token.picture = authUser.image;
      }

      if (trigger === "update" && session?.picture) {
        token.picture = session.picture;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        sub: token.sub || "",
        accessToken: token.accessToken || "",
        name: token.name || "",
        email: token.email || "",
        picture: token.picture || "",
      };
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

export default NextAuth(authOptions);
