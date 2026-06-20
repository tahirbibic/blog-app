"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

type Post = {
  id: number;
  title: string;
  content: string;
  author: { id: number; username: string; email: string };
  created_at: string;
};

type Comment = {
  id: number;
  content: string;
  post_id: number;
  author_id: number;
  author: { id: number; username: string; email: string };
  created_at: string;
};

export default function PostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [myEmail, setMyEmail] = useState("");
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  function loadComments() {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}/comments`)
      .then((res) => res.json())
      .then((data: Comment[]) => setComments(data));
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`)
      .then((res) => res.json())
      .then((data: Post) => setPost(data));

    loadComments();

    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setMyEmail(data.message.replace("Logged in as ", "")));
    }
  }, [id]);

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: newComment }),
    });

    if (res.ok) {
      setNewComment("");
      loadComments();
    }
  }

  async function handleDeleteComment(commentId: number) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) loadComments();
  }

  if (!post) return <div className="min-h-screen bg-gray-900 text-gray-100 p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.push("/")} className="text-blue-400 hover:underline mb-4">
          ← Back
        </button>

        <article className="bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <p className="text-gray-300 mt-4">{post.content}</p>
          <small className="text-gray-500 block mt-4">By {post.author.username}</small>
        </article>

        <h2 className="text-xl font-semibold mb-4">Comments</h2>

        {loggedIn && (
          <form onSubmit={handleComment} className="mb-6">
            <textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Post comment
            </button>
          </form>
        )}

        {comments.length === 0 && <p className="text-gray-500">No comments yet.</p>}

        {comments.map((c) => (
          <div key={c.id} className="bg-gray-800 p-4 rounded mb-3">
            <p className="text-gray-200">{c.content}</p>
            <div className="flex justify-between items-center mt-1">
              <small className="text-gray-500">
                {c.author.username} · {new Date(c.created_at).toLocaleString()}
              </small>
              {loggedIn && c.author.email === myEmail && (
                <button
                  onClick={() => handleDeleteComment(c.id)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}