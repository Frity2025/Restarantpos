import { type NextRequest, NextResponse } from "next/server"
import { passwordResetService } from "@/lib/auth/password-reset"

export async function POST(request: NextRequest) {
  try {
    const { method, emailOrPhone } = await request.json()

    if (!method || !emailOrPhone) {
      return NextResponse.json({ success: false, message: "Method and email/phone are required" }, { status: 400 })
    }

    let result
    if (method === "email") {
      result = await passwordResetService.initiateEmailReset(emailOrPhone)
    } else if (method === "sms") {
      result = await passwordResetService.initiateSMSReset(emailOrPhone)
    } else {
      return NextResponse.json({ success: false, message: "Invalid method" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json({ success: false, message: "Token and new password are required" }, { status: 400 })
    }

    const result = await passwordResetService.resetPassword(token, newPassword)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
