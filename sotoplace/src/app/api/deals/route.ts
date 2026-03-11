import { NextRequest } from "next/server";
import { db } from "@/db";
import { deals } from "@/db/schema";
import { eq, and, desc, ilike, sql } from "drizzle-orm";
import { ok, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const tenantId = searchParams.get("tenantId") || "";
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "25");
    const offset = (page - 1) * limit;

    const conditions = [];
    if (tenantId) conditions.push(eq(deals.sellerTenantId, tenantId));
    if (status) conditions.push(eq(deals.status, status as any));

    const rows = await db
      .select()
      .from(deals)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(deals.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(deals)
      .where(conditions.length ? and(...conditions) : undefined);

    return ok({ items: rows, total: Number(count), page, limit });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Auto-generate deal number
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(deals);
    const number = `#${String(Number(count) + 1000).padStart(4, "0")}`;

    const [deal] = await db.insert(deals).values({ ...body, number }).returning();
    return ok(deal, 201);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
