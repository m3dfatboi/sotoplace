import { NextRequest } from "next/server";
import { db } from "@/db";
import { deals, dealPositions, dealParts, partOperations, dealPayments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ok, notFound, serverError } from "@/lib/api-response";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deal = await db.query.deals.findFirst({
      where: eq(deals.id, id),
      with: {
        positions: {
          with: {
            parts: {
              with: { operations: true },
            },
          },
        },
        payments: true,
      },
    });
    if (!deal) return notFound("Deal not found");
    return ok(deal);
  } catch (e) {
    return serverError();
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const [updated] = await db
      .update(deals)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(deals.id, id))
      .returning();
    if (!updated) return notFound();
    return ok(updated);
  } catch (e) {
    return serverError();
  }
}
