import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "@/services";
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password }: any = req.body;
        const response = await api.post("api/auth/login", { email, password });
        const { user, token } = response.data;

        if (!user) {
          return null;
        }
        return { ...user, token };
      },
    }),

    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token, user }: any) {
      session.user = token;
      
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

export default NextAuth(authOptions);
