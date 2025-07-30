"use client";
import React, { useState } from 'react';
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const ConfirmPage = () => {
    const params = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState("");

    const name = params.get("name");
    const email = params.get("email");
    const password = params.get("password");

    const handleLogin = async () => {
    const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
    });
    if (res?.error) {
        setError("ログインに失敗しました");
    } else {
        router.push("/dashboard/posts");
    }
    };

    return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded text-center">
        <h2 className="text-2xl font-bold mb-4">登録内容の確認</h2>
        <div>名前: {name}</div>
        <div>メール: {email}</div>
        <button
        onClick={handleLogin}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
        >
        ログインしてはじめる
        </button>
        {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
    );
};

export default ConfirmPage;
