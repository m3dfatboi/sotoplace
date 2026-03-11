import { NextRequest } from "next/server";
import { db } from "@/db";
import { messages, chats } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ok, badRequest, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const chatId = searchParams.get("chatId");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!chatId) return badRequest("chatId required");

    const rows = await db.query.messages.findMany({
      where: eq(messages.chatId, chatId),
      orderBy: [desc(messages.createdAt)],
      limit,
      with: { author: { columns: { id: true, name: true, avatar: true } } },
    });

    return ok(rows.reverse());
  } catch (e) {
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatId, authorId, text, attachmentUrl, attachmentName } = body;

    if (!chatId || !authorId || !text) return badRequest("chatId, authorId, text required");

    const [message] = await db
      .insert(messages)
      .values({ chatId, authorId, text, attachmentUrl, attachmentName })
      .returning();

    return ok(message, 201);
  } catch (e) {
    return serverError();
  }
}
