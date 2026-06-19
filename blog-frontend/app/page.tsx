"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Post = {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author: { id: number; email: string };
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [myEmail, setMyEmail] = useState("");
  const router = useRouter();

  function loadPosts() {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`)
      .then((res) => res.json())
      .then((data: Post[]) => setPosts(data));
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
    loadPosts();

    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setMyEmail(data.message.replace("Logged in as ", "")));
    }
  }, []);

  async function handleDelete(id: number) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 403) {
      alert("Not your post");
      return;
    }
    if (!res.ok) {
      alert("Failed to delete");
      return;
    }
    loadPosts();
  }

  function logout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setMyEmail("");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Blog</h1>
          <div className="flex gap-2">
            {loggedIn ? (
              <>
                <button onClick={() => router.push("/create")} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                  New Post
                </button>
                <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => router.push("/login")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                  Login
                </button>
                <button onClick={() => router.push("/register")} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                  Register
                </button>
              </>
            )}
          </div>
        </div>

        {posts.map((post) => (
          <article key={post.id} className="bg-gray-800 p-6 rounded-lg shadow mb-4">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              {loggedIn && post.author.email === myEmail && (
                <div className="flex gap-2 ml-4">
                  <button onClick={() => router.push(`/edit/${post.id}`)} className="text-blue-400 hover:text-blue-300 text-sm">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="text-red-400 hover:text-red-300 text-sm">
                    Delete
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-300 mt-2">{post.content}</p>
            <small className="text-gray-500">By {post.author.email}</small>
          </article>
        ))}
      </div>
    </div>
  );
}