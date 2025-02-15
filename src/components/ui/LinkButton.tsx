"use client"
import { Button } from "./button"
import { getAurinkoAuthUrl } from "@/lib/aurinko"

export const LinkButton = () => {
    return (
        <Button onClick={async ()=>{
            window.location.href = await getAurinkoAuthUrl('Google')
        }}>Link to Aurinko</Button>
    )
}