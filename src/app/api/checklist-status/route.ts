import { NextRequest, NextResponse } from "next/server";
import { getCompletedRequirementIds, setChecklistStatus } from "@/lib/checklistRepo";

export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get("deviceId");
  if (!deviceId) {
    return NextResponse.json({ error: "deviceId is required" }, { status: 400 });
  }
  const completedIds = Array.from(getCompletedRequirementIds(deviceId));
  return NextResponse.json({ completedIds });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { deviceId, requirementId, completed } = body as {
    deviceId?: string;
    requirementId?: string;
    completed?: boolean;
  };

  if (!deviceId || !requirementId || typeof completed !== "boolean") {
    return NextResponse.json(
      { error: "deviceId, requirementId, and completed(boolean) are required" },
      { status: 400 }
    );
  }

  setChecklistStatus(deviceId, requirementId, completed);
  return NextResponse.json({ ok: true });
}
