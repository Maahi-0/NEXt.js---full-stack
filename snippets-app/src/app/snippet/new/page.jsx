"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createSnippet } from "@/app/actions/snippet-actions";
import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Creating..." : "Create Snippet"}
        </Button>
    );
}

export default function CreateSnippetPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="w-full max-w-2xl p-8 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800">
                <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Create a New Snippet</h1>
                <form action={createSnippet} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-slate-300 font-medium">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="e.g. Binary Search in Python"
                            required
                            className="bg-slate-950 border-slate-800 text-white focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="code" className="text-slate-300 font-medium">Code</Label>
                        <Textarea
                            id="code"
                            name="code"
                            placeholder="Paste your logic here..."
                            required
                            className="bg-slate-950 border-slate-800 text-white min-h-[250px] font-mono focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <SubmitButton />
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}



