import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { ProjectsData, Category } from "../../types";

const DATA_PATH = join(process.cwd(), "data/projects.json");

function readData(): ProjectsData {
  return JSON.parse(readFileSync(DATA_PATH, "utf-8"));
}

function writeData(data: ProjectsData) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json(data.categories);
  } catch {
    return NextResponse.json({ error: "Failed to read categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const category: Category = await request.json();
    const data = readData();
    if (data.categories.find((c) => c.id === category.id)) {
      return NextResponse.json({ error: "Category ID already exists" }, { status: 409 });
    }
    data.categories.push(category);
    writeData(data);
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
