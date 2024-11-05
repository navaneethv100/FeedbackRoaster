import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {label: "Username", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect();
                try{
                    const user =await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if (!user) {
                        throw new Error("User not found with this email");
                    }
                    if (user.isVerified === false) {
                        throw new Error("User is not verified, Please verify your email to continue");
                    }
                    const passwordMatch = await bcrypt.compare(credentials.passwprd, user.password);
                    if(passwordMatch){
                        return user;
                    } else {
                        throw new Error("Invalid password");
                    }
                } catch (error) {
                    console.error("Error authorizing user", error);
                    throw new Error(error as string);
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}){
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({session, token}){
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        },
    },
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
}
