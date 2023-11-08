import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { prisma } from "./db";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_ISSUER as string,
      authorization: {
        params: {
          prompt: `${process.env.NODE_ENV === "production" ? "login" : ""}`,
        },
      },
    }),
  ],
  secret: process.env.NEXT_AUTH_SECRET as string,
};
