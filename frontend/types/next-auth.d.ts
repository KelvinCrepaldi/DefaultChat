import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      accessToken: string;
      name: string;
      email: string;
      picture: string;
    };
  }
}
