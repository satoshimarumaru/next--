"use client";
import React, { useState } from 'react';
import { loginSchema } from '@/lib/validations';
import { signIn } from "next-auth/react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

type FormData = z.infer<typeof loginSchema>;

const Page = () => {
    const [error, setError] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: FormData) => {
        setError(""); 
        try {
            const signInRes = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (signInRes?.error) {
                setError("認証に失敗しました");
            } else {
                window.location.href = "/dashboard/posts";
            }
        } catch (error) {
            setError("予期せぬエラーが発生し、認証に失敗しました");
        }
    };

    return (
        <div className="mt-20">
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto mt-4 p-6 border rounded flex flex-col gap-4">
                <div className='text-center text-2xl font-bold '>ログイン</div>
                {error && <p className="text-red-500 text-center font-bold text-xl mt-4">{error}</p>}
                <input
                    type="email"
                    {...register("email")}
                    placeholder="メールアドレス"
                    className="border p-2 rounded"
                    required
                />
                {errors.email && <div className="text-red-500 text-sm">{errors.email.message}</div>}
                <input
                    type="password"
                    {...register("password")}
                    placeholder="パスワード"
                    className="border p-2 rounded"
                    required
                />
                {errors.password && <div className="text-red-500 text-sm">{errors.password.message}</div>}
                <button type="submit" className='bg-blue-500 text-white p-2 rounded'>ログイン</button>
                <a href="/register" className="text-blue-600 hover:underline text-center">新規登録</a>
            </form>
        </div>
    );
};

export default Page;