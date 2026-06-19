"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

function getRoleBadge(role: string) {
  return role === "admin"
    ? "bg-purple-100 text-purple-700"
    : "bg-blue-100 text-blue-700";
}

export default function UsuariosPage() {
  const [users, setUsers]     = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/api/v1/users")
      .then(res => {
        if (!res.ok) throw new Error("Error");
        return res.json();
      })
      .then(data => { setUsers(data); setLoading(false); })
      .catch(() => { setError("No se pudo conectar con la API."); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900">👤 Usuarios</h1>
            <p className="text-gray-500 mt-1">Lista de todos los usuarios registrados</p>
          </div>
          <Link href="/registro"
            className="bg-[#0f111a] hover:bg-gray-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition">
            + Nuevo usuario
          </Link>
        </div>

        {loading && <p className="text-center py-20 text-gray-400">Cargando usuarios...</p>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>}

        {!loading && !error && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500">ID</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500">Nombre</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500">Correo</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500">Rol</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-500">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-gray-400">#{user.id}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-black">
                          {user.name.charAt(0)}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/usuarios/${user.id}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-xs">
                        Ver →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-16 text-gray-400">No hay usuarios registrados.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
