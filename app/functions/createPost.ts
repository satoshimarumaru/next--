"use server";

import { prisma } from "@/lib/db";
import { postSchema } from "@/lib/validations";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // 認証設定のパスはプロジェクトに合わせて修正

export async function createPost(data: { title: string; content: string }) {
  // サーバー側でセッション取得
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) {
    throw new Error("ログインが必要です");
  }

  const { title, content } = data;

  const result = postSchema.safeParse({ title, content });
  if (!result.success || !title || !content) {
    throw new Error("バリデーションエラー");
  }

  await prisma.post.create({
    data: {
      title,
      content,
      authorId: session.user.id,
    },
  });
}
