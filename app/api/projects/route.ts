import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { ProjectsData, Project } from "../../types";

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
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const project: Project = await request.json();
    const data = readData();
    data.projects.push(project);
    writeData(data);
    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
