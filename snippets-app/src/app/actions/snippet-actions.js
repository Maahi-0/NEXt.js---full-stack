"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createSnippet(formData) {
    const title = formData.get("title");
    const code = formData.get("code");

    if (typeof title !== "string" || title.length < 3) {
        return { message: "Title must be at least 3 characters long" };
    }

    if (typeof code !== "string" || code.length < 10) {
        return { message: "Code must be at least 10 characters long" };
    }

    await prisma.snippet.create({
        data: {
            title,
            code,
        },
    });

    revalidatePath("/");
    redirect("/");
}

export async function deleteSnippet(id) {
    await prisma.snippet.delete({
        where: { id: parseInt(id) },
    });

    revalidatePath("/");
    redirect("/");
}

export async function editSnippet(id, formData) {
    const title = formData.get("title");
    const code = formData.get("code");

    await prisma.snippet.update({
        where: { id: parseInt(id) },
        data: { title, code },
    });

    revalidatePath(`/snippet/${id}`);
    redirect(`/snippet/${id}`);
}
