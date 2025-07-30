"use server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function withdrawUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) throw new Error("認証エラー");

    await prisma.post.updateMany({
        where: { authorId: session.user.id },
        data: { isDeleted: true },
    }); 

    await prisma.response.updateMany({
        where: { authorId: session.user.id },
        data: { isDeleted: true },
    });

    await prisma.user.update({
        where: { id: session.user.id },
        data: { isDeleted: true },
    });

    const cookieStore = await cookies();
    cookieStore.delete("next-auth.session-token");
    cookieStore.delete("next-auth.callback-url");

    redirect("/");
}