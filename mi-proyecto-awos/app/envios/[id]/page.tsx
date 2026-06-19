"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Shipping {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  userName: string;
  direccion: string;
  telefono: string;
  referencia: string;
  empresa: string;
  guia: string;
  fechaEstimada: string;
  status: string;
}

const ESTADOS = ["pendiente", "En camino", "Entregado"];

function getBadgeColor(status: string) {
  if (status === "Entregado") return "bg-green-100 text-green-700";
  if (status === "En camino") return "bg-blue-100 text-blue-700";
  return "bg-yellow-100 text-yellow-700";
}

export default function EnvioDetallePage() {
  const params = useParams();
  const router = useRouter();

  const [envio, setEnvio]     = useState<Shipping | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const [editando, setEditando]       = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [guardando, setGuardando]     = useState(false);

  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/api/v1/shipping/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No encontrado");
        return res.json();
      })
      .then((data) => { setEnvio(data); setLoading(false); })
      .catch(() => {
        setError("No se encontró el envío o aún no se ha generado una guía.");
        setLoading(false);
      });
  }, [params.id]);

  const guardarEstado = async () => {
    if (!nuevoEstado || !envio) return;
    setGuardando(true);
    try {
      const res = await fetch(`http://localhost:3001/api/v1/shipping/${envio.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nuevoEstado }),
      });
      const data = await res.json();
      if (res.ok) {
        setEnvio({ ...envio, status: data.status });
        setEditando(false);
      } else {
        alert(data.message || "Estado inválido.");
      }
    } catch {
      alert("Error al actualizar el estado.");
    } finally {
      setGuardando(false);
    }
  };

  const eliminarEnvio = async () => {
    if (!envio) return;
    if (!confirm(`¿Eliminar el envío #${envio.id}? Esta acción no se puede deshacer.`)) return;
    setEliminando(true);
    try {
      const res = await fetch(`http://localhost:3001/api/v1/shipping/${envio.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/envios");
      } else {
        alert("Error al eliminar el envío.");
        setEliminando(false);
      }
    } catch {
      alert("No se pudo conectar con la API.");
      setEliminando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Botón volver */}
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1 transition"
        >
          ← Volver a envíos
        </button>

        {loading && <p className="text-gray-400 text-center py-20">Cargando...</p>}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>
        )}

        {envio && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">

            {/* Encabezado */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black text-gray-900">Envío #{envio.id}</h1>
                <p className="text-gray-500 text-sm mt-1">Pedido #{envio.orderId}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${getBadgeColor(envio.status)}`}>
                {envio.status}
              </span>
            </div>

            <hr className="border-gray-100" />

            {/* Producto */}
            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Producto</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">ID Producto</p>
                  <p className="font-semibold text-gray-800">#{envio.productId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Nombre</p>
                  <p className="font-semibold text-gray-800">{envio.productName}</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Destinatario */}
            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Destinatario</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Nombre</p>
                  <p className="font-semibold text-gray-800">{envio.userName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Teléfono</p>
                  <p className="font-semibold text-gray-800">{envio.telefono}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400">Dirección</p>
                  <p className="font-semibold text-gray-800">{envio.direccion}</p>
                </div>
                {envio.referencia && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-400">Referencia</p>
                    <p className="font-semibold text-gray-800">{envio.referencia}</p>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Paquetería */}
            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Paquetería</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Empresa</p>
                  <p className="font-semibold text-gray-800">{envio.empresa}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Guía de rastreo</p>
                  <p className="font-mono font-semibold text-gray-800">{envio.guia}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Fecha estimada</p>
                  <p className="font-semibold text-gray-800">{envio.fechaEstimada}</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Cambiar estado */}
            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Estado del envío</h2>
              {editando ? (
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={nuevoEstado}
                    onChange={(e) => setNuevoEstado(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona un estado...</option>
                    {ESTADOS.map((est) => (
                      <option key={est} value={est}>{est}</option>
                    ))}
                  </select>
                  <button
                    onClick={guardarEstado}
                    disabled={guardando || !nuevoEstado}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition disabled:opacity-50"
                  >
                    {guardando ? "Guardando..." : "Confirmar"}
                  </button>
                  <button
                    onClick={() => setEditando(false)}
                    className="text-gray-400 hover:text-gray-700 text-sm transition"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setEditando(true); setNuevoEstado(envio.status); }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition"
                >
                  ✏️ Cambiar estado
                </button>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* Zona de peligro */}
            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Zona de peligro</h2>
              <button
                onClick={eliminarEnvio}
                disabled={eliminando}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm px-4 py-2 rounded-xl border border-red-200 transition disabled:opacity-50"
              >
                {eliminando ? "Eliminando..." : "🗑 Eliminar envío"}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
