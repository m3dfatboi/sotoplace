import { NextRequest } from "next/server";
import { db } from "@/db";
import { drawings, drawingVersions } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { ok, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const dealId = searchParams.get("dealId");
    const assignedTo = searchParams.get("assignedTo");

    const conditions = [];
    if (dealId) conditions.push(eq(drawings.dealId, dealId));
    if (assignedTo) conditions.push(eq(drawings.assignedTo, assignedTo));

    const rows = await db.query.drawings.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      with: {
        versions: { orderBy: [desc(drawingVersions.version)], limit: 1 },
        comments: { limit: 3, orderBy: [desc(drawingVersions.createdAt)] },
      },
      orderBy: [desc(drawings.createdAt)],
    });

    return ok(rows);
  } catch (e) {
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const [drawing] = await db.insert(drawings).values(body).returning();
    return ok(drawing, 201);
  } catch (e) {
    return serverError();
  }
}
