import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeforToken } from "@/lib/aurinko"; 
import { getAccountDetails } from "@/lib/aurinko";
import { db } from "@/server/db";

export const GET = async (req: NextRequest) => {
    const { userId} = await auth();
    if(!userId){NextResponse.json({error: "User not found"})}

    const params = req.nextUrl.searchParams;
    console.log("Params", params);
    const status = params.get('status');
    console.log("Status", status);
    if(status !== 'success'){return NextResponse.json({error: "Authorization failed", status})}
    const code = params.get('code');
    if(!code){return NextResponse.json({error: "No code found"})}
    const token = await exchangeCodeforToken(code);
    if(!token){return NextResponse.json({error: "Token not found"})}
    const accounDetails = await getAccountDetails(token.accessToken);
    console.log("Account details", accounDetails);

    await db.account.upsert({
        where: {
            id: token.accountId.toString(),
        },
        update: {
            accessToken: token.accessToken,
        },
        create: {
            id: token.accountId.toString(),
            accessToken: token.accessToken,
            email: accounDetails?.email??"",
            userId: userId??"",
        },
    })

    return NextResponse.redirect(new URL('/mail',req.url));
}

 