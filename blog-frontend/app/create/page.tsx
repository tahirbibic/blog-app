"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      setError("Failed to create post");
      return;
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <form onSubmit={handleCreate} className="max-w-xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Create Post</h1>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded text-gray-100"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded text-gray-100"
        />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
          Publish
        </button>
      </form>
    </div>
  );
}