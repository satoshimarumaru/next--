"use client";

import React, { useState } from 'react';
import { registerSchema } from '@/lib/validations';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUser } from '@/app/functions/createUser';
import { z } from 'zod';
import { useRouter } from 'next/navigation';


type RegisterForm = z.infer<typeof registerSchema>;

const Page = () => {
    const router = useRouter();
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        mode: "onChange"
    });

    const onSubmit = async (data: RegisterForm) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);

    try {
        await createUser(formData);
        setError(""); 
        router.push(`/register/confirm?name=${encodeURIComponent(data.name)}&email=${encodeURIComponent(data.email)}&password=${encodeURIComponent(data.password)}`);
    } catch (e: any) {
        setError(e.message || "登録に失敗しました");
    }
};

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto mt-20 p-6 border rounded flex flex-col gap-4">
                <div className='text-center text-2xl font-bold '>ユーザー登録</div>
                <input
                    type="text"
                    {...register("name")}
                    placeholder="名前"
                    className="border p-2 rounded"
                    required
                />
                {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}
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
                {error && <div className="text-red-600 text-sm font-bold">{error}</div>}
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">登録する</button>
            </form>
        </div>
    );
};

export default Page;



