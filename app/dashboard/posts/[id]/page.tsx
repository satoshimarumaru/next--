import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PostDeleteButton } from "@/components/posts/PostDeleteButton";
import Link from "next/link";
import PostResponses from "./responses/PostResponses";
import ResponseForm from "./responses/ResponseForm";

interface PostDetailPageProps {
    params: { id: string };
}

export default async function PostDetailPage(props: PostDetailPageProps) {
    const params =  props.params;
    const id = params.id;

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

    if (!post) return notFound();

    const isAuthor = session?.user?.id === post.authorId;

    // サーバーアクション
    async function handleDelete() {
        "use server";
        await prisma.post.update({
            where: { id },
            data: { isDeleted: true },
        });
        redirect("/dashboard/posts");
    }

    return (
        <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <div className="text-gray-600 text-sm mb-4">
                {post.author?.name ?? "名無し"} ／ {new Date(post.createdAt).toLocaleString()}
            </div>
            <div className="text-gray-800 whitespace-pre-line mb-4">{post.content}</div>
            {isAuthor && (
                <div className="flex gap-4 mt-6">
                    <Link
                        href={`/dashboard/posts/${post.id}/edit`}
                        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
                    >
                        編集
                    </Link>
                    <form action={handleDelete}>
                        <PostDeleteButton />
                    </form>
                </div>
            )}

            {/* コメント一覧 */}
            <PostResponses postId={post.id} />

            {/* コメント投稿フォーム */}
            <ResponseForm postId={post.id} />
        </div>
    );
}