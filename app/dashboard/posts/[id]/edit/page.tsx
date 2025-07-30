import React from "react";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface EditPageProps {
    params: { id: string };
}

export default async function EditPage(props: EditPageProps) {
  // paramsをawaitして取得
    const params = await props.params;
    const id = params.id;
    console.log("PostDetailPage id:", id);

    const session = await getServerSession(authOptions);
    const post = await prisma.post.findUnique({
    where: { id, isDeleted: false },
    select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        author: { select: { id: true, name: true } },
        authorId: true,
    },
    });

    console.log("post:", post);

    if (!post) return notFound();
    if (session?.user?.id !== post.authorId) redirect("/dashboard/posts");

  // サーバーアクション
    async function handleUpdate(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    await prisma.post.update({
        where: { id },
        data: { title, content },
    });
    redirect(`/dashboard/posts/${id}`);
    }

    return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6">投稿を編集</h1>
        <form action={handleUpdate} className="space-y-6">
        <div>
            <label htmlFor="title" className="block font-semibold mb-1">タイトル</label>
            <input
            id="title"
            name="title"
            type="text"
            defaultValue={post.title}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
            />
        </div>
        <div>
            <label htmlFor="content" className="block font-semibold mb-1">内容</label>
            <textarea
            id="content"
            name="content"
            rows={8}
            defaultValue={post.content}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
            />
        </div>
        <button
            type="submit"
            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 rounded transition"
        >
            更新する
        </button>
        </form>
    </div>
    );
}

