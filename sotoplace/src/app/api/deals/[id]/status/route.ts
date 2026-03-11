import { NextRequest } from "next/server";
import { db } from "@/db";
import { deals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ok, badRequest, notFound, serverError } from "@/lib/api-response";

const VALID_STATUSES = ["draft", "proposal_sent", "approved", "in_production", "ready", "shipped", "closed", "cancelled"];

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!VALID_STATUSES.includes(status)) {
      return badRequest(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
    }

    const [updated] = await db
      .update(deals)
      .set({ status, updatedAt: new Date() })
      .where(eq(deals.id, id))
      .returning();

    if (!updated) return notFound();
    return ok(updated);
  } catch (e) {
    return serverError();
  }
}
