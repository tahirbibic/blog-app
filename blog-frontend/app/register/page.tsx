"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const regRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, pw }),
    });

    if (!regRes.ok) {
      const data = await regRes.json();
      const msg = Array.isArray(data.detail) ? data.detail[0].msg : "Registration failed";
      setError(msg);
      return;
    }

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", pw);

    const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    if (!loginRes.ok) {
      setError("Registered, but auto-login failed. Try logging in.");
      return;
    }

    const data = await loginRes.json();
    localStorage.setItem("token", data.access_token);
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <form onSubmit={handleRegister} className="bg-gray-800 p-8 rounded-lg shadow-lg w-80">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
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
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded text-gray-100"
        />
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded mb-4">
          Sign up
        </button>
        <p className="text-center text-sm text-gray-400">
          Have an account?{" "}
          <button type="button" onClick={() => router.push("/login")} className="text-blue-400 hover:underline">
            Login
          </button>
        </p>
      </form>
    </div>
  );
}