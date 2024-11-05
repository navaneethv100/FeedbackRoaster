import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendverificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){
    await dbConnect();
    try {
        const {username, email, password} = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "Username already exists",
            }, {
                status: 400
            })
        }

        const existingUserByEmail = await UserModel.findOne({
            email
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserByEmail){
            if (existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "Email already exists and is already verified",
                }, {status: 400})
            } else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 1000 * 60 * 5)
                await existingUserByEmail.save()
            }

        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser =  new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save();
        }

        //Send Verification Email
        const emailresponse = await sendverificationEmail(email, username, verifyCode)

        if(!emailresponse.success){
            return Response.json({
                success: false,
                message: emailresponse.message,
            }, {status: 500})
        }

        return Response.json({
            success: true,
            message: "User signed up successfully. Please verify your email to continue.",
        }, {status: 201})

    } catch (error) {
        console.error("Error signing up", error);
        return Response.json({
            success: false,
            message: "Error signing up",
        }, {status: 500})
    }
}
