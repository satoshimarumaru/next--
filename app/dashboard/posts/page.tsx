import React from 'react';
import { prisma } from "@/lib/db";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';

interface PostsPageProps {
    searchParams?: {
        page?: string;
    };
}

const PAGE_SIZE = 10;

export default async function Page(props : PostsPageProps) {

    const {searchParams} = await props;
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/login");
    }


    const page = Number(searchParams?.page) > 0 ? Number(searchParams?.page) : 1;
    const skip = (page - 1) * PAGE_SIZE;

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where: { isDeleted: false },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                author: {
                    select: {
                        name: true,
                    },
                },
            },
            skip,
            take: PAGE_SIZE,
        }),
        prisma.post.count({ where: { isDeleted: false } }),
    ]);

    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <div className="max-w-2xl mx-auto p-6 mt-15 ">
            <h1 className="text-2xl font-bold mb-6">投稿一覧</h1>
            <ul className="space-y-4 ">
                {posts.map((post) => (
                    <li key={post.id} className="p-4 bg-white rounded shadow hover:scale-103 transition-transform">
                        <div className="flex items-center gap-2 font-semibold text-lg">
                            <span>
                                <Link href={`/dashboard/posts/${post.id}`} className="hover:underline">
                                    {post.title}
                                </Link>
                            </span>
                            <span className="text-sm text-gray-700 font-normal">
                                {post.author?.name ?? "名無し"}
                            </span>
                        </div>
                        <div className="text-gray-600 text-sm mb-2">
                            {new Date(post.createdAt).toLocaleString()}
                        </div>
                        <div className="text-gray-800">{post.content}</div>
                    </li>
                ))}
            </ul>
            <div className="flex justify-center gap-2 mt-8">
                <Link
                    href={`/dashboard/posts?page=${page - 1}`}
                    className={`px-4 py-2 rounded ${page <= 1 ? "bg-gray-200 text-gray-400 pointer-events-none" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                >
                    前へ
                </Link>
                <span className="px-4 py-2">{page} / {totalPages}</span>
                <Link
                    href={`/dashboard/posts?page=${page + 1}`}
                    className={`px-4 py-2 rounded ${page >= totalPages ? "bg-gray-200 text-gray-400 pointer-events-none" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                >
                    次へ
                </Link>
            </div>
        </div>
    );
}