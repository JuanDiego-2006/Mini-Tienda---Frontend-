"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3001/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Credenciales incorrectas.");
        setLoading(false);
        return;
      }

      login({ name: data.name, email, role: data.role });
      router.push("/productos");
    } catch {
      setError("No se pudo conectar con el servidor.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans text-gray-900">

      <div className="flex items-center gap-2 mb-8">
        <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h1 className="text-2xl font-black tracking-tight">MiniTienda</h1>
      </div>

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold mb-1">Iniciar sesión</h2>
        <p className="text-sm text-gray-500 mb-6">Ingresa tus credenciales para continuar</p>

        {/* Mensaje de error de la API */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="email">Correo electrónico</label>
            <input id="email" type="email" placeholder="usuario@ejemplo.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-gray-300 focus:bg-white rounded-xl outline-none transition text-sm" required />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="password">Contraseña</label>
            <div className="relative">
              <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-gray-300 focus:bg-white rounded-xl outline-none transition text-sm" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#0a0c10] hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition mt-2 text-sm disabled:opacity-50">
            {loading ? "Entrando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿No tienes cuenta? <Link href="/registro" className="text-black font-bold hover:underline">Regístrate aquí</Link>
        </p>

        {/* Credenciales de prueba */}
        <div className="mt-6 p-3 bg-gray-50 rounded-xl text-xs text-gray-400 text-center">
          <p className="font-semibold mb-1">Cuentas de prueba:</p>
          <p>admin@papeleria.com / admin123</p>
          <p>juan@papeleria.com / juan123</p>
        </div>
      </div>
    </div>
  );
}
