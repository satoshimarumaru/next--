"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { createResponse } from "@/app/functions/createResponse";
import { responseSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ResponseFormProps {
  postId: string;
}
type ResponseFormData = z.infer<typeof responseSchema>;

export default function ResponseForm({ postId }: ResponseFormProps) {
  const { data: session, status } = useSession();
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResponseFormData>({
    resolver: zodResolver(responseSchema),
  });

  if (status === "loading") return <div>読み込み中...</div>;
  if (!session) return <div>コメントするにはログインしてください。</div>;

  const onSubmit = async (data: ResponseFormData) => {
    try {
      await createResponse(postId, data.content);
      reset();
      formRef.current?.reset();
    } catch (e: any) {
      alert(e.message ?? "エラーが発生しました");
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="mt-8 space-y-2"
    >
      <textarea
        {...register("content")}
        className="w-full border rounded px-3 py-2"
        rows={3}
        placeholder="コメントを入力"
      />
      {errors.content && (
        <div className="text-red-500 text-sm">{errors.content.message}</div>
      )}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
        disabled={isSubmitting}
      >
        コメントする
      </button>
    </form>
  );
}