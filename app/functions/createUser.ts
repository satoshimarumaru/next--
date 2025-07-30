"use server";

import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function createUser(formData: FormData): Promise<void> {
    const name = formData.get("name") as string | null;
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    const result = registerSchema.safeParse({ name, email, password });
    if (!result.success) {
        return;
    }

    const existingEmail = await prisma.user.findUnique({
        where: { email: result.data.email }
    });
    if (existingEmail) {
        throw new Error("このメールアドレスは既に登録されています");
    }

    const hashedPassword = bcrypt.hashSync(result.data.password, 10);

    await prisma.user.create({
        data: {
            name: result.data.name,
            email: result.data.email,
            password: hashedPassword,
        },
    });
}


