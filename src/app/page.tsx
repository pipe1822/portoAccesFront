"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import React from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  // Registro states
  const [regNombre, setRegNombre] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regApto, setRegApto] = useState("");
  const [regTorre, setRegTorre] = useState("");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegisterSuccess(false);
    setRegLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/users/create-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: regNombre,
          email: regEmail,
          password: regPassword,
          apto: regApto,
          torre: regTorre,
          tipo_usuario: "residente"
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setRegError(data.message || "Error al registrar usuario");
        setRegLoading(false);
        return;
      }
      setRegisterSuccess(true);
      setShowRegister(false);
      setRegNombre(""); setRegEmail(""); setRegPassword(""); setRegApto(""); setRegTorre("");
    } catch {
      setRegError("Error de conexión con el servidor");
    }
    setRegLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="bg-gray-900/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-blue-700 rounded-full flex items-center justify-center mb-2 shadow-lg">
            <span className="text-white text-2xl font-bold">A</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-1">
            {showRegister ? "Registro de usuario" : "Iniciar sesión"}
          </h1>
          <p className="text-gray-300 text-sm">
            {showRegister ? "Crea tu cuenta de residente" : "Accede a la plataforma"}
          </p>
        </div>
        {registerSuccess && (
          <div className="text-green-400 text-center font-semibold mb-4">
            ¡Registro exitoso! Ahora puedes iniciar sesión.
          </div>
        )}
        {showRegister ? (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-200">Nombre</label>
              <input
                type="text"
                className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={regNombre}
                onChange={e => setRegNombre(e.target.value)}
                required
                placeholder="Tu nombre completo"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-200">Email</label>
              <input
                type="email"
                className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                required
                placeholder="tucorreo@email.com"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-200">Contraseña</label>
              <input
                type="password"
                className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-200">Apto</label>
              <input
                type="text"
                className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={regApto}
                onChange={e => setRegApto(e.target.value)}
                required
                placeholder="Ej: 101"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-200">Torre</label>
              <input
                type="text"
                className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={regTorre}
                onChange={e => setRegTorre(e.target.value)}
                required
                placeholder="Ej: 1"
              />
            </div>
            {regError && <div className="text-red-400 text-sm text-center font-semibold">{regError}</div>}
            <button
              type="submit"
              className="w-full bg-green-700 text-white font-bold py-2 rounded-lg shadow hover:bg-green-800 transition disabled:opacity-60 mt-2"
              disabled={regLoading}
            >
              {regLoading ? "Registrando..." : "Registrarse"}
            </button>
            <button
              type="button"
              className="w-full mt-2 text-blue-400 hover:underline"
              onClick={() => { setShowRegister(false); setRegError(""); }}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block mb-1 font-medium text-gray-200">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="tucorreo@email.com"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-200">Contraseña</label>
                <input
                  type="password"
                  className="w-full border border-gray-600 bg-gray-800 text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
              </div>
              {error && <div className="text-red-400 text-sm text-center font-semibold">{error}</div>}
              <button
                type="submit"
                className="w-full bg-blue-700 text-white font-bold py-2 rounded-lg shadow hover:bg-blue-800 transition disabled:opacity-60 mt-2"
                disabled={loading}
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </button>
            </form>
            <button
              type="button"
              className="w-full mt-4 text-green-400 hover:underline"
              onClick={() => { setShowRegister(true); setError(""); setRegisterSuccess(false); }}
            >
              ¿No tienes cuenta? Regístrate
            </button>
          </>
        )}
      </div>
    </div>
  );
}
