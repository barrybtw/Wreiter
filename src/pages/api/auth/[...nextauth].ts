import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { prisma } from "./../../../server/db";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { PrismaClient } from "@prisma/client";

export default NextAuth({
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma as PrismaClient),
  providers: [
    DiscordProvider({
      clientId: process.env.clientId as string,
      clientSecret: process.env.clientSecret as string,
    }),
    // ...add more providers here
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
});
