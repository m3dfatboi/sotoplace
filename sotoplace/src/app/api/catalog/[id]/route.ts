import { NextRequest } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ok, notFound, serverError } from "@/lib/api-response";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: { images: true, attributes: true, variants: true },
    });
    if (!product) return notFound("Product not found");
    return ok(product);
  } catch (e) {
    return serverError();
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const [updated] = await db.update(products).set(body).where(eq(products.id, id)).returning();
    if (!updated) return notFound();
    return ok(updated);
  } catch (e) {
    return serverError();
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(products).where(eq(products.id, id));
    return ok({ deleted: true });
  } catch (e) {
    return serverError();
  }
}
