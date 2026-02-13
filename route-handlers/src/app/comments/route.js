import { headers } from "next/headers";
import { Comments } from "./data"

export async function GET() {
    return Response.json(Comments)
}

export async function POST(Request) {
    const comment = await Request.json();

    const newcomment = {
        id: Comments.length + 1,
        text: comment.text,
    };

    Comment.push(newcomment);
    return new Response(JSON.stringify(newcomment), {
        headers: {
            "Content-Type": "application/json",
        },
        status: 201,
    })
}