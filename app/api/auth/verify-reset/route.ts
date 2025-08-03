import { type NextRequest, NextResponse } from "next/server"
import { passwordResetService } from "@/lib/auth/password-reset"

export async function POST(request: NextRequest) {
  try {
    const { token, code, identifier, newPassword } = await request.json()

    if (token && newPassword) {
      // Token-based reset (email)
      const success = await passwordResetService.resetPassword(token, newPassword)
      return NextResponse.json({ success })
    } else if (code && identifier && newPassword) {
      // Code-based reset (SMS)
      const success = await passwordResetService.resetPasswordWithCode(identifier, code, newPassword)
      return NextResponse.json({ success })
    } else if (code && identifier) {
      // Code verification only
      const resetRequest = await passwordResetService.verifyResetCode(identifier, code)
      return NextResponse.json({ valid: !!resetRequest })
    }

    return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
