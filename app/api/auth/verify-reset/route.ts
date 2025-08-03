import { type NextRequest, NextResponse } from "next/server"
import { passwordResetService } from "@/lib/auth/password-reset"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, code, newPassword, isCode = false } = body

    if (!newPassword) {
      return NextResponse.json({ success: false, message: "New password is required" }, { status: 400 })
    }

    if (!token && !code) {
      return NextResponse.json({ success: false, message: "Token or code is required" }, { status: 400 })
    }

    const tokenOrCode = isCode ? code : token
    const result = await passwordResetService.resetPassword(tokenOrCode, newPassword, isCode)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Password reset verification error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
