import { type NextRequest, NextResponse } from "next/server"
import { passwordResetService } from "@/lib/auth/password-reset"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, method = "email", language = "en" } = body

    if (!identifier) {
      return NextResponse.json({ success: false, message: "Identifier is required" }, { status: 400 })
    }

    const result = await passwordResetService.requestPasswordReset(identifier, method, language)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Password reset request error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
