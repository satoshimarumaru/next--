// components/posts/PostForm.tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { postSchema } from "@/lib/validations"
import { useForm } from "react-hook-form"


interface PostFormData {
    title: string
    content: string
}

interface PostFormProps {
    initialData?: PostFormData
    onSubmit: (data: PostFormData) => Promise<void>
    isLoading?: boolean
}

export function PostForm({
    initialData,
    onSubmit,
    isLoading = false
}: PostFormProps) {
    const {
    register,
    handleSubmit,
    formState: { errors }
    } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: initialData,
    mode: "onChange"
    })

    

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
            <label htmlFor="title" className="block text-sm font-medium">
            タイトル
            </label>
        <input
            {...register("title")}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300"
        />
        {errors.title && (
            <p className="text-red-600 text-sm">{errors.title.message}</p>
        )}
        </div>

        <div>
        <label htmlFor="content" className="block text-sm font-medium">
            本文
        </label>
        <textarea
            {...register("content")}
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300"
        />
        {errors.content && (
            <p className="text-red-600 text-sm">{errors.content.message}</p>
        )}
        </div>

        <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
        {isLoading ? "送信中..." : "投稿する"}
        </button>
    </form>
    )
}
