import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server";
import {  getAurinkoToken } from "@/lib/aurinko"; 
import { getAccountDetails } from "@/lib/aurinko";
import { db } from "@/server/db";

export const GET = async (req: NextRequest) => {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const params = req.nextUrl.searchParams
    console.log("Params", params)
    const status = params.get('status');
    // console.log("Status", status)
    // if (status !== 'success') return NextResponse.json({ error: "Account connection failed" }, { status: 400 });

    const code = params.get('code');
    console.log("Code", code)
    const token = await getAurinkoToken(code as string)
    if (!token) return NextResponse.json({ error: "Failed to fetch token" }, { status: 400 });
    const accountDetails = await getAccountDetails(token.accessToken)
    await db.account.upsert({
        where: { id: token.accountId.toString() },
        create: {
            id: token.accountId.toString(),
            userId,
            accessToken: token.accessToken,
            email: accountDetails?.email??"",
        },
        update: {
            accessToken: token.accessToken,
        }
    })

    return NextResponse.redirect(new URL('/mail', req.url))
}