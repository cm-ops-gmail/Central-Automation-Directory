import { NextResponse } from "next/server";
import { getData, setData } from "../../../../lib/data";
import { Category } from "../../../types";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updated: Category = await request.json();
    const data = await getData();
    const idx = data.categories.findIndex((c) => c.id === params.id);
    if (idx === -1)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    data.categories[idx] = updated;
    await setData(data);
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
    const data = await getData();
    data.categories = data.categories.filter((c) => c.id !== params.id);
    data.projects = data.projects.map((p) => ({
      ...p,
      categories: p.categories.filter((c) => c !== params.id),
    }));
    await setData(data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
