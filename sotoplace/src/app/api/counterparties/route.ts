import { NextRequest } from "next/server";
import { db } from "@/db";
import { tenants, counterpartyRelations, tenantReviews } from "@/db/schema";
import { eq, ilike, and, sql } from "drizzle-orm";
import { ok, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const viewerTenantId = searchParams.get("tenantId");
    const search = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const conditions = [];
    if (search) conditions.push(ilike(tenants.name, `%${search}%`));

    const rows = await db
      .select()
      .from(tenants)
      .where(conditions.length ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset);

    // If viewer tenant is known, enrich with relation data
    if (viewerTenantId) {
      const enriched = await Promise.all(
        rows.map(async (t) => {
          const relation = await db.query.counterpartyRelations.findFirst({
            where: and(
              eq(counterpartyRelations.tenantId, viewerTenantId),
              eq(counterpartyRelations.targetTenantId, t.id)
            ),
          });
          return {
            ...t,
            contactsRevealed: relation?.contactsRevealed ?? false,
            isFavorite: relation?.isFavorite ?? false,
            dealsCount: relation?.dealsCount ?? 0,
          };
        })
      );
      return ok(enriched);
    }

    return ok(rows);
  } catch (e) {
    return serverError();
  }
}
