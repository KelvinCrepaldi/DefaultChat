import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface Session {
    user: {
      sub: string;
      accessToken: string;
      name: string;
      email: string;
      picture: string;
    };
  }
}
