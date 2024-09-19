import { NextResponse } from "next/server";
import { getUserRole } from "@/lib/getUserRole";

export async function GET() {
  try {
    const role = await getUserRole();
    return NextResponse.json({ role });
  } catch (error) {
    console.error("Error in getUserRole API route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
