import { type NextRequest, NextResponse } from "next/server"
import { passwordResetService } from "@/lib/auth/password-reset"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ success: false, message: "Token is required" }, { status: 400 })
    }

    const verification = await passwordResetService.verifyResetToken(token)

    if (verification.valid) {
      return NextResponse.json({
        success: true,
        message: "Token verified successfully",
        type: verification.type,
      })
    } else {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 })
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
