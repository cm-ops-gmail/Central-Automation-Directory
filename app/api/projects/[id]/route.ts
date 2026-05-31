import { NextResponse } from "next/server";
import { getData, setData } from "../../../../lib/data";
import { Project } from "../../../types";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updated: Project = await request.json();
    const data = await getData();
    const idx = data.projects.findIndex((p) => p.id === params.id);
    if (idx === -1)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    data.projects[idx] = updated;
    await setData(data);
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
    const data = await getData();
    data.projects = data.projects.filter((p) => p.id !== params.id);
    await setData(data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
