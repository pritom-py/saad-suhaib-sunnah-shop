import { NextResponse } from "next/server";
import { trackOrderAction } from "@/actions/tracking.action";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await trackOrderAction(body.orderNumber, body.phone);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
