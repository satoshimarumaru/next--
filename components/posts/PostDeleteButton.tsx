"use client";

export function PostDeleteButton() {
  return (
    <button
      type="submit"
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      onClick={(e) => {
        if (!confirm("本当に削除しますか？")) {
          e.preventDefault();
        }
      }}
    >
      削除
    </button>
  );
}