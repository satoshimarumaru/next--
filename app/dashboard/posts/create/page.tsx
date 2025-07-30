"use client"

import React, { useState } from 'react'
import { createPost } from '@/app/functions/createPost'
import { zodResolver } from "@hookform/resolvers/zod"
import { postSchema } from "@/lib/validations"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import Link from 'next/link'


interface PostFormData {
    title: string
    content: string
}

const Page = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<PostFormData>({
        resolver: zodResolver(postSchema),
        mode: "onChange"
    });

    const onSubmit = async (data: PostFormData) => {
        setIsLoading(true);
        try {
            await createPost(data);
            console.log("投稿が成功しました", data, isLoading);
            router.push("/dashboard/posts"); // 投稿後にリダイレクト
        } catch (e) {
            console.error("投稿エラー", e);
            alert("投稿に失敗しました");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow space-y-6 mt-20"
        >
            <h2 className="text-2xl font-bold mb-4 text-center">新規投稿</h2>

            <div>
                <label htmlFor="title" className="block text-sm font-semibold mb-1">
                    タイトル
                </label>
                <input
                    {...register("title")}
                    type="text"
                    id="title"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    placeholder="タイトルを入力"
                />
                {errors.title && (
                    <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-semibold mb-1">
                    本文
                </label>
                <textarea
                    {...register("content")}
                    id="content"
                    rows={6}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    placeholder="本文を入力"
                />
                {errors.content && (
                    <p className="text-red-600 text-sm mt-1">{errors.content.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
            >
                {isLoading ? "送信中..." : "投稿する"}
            </button>
        </form>
    );
};

export default Page
