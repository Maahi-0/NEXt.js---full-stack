import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteSnippet } from "@/app/actions/snippet-actions";

export default async function SnippetShowPage({ params }) {
    const { id } = await params;

    const snippet = await prisma.snippet.findUnique({
        where: { id: parseInt(id) },
    });

    if (!snippet) {
        return notFound();
    }

    const deleteSnippetAction = deleteSnippet.bind(null, snippet.id);

    return (
        <div className="min-h-screen flex flex-col p-8 items-center justify-center">
            <div className="w-full max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="text-blue-500 hover:text-blue-400 flex items-center gap-2 transition-colors font-medium">
                        <span>←</span> Back to Home
                    </Link>
                    <div className="flex gap-3">
                        <Link href={`/snippet/${snippet.id}/edit`}>
                            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">Edit</Button>
                        </Link>
                        <form action={deleteSnippetAction}>
                            <Button variant="destructive" className="bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white transition-all">Delete</Button>
                        </form>
                    </div>
                </div>

                <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                    <div className="bg-slate-950/50 px-8 py-6 border-b border-slate-800">
                        <h1 className="text-3xl font-bold text-white tracking-tight">{snippet.title}</h1>
                    </div>
                    <div className="p-8">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                            <pre className="relative bg-slate-950 p-6 rounded-xl overflow-x-auto border border-slate-800 ring-1 ring-slate-800">
                                <code className="text-blue-100 font-mono text-sm leading-relaxed">{snippet.code}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
