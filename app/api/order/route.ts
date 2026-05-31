import { NextResponse } from "next/server";
import { getData, setData } from "../../../lib/data";

export async function PUT(request: Request) {
  try {
    const { categoryOrder }: { categoryOrder: Record<string, string[]> } =
      await request.json();
    const data = await getData();
    data.categoryOrder = categoryOrder;
    await setData(data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}
