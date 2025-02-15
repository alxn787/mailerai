"use server"
import axios from 'axios'
export const getAurinkoAuthUrl = async(serviceType:'Google')=>{
    const params = new URLSearchParams({
        clientId: process.env.AURINKO_CLIENT_ID as string,
        serviceType,
        scopes: 'Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All',
        responseType: "code",
        returnUrl: `${process.env.NEXTAUTH_URL}/api/aurinko/callback`
    })
    return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`
}
export const exchangeCodeforToken = async (code: string) => {
    try{
        const response = await axios.post(`https://api.aurinko.io/v1/auth/token/${code}`, {},{
            auth: {
                username: process.env.AURINKO_CLIENT_ID as string,
                password: process.env.AURINKO_CLIENT_SECRET as string
            },
        })
        return response.data as {
            accountId: number,
            accessToken: string,
            userId: string,
            userSession: string
        }
    }catch(error){
        console.error(error)
    }
}

export const getAccountDetails = async (accessToken: string) => {
    try{
        const response = await axios.get('https://api.aurinko.io/v1/account', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response.data as{
            email: string,
            name: string,
        }
    }catch(error){
        console.error(error)
    }
}