// app/api/upload-id/route.ts
import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "edge" in process.env ? "edge" : undefined; // keep default

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const userId = Number(form.get("userId"));
    if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

    const idFront = form.get("idFront") as File | null;
    const idBack = form.get("idBack") as File | null;
    const selfie = form.get("selfie") as File | null;

    if (!idFront || !selfie) {
      return NextResponse.json({ error: "idFront and selfie are required" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "ids");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const saveFile = async (file: File | null) => {
      if (!file) return null;
      const bytes = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const filepath = path.join(uploadDir, filename);
      fs.writeFileSync(filepath, bytes);
      return `/uploads/ids/${filename}`;
    };

    const frontUrl = await saveFile(idFront);
    const backUrl = await saveFile(idBack);
    const selfieUrl = await saveFile(selfie);

    // Call local Python verification service
    const pythonUrl = "http://localhost:8000/verify";

    // Build a FormData to send (node fetch doesn't support browser FormData fully, but in Next.js route environment this should work with fetch + FormData – if issues, use "form-data" package)
    const verifyForm = new FormData();
    // Since we saved files to disk we will re-read them as blobs to forward to python
    const readAsBuffer = (relPath: string | null) => {
      if (!relPath) return null;
      const abs = path.join(process.cwd(), "public", relPath.replace(/^\//, ""));
      const buffer = fs.readFileSync(abs);
      return new Blob([buffer]);
    };

    verifyForm.append("idFront", readAsBuffer(frontUrl) as Blob, path.basename(frontUrl || ""));
    if (backUrl) verifyForm.append("idBack", readAsBuffer(backUrl) as Blob, path.basename(backUrl));
    verifyForm.append("selfie", readAsBuffer(selfieUrl) as Blob, path.basename(selfieUrl));

    // call python verification
    const verifyRes = await fetch(pythonUrl, { method: "POST", body: verifyForm });
    const verifyJson = await verifyRes.json();

    // Update prisma user
    const status = verifyJson?.match ? "verified" : "failed";

    await prisma.user.update({
      where: { id: userId },
      data: {
        idFront: frontUrl,
        idBack: backUrl,
        selfieUrl,
        verificationStatus: status,
      },
    });

    return NextResponse.json({
      success: true,
      verification: verifyJson,
      frontUrl,
      backUrl,
      selfieUrl,
      status,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed", details: String(err) }, { status: 500 });
  }
}
