import fs from "node:fs/promises";
import { NextResponse } from "next/server";

import { getCurrentUser, verifyFileSignature } from "@/lib/auth";
import { getUpload } from "@/lib/queries";
import { uploadFilePath } from "@/lib/storage";

/**
 * Serves user-uploaded files from private storage.
 * Access requires either:
 * - a session (file owner or an admin), or
 * - a valid HMAC signature (?sig=...) so the Higgsfield API can fetch inputs.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const upload = getUpload(id);
  if (!upload) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const sig = new URL(request.url).searchParams.get("sig");
  let authorized = false;
  if (sig && verifyFileSignature(id, sig)) {
    authorized = true;
  } else {
    const user = await getCurrentUser();
    authorized = Boolean(
      user && (user.id === upload.user_id || user.role === "admin"),
    );
  }
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const buffer = await fs.readFile(uploadFilePath(id));
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": upload.mime,
        "Content-Length": String(upload.size),
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "File missing" }, { status: 404 });
  }
}
