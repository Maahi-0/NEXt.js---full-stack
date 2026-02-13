import { Comments } from "../data"


export async function GET(request, { params }) {
    const { id } = await params
    console.log("params =", { id })

    const comment = Comments.find(
        (c) => c.id === id
    )

    return Response.json(comment)
}
