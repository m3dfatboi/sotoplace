import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data, ok: true }, { status });
}

export function created<T>(data: T) {
  return ok(data, 201);
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message, ok: false }, { status: 404 });
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message, ok: false }, { status: 403 });
}

export function badRequest(message = "Bad request") {
  return NextResponse.json({ error: message, ok: false }, { status: 400 });
}

export function serverError(message = "Internal server error") {
  return NextResponse.json({ error: message, ok: false }, { status: 500 });
}
