import { db } from "@/server/db";

export const POST = async (req: Request) => {

    const { data } = await req.json();
    console.log("Webhook received", data);

    const email = data.email_addresses[0]?.email_address as string;
    const name = data.first_name as string;
    const imageurl = data.image_url as string;
    const id = data.id;
    console.log("User data:", { email, name, imageurl, id });

    await db.user.create({
        data: {
          email: email,
          name: name,
          imageurl: imageurl,
          id: id,
        }
    });
    console.log("User created");
    return new Response("User created", { status: 200 });
}
 