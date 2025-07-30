"use server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function updateProfile(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        throw new Error("認証エラー");
    }
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const updateData: any = { name, email };
    if (password) {
        updateData.password = bcrypt.hashSync(password, 10);
    }

    await prisma.user.update({
        where: { id: session.user.id },
        data: updateData,
    });
}