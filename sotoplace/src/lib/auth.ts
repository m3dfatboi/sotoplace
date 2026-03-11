import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { users, tenantMembers } from "@/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        tenantId: { label: "Tenant ID", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!user) return null;

        // TODO: bcrypt compare in production
        // const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        // if (!valid) return null;

        // Get tenant membership
        const tenantId = credentials.tenantId as string;
        const membership = tenantId
          ? await db.query.tenantMembers.findFirst({
              where: (m, { and }) =>
                and(eq(m.userId, user.id), eq(m.tenantId, tenantId)),
              with: { tenant: true },
            })
          : await db.query.tenantMembers.findFirst({
              where: eq(tenantMembers.userId, user.id),
              with: { tenant: true },
            });

        if (!membership) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
          role: membership.role,
          tenantId: membership.tenantId,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.tenantId = (user as any).tenantId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).tenantId = token.tenantId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
});

// Type augmentation
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: "manager" | "constructor" | "client" | "admin";
      tenantId: string;
    };
  }
}
