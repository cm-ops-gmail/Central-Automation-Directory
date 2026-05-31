import { NextResponse } from "next/server";
import { getData, setData } from "../../../lib/data";
import { Category } from "../../types";

export async function GET() {
  try {
    const data = await getData();
    return NextResponse.json(data.categories);
  } catch {
    return NextResponse.json({ error: "Failed to read categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const category: Category = await request.json();
    const data = await getData();
    if (data.categories.find((c) => c.id === category.id))
      return NextResponse.json({ error: "Category ID already exists" }, { status: 409 });
    data.categories.push(category);
    await setData(data);
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
