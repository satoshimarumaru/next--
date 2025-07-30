"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { withdrawUser } from "@/app/functions/withdrawUser";

export default function Navbar() {
    const { data: session, status } = useSession();
    console.log(session, status,useSession());

    return ( 
        <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-400 shadow">
            <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-6">
                    <Link href="/" className="hover:underline text-white/90 transition">
                        ホーム
                    </Link>
                    {session && (
                    <Link href="/dashboard/posts" className="hover:underline text-white/90 transition">
                        投稿一覧
                    </Link>
                    )}
                    {session && (
                        <Link href="/dashboard/posts/create" className="hover:underline text-white/90 transition">
                            新規投稿
                        </Link>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    {status === "loading" ? null : session ? (
                        <>
                            <Link href="/dashboard/profile" className="text-sm text-white/80">{ session && (session.user?.name ?? "ユーザー")}</Link>
                            <button
                                onClick={() => signOut()}
                                className="bg-white/90 text-gray-800 px-3 py-1 rounded hover:bg-white"
                            >
                                ログアウト
                            </button>
                            <button
                                onClick={() => {
                                    withdrawUser();
                                    signOut();
                                }}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                退会
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => signIn()}
                            className="bg-white/90 text-gray-800 px-3 py-1 rounded hover:bg-white"
                        >
                            ログイン
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}