"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validations";
import { z } from "zod";

type ProfileForm = z.infer<typeof registerSchema>;

export default function ProfileEditPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<ProfileForm>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    });

    // セッション取得後に初期値をセット
    useEffect(() => {
        if (session?.user) {
            setValue("name", session.user.name ?? "");
            setValue("email", session.user.email ?? "");
        }
    }, [session, setValue]);

    const onSubmit = (data: ProfileForm) => {
        setError("");
        router.push(
            `/dashboard/profile/edit/confirm?name=${encodeURIComponent(data.name)}&email=${encodeURIComponent(data.email)}&password=${encodeURIComponent(data.password)}`
        );
    };

    if (!session) return <div>読み込み中...</div>;

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-6">プロフィール編集</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block font-semibold mb-1">名前</label>
                    <input
                        id="name"
                        type="text"
                        {...register("name")}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                    />
                    {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}
                </div>
                <div>
                    <label htmlFor="email" className="block font-semibold mb-1">メールアドレス</label>
                    <input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        required
                    />
                    {errors.email && <div className="text-red-500 text-sm">{errors.email.message}</div>}
                </div>
                <div>
                    <label htmlFor="password" className="block font-semibold mb-1">新しいパスワード</label>
                    <input
                        id="password"
                        type="password"
                        {...register("password")}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="新しいパスワードを入力してください"
                    />
                    {errors.password && <div className="text-red-500 text-sm">{errors.password.message}</div>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded"
                >
                    確認画面へ
                </button>
            </form>
        </div>
    );
}