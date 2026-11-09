import { NextResponse } from "next/server";
import { getData, setData } from "../../../lib/data";
import { DesignFile } from "../../types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getData();
    return NextResponse.json(data.designFiles ?? []);
  } catch {
    return NextResponse.json({ error: "Failed to read design files" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { designFiles }: { designFiles: DesignFile[] } = await request.json();
    if (!Array.isArray(designFiles))
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    const clean = designFiles
      .map((f) => ({
        id: String(f.id),
        name: String(f.name ?? "").trim(),
        link: String(f.link ?? "").trim(),
      }))
      .filter((f) => f.name);
    const data = await getData();
    data.designFiles = clean;
    await setData(data);
    return NextResponse.json(clean);
  } catch {
    return NextResponse.json({ error: "Failed to save design files" }, { status: 500 });
  }
}
