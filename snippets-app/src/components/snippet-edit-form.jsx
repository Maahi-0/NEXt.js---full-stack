"use client";

import { useState } from "react";
import { editSnippet } from "@/app/actions/snippet-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SnippetEditForm({ snippet }) {
    const [title, setTitle] = useState(snippet.title);
    const [code, setCode] = useState(snippet.code);

    const editSnippetAction = editSnippet.bind(null, snippet.id);

    return (
        <form action={editSnippetAction} className="space-y-6 bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800">
            <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300 font-medium">Title</Label>
                <Input
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-slate-950 border-slate-800 text-white focus:ring-blue-500/20"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="code" className="text-slate-200 font-medium">Code</Label>
                <Textarea
                    id="code"
                    name="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="bg-slate-950 border-slate-800 text-white min-h-[350px] font-mono focus:ring-blue-500/20 leading-relaxed"
                />
            </div>

            <div className="flex gap-4 pt-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 h-11">Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => window.history.back()} className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-11">
                    Cancel
                </Button>
            </div>
        </form>
    );

}
