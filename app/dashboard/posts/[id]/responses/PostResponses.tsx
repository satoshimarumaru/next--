import { prisma } from "@/lib/db";

interface PostResponsesProps {
  postId: string;
}

export default async function PostResponses({ postId }: PostResponsesProps) {
  const responses = await prisma.response.findMany({
    where: { postId, isDeleted: false },
    include: { author: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mt-8">
      <h2 className="font-bold mb-2">コメント</h2>
      <ul className="space-y-4">
        {responses.length === 0 ? (
          <div className="text-gray-500">まだコメントはありません。</div>
        ) : (
          responses.map((res) => (
            <li key={res.id} className="border-t pt-2">
              <div className="text-sm text-gray-700">
                {res.author?.name ?? "名無し"} ／ {new Date(res.createdAt).toLocaleString()}
              </div>
              <div>{res.content}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}