import { resend } from "@/lib/resend";
import { VerificationEmail } from ".././../emails/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";

export async function sendverificationEmail(
    email: string,
    username: string,
    verificationCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "FeedbaceRoaster: Verify your email",
            react: VerificationEmail({username, otp: verificationCode})
        })
        return {
            success: true,
            message: "Verification email sent successfully",
        }
    } catch (error) {
        console.error("Error sending verification email", error);
        return {
            success: false,
            message: "Error sending verification email",
        }
    }
}
