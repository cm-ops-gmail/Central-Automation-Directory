import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { ProjectsData, Category } from "../../../types";

const DATA_PATH = join(process.cwd(), "data/projects.json");

function readData(): ProjectsData {
  return JSON.parse(readFileSync(DATA_PATH, "utf-8"));
}

function writeData(data: ProjectsData) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updated: Category = await request.json();
    const data = readData();
    const idx = data.categories.findIndex((c) => c.id === params.id);
    if (idx === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    data.categories[idx] = updated;
    writeData(data);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = readData();
    data.categories = data.categories.filter((c) => c.id !== params.id);
    // Remove this category from all projects
    data.projects = data.projects.map((p) => ({
      ...p,
      categories: p.categories.filter((c) => c !== params.id),
    }));
    writeData(data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
