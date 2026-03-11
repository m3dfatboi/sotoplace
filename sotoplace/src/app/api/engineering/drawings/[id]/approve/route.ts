import { NextRequest } from "next/server";
import { db } from "@/db";
import { drawings, drawingVersions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ok, badRequest, notFound, serverError } from "@/lib/api-response";

// POST /api/engineering/drawings/:id/approve
// Body: { versionId, approvedBy }
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { versionId, approvedBy } = await req.json();

    if (!versionId || !approvedBy) {
      return badRequest("versionId and approvedBy are required");
    }

    // Mark version as approved
    const [version] = await db
      .update(drawingVersions)
      .set({ status: "approved", approvedBy, approvedAt: new Date() })
      .where(eq(drawingVersions.id, versionId))
      .returning();

    if (!version) return notFound("Drawing version not found");

    // Update drawing status
    const [drawing] = await db
      .update(drawings)
      .set({ status: "approved", updatedAt: new Date() })
      .where(eq(drawings.id, id))
      .returning();

    return ok({ drawing, version });
  } catch (e) {
    return serverError();
  }
}
