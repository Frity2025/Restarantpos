import { type NextRequest, NextResponse } from "next/server"
import { passwordResetService } from "@/lib/auth/password-reset"

export async function POST(request: NextRequest) {
  try {
    const { identifier, method, language } = await request.json()

    if (!identifier || !method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await passwordResetService.requestPasswordReset(identifier, method, language || "am")

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
