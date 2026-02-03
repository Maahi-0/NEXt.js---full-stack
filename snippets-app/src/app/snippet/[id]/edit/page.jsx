import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SnippetEditForm from "@/components/snippet-edit-form";

export default async function SnippetEditPage({ params }) {
    const { id } = await params;
    const snippetId = parseInt(id);

    const snippet = await prisma.snippet.findUnique({
        where: { id: snippetId },
    });

    if (!snippet) {
        return notFound();
    }

    return (
        <div className="min-h-screen flex flex-col p-8 items-center justify-center">
            <div className="w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Edit Snippet: <span className="text-blue-600">{snippet.title}</span></h1>
                <SnippetEditForm snippet={snippet} />
            </div>
        </div>
    );
}
