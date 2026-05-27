import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { ProjectsData } from "../../types";

const DATA_PATH = join(process.cwd(), "data/projects.json");

export async function PUT(request: Request) {
  try {
    const { categoryOrder }: { categoryOrder: Record<string, string[]> } =
      await request.json();
    const data: ProjectsData = JSON.parse(readFileSync(DATA_PATH, "utf-8"));
    data.categoryOrder = categoryOrder;
    writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to save order" },
      { status: 500 }
    );
  }
}
