import { NextRequest } from "next/server";
import { db } from "@/db";
import { products, productImages } from "@/db/schema";
import { eq, ilike, and, sql } from "drizzle-orm";
import { ok, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const search = searchParams.get("q") || "";
    const tenantId = searchParams.get("tenantId");
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "24");
    const offset = (page - 1) * limit;

    const conditions = [];

    if (search) conditions.push(ilike(products.name, `%${search}%`));
    if (tenantId) conditions.push(eq(products.tenantId, tenantId));

    const rows = await db
      .select()
      .from(products)
      .where(conditions.length ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset)
      .orderBy(products.createdAt);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
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
    const [product] = await db.insert(products).values(body).returning();
    return ok(product, 201);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
