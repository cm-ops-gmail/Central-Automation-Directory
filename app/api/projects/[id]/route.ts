import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { ProjectsData, Project } from "../../../types";

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
    const updated: Project = await request.json();
    const data = readData();
    const idx = data.projects.findIndex((p) => p.id === params.id);
    if (idx === -1) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    data.projects[idx] = updated;
    writeData(data);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = readData();
    data.projects = data.projects.filter((p) => p.id !== params.id);
    writeData(data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
