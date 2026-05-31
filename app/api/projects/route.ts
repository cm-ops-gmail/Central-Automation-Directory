import { NextResponse } from "next/server";
import { getData, setData } from "../../../lib/data";
import { Project } from "../../types";

export async function GET() {
  try {
    const data = await getData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const project: Project = await request.json();
    const data = await getData();
    data.projects.push(project);
    await setData(data);
    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
