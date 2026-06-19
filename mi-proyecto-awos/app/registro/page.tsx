"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState("cliente");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3001/api/v1/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al registrar.");
        setLoading(false);
        return;
      }

      router.push("/login");
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
        <h2 className="text-xl font-bold mb-1">Crear cuenta</h2>
        <p className="text-sm text-gray-500 mb-6">Completa los datos para registrarte</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="name">Nombre completo</label>
            <input id="name" type="text" placeholder="Juan Pérez" value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-gray-300 focus:bg-white rounded-xl outline-none transition text-sm" required />
          </div>

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
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="role">Tipo de cuenta</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-gray-300 focus:bg-white rounded-xl outline-none transition text-sm">
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#0a0c10] hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition mt-4 text-sm disabled:opacity-50">
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta? <Link href="/login" className="text-black font-bold hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
