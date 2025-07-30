"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-black-700">ログイン式掲示板アプリ</h1>
        <p className="mb-8 text-gray-700">アカウントを作成またはログインしてサービスを利用しましょう。</p>
        <div className="flex flex-col gap-4">
          <Link
            href="/register"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded transition"
          >
            新規登録
          </Link>
          <Link
            href="/login"
            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 rounded transition"
          >
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
}
