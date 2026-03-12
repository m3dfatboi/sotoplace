import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { users, tenantMembers } from "@/db/schema";
import { eq } from "drizzle-orm";

// Demo users for development / when DB is unavailable
const DEMO_USERS: Record<string, { id: string; name: string; role: "manager" | "constructor" | "client" | "admin"; tenantId: string }> = {
  "ivan@metalpro.ru":    { id: "demo-1", name: "Иван Смирнов",   role: "manager",     tenantId: "demo-tenant" },
  "maria@metalpro.ru":   { id: "demo-2", name: "Мария Петрова",  role: "constructor", tenantId: "demo-tenant" },
  "buyer@officeplus.ru": { id: "demo-3", name: "Дмитрий Орлов",  role: "client",      tenantId: "demo-client" },
  "admin@sotoplace.ru":  { id: "demo-4", name: "Сергей Орлов",   role: "admin",       tenantId: "demo-tenant" },
};

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

        const email = credentials.email as string;

        // Try DB first, fall back to demo users
        try {
          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          if (user) {
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

            if (membership) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.avatar,
                role: membership.role,
                tenantId: membership.tenantId,
              };
            }
          }
        } catch {
          // DB unavailable — fall through to demo users
        }

        // Demo fallback
        const demo = DEMO_USERS[email];
        if (demo) {
          return { id: demo.id, email, name: demo.name, role: demo.role, tenantId: demo.tenantId };
        }

        return null;
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
