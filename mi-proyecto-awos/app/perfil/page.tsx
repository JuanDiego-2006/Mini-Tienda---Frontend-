"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function PerfilPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [name, setName]       = useState(user?.name || "");
  const [email, setEmail]     = useState(user?.email || "");
  const [phone, setPhone]     = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("¡Datos actualizados con éxito!");
    }, 1000);
  };

  if (!user) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-gray-500">Verificando sesión...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8">Mi cuenta</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-3xl text-white font-black mb-4 shadow-md">
                {user.name ? user.name.charAt(0) : "U"}
              </div>
              <h2 className="font-bold text-lg">{user.name}</h2>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <nav className="flex flex-col">
                <Link href="/perfil" className="px-6 py-4 bg-[#0f111a] text-white text-sm font-semibold flex items-center gap-3">
                  <span className="text-lg">👤</span> Mi perfil
                </Link>
                <Link href="/envios" className="px-6 py-4 text-gray-700 hover:bg-gray-50 border-t border-gray-100 text-sm font-medium flex items-center gap-3 transition">
                  <span className="text-lg">📦</span> Mis envíos
                </Link>
                <Link href="/pagos" className="px-6 py-4 text-gray-700 hover:bg-gray-50 border-t border-gray-100 text-sm font-medium flex items-center gap-3 transition">
                  <span className="text-lg">💳</span> Mis pagos
                </Link>
                <button onClick={handleLogout}
                  className="px-6 py-4 text-red-600 hover:bg-red-50 border-t border-gray-100 text-sm font-bold flex items-center gap-3 transition text-left w-full">
                  <span className="text-lg">🚪</span> Cerrar sesión
                </button>
              </nav>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
              <div className="mb-8">
                <h2 className="text-xl font-bold">Configuración de la cuenta</h2>
                <p className="text-sm text-gray-500 mt-1">Actualiza tu información personal y dirección de envío.</p>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2" htmlFor="name">Nombre completo</label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-transparent focus:border-gray-300 focus:bg-white rounded-xl outline-none transition text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" htmlFor="email">Correo electrónico</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-transparent focus:border-gray-300 focus:bg-white rounded-xl outline-none transition text-sm text-gray-500"
                      disabled required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" htmlFor="phone">Teléfono</label>
                    <input id="phone" type="tel" placeholder="+52 000 000 0000" value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-transparent focus:border-gray-300 focus:bg-white rounded-xl outline-none transition text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" htmlFor="address">Dirección de envío</label>
                  <textarea id="address" rows={3} placeholder="Calle, número, colonia, código postal, ciudad, estado"
                    value={address} onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-transparent focus:border-gray-300 focus:bg-white rounded-xl outline-none transition text-sm resize-none"></textarea>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={saving}
                    className="bg-[#0f111a] hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-xl transition disabled:opacity-50 text-sm">
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
