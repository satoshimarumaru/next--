import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, createdAt: true },
  });

  if (!user) return <div>ユーザー情報が見つかりません。</div>;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">プロフィール</h1>
      <div className="mb-4">
        <div className="font-semibold">名前</div>
        <div>{user.name}</div>
      </div>
      <div className="mb-4">
        <div className="font-semibold">メールアドレス</div>
        <div>{user.email}</div>
      </div>
      <div className="mb-4">
        <div className="font-semibold">登録日</div>
        <div>{new Date(user.createdAt).toLocaleDateString()}</div>
      </div>
      <Link
        href="/dashboard/profile/edit"
        className="inline-block bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        編集する
      </Link>
    </div>
  );
}