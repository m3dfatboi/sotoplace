import { NextRequest } from "next/server";
import { db } from "@/db";
import { cartItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ok, serverError, badRequest } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("userId");
    const tenantId = searchParams.get("tenantId");

    if (!userId || !tenantId) return badRequest("userId and tenantId required");

    const items = await db.query.cartItems.findMany({
      where: and(eq(cartItems.userId, userId), eq(cartItems.tenantId, tenantId)),
    });

    return ok(items);
  } catch (e) {
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, tenantId, productId, variantId, qty = 1 } = body;

    if (!userId || !tenantId || !productId) return badRequest("Missing required fields");

    // Upsert: if already in cart, increment qty
    const existing = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.userId, userId),
        eq(cartItems.productId, productId),
        variantId ? eq(cartItems.variantId, variantId) : undefined
      ),
    });

    if (existing) {
      const [updated] = await db
        .update(cartItems)
        .set({ qty: existing.qty + qty })
        .where(eq(cartItems.id, existing.id))
        .returning();
      return ok(updated);
    }

    const [item] = await db.insert(cartItems).values(body).returning();
    return ok(item, 201);
  } catch (e) {
    return serverError();
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const itemId = searchParams.get("itemId");
    if (!itemId) return badRequest("itemId required");

    await db.delete(cartItems).where(eq(cartItems.id, itemId));
    return ok({ deleted: true });
  } catch (e) {
    return serverError();
  }
}
