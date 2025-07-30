"use server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function createResponse(postId: string, content: string): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!content || !session?.user?.id) {
    throw new Error("認証エラーまたは内容が空です");
  }
  await prisma.response.create({
    data: {
      content,
      postId,
      authorId: session.user.id,
    },
  });
}