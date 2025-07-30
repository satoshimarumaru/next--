"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { updateProfile } from "../../../../functions/updateProfile";
import { useState } from "react";

export default function ProfileEditConfirmPage() {
    const params = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState("");

    const name = params.get("name") ?? "";
    const email = params.get("email") ?? "";
    const password = params.get("password") ?? "";

    const handleSubmit = async (formData: FormData) => {
        setError("");
        try {
            await updateProfile(formData);
            router.push("/dashboard/profile");
        } catch (err: any) {
            setError(err.message ?? "更新に失敗しました");
        }
    };

    return (
        <form action={handleSubmit} className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow text-center">
            <h1 className="text-2xl font-bold mb-6">プロフィール編集内容の確認</h1>
            <div className="mb-4">名前: {name}</div>
            <div className="mb-4">メールアドレス: {email}</div>
            <div className="mb-4">新しいパスワード: {password ? "●●●●●" : "(変更なし)"}</div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <input type="hidden" name="name" value={name} />
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="password" value={password} />
            <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded"
            >
                この内容で更新
            </button>
            <button
                type="button"
                onClick={() => router.back()}
                className="w-full mt-2 bg-gray-300 text-gray-700 font-semibold py-2 rounded"
            >
                戻る
            </button>
        </form>
    );
}