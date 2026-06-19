"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    if (!res.ok) {
      setError("Wrong email or password");
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-lg w-80">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded text-gray-100"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded text-gray-100"
        />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mb-4">
          Log in
        </button>
        <p className="text-center text-sm text-gray-400">
          No account?{" "}
          <button type="button" onClick={() => router.push("/register")} className="text-blue-400 hover:underline">
            Register
          </button>
        </p>
      </form>
    </div>
  );
}