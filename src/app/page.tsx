"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Credenciales inválidas");
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.token && data.user) {
        login(data.user, data.token);
        // Redirigir según el tipo de usuario
        if (data.user.tipo_usuario === "portero") {
          router.push("/porteria");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError("Respuesta inválida del servidor");
      }
      setLoading(false);
    } catch {
      setError("Error de conexión con el servidor");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 py-8">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Iniciar sesión</h1>
          <p className="text-gray-500 text-sm">Accede a la plataforma</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="tucorreo@email.com"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          {error && <div className="text-red-600 text-sm text-center font-semibold">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-60 mt-2"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
