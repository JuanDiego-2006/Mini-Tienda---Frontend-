"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface OrderItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: number;
  userId: number;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

const ESTADOS = ["pending", "shipped", "delivered", "cancelled"];

function getEstadoStyle(status: string) {
  switch (status) {
    case "pending":   return { bg: "bg-yellow-100 text-yellow-700", label: "Pendiente" };
    case "shipped":   return { bg: "bg-blue-100 text-blue-700",     label: "En camino" };
    case "delivered": return { bg: "bg-green-100 text-green-700",   label: "Entregado" };
    case "cancelled": return { bg: "bg-red-100 text-red-700",       label: "Cancelado" };
    default:          return { bg: "bg-gray-100 text-gray-600",     label: status };
  }
}

export default function PedidosPage() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const [editingId, setEditingId]       = useState<number | null>(null);
  const [nuevoEstado, setNuevoEstado]   = useState("");
  const [guardando, setGuardando]       = useState(false);
  const [mensajeOk, setMensajeOk]       = useState<number | null>(null); // id del pedido actualizado

  useEffect(() => {
    fetch("http://localhost:3001/api/v1/orders")
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar pedidos");
        return res.json();
      })
      .then(data => { setOrders(data); setLoading(false); })
      .catch(() => { setError("No se pudo conectar con la API."); setLoading(false); });
  }, []);

  const guardarEstado = async (id: number) => {
    if (!nuevoEstado) return;
    setGuardando(true);

    try {
      const res = await fetch(`http://localhost:3001/api/v1/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nuevoEstado })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Estado inválido");
        setGuardando(false);
        return;
      }

      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: data.status } : o));
      setMensajeOk(id);
      setTimeout(() => setMensajeOk(null), 2500); 
    } catch {
      alert("Error al actualizar el estado.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* ── Encabezado ── */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Mis Pedidos</h1>
            <p className="text-gray-500 mt-1">Consulta y actualiza el estado de tus órdenes</p>
          </div>
          <Link href="/carrito"
            className="bg-[#0f111a] hover:bg-gray-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition">
            + Nuevo pedido
          </Link>
        </div>

        {loading && <p className="text-center py-20 text-gray-400">Cargando pedidos...</p>}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>
        )}

        {/* ── Lista de pedidos ── */}
        {!loading && !error && (
          <div className="space-y-4">
            {orders.map(order => {
              const estilo = getEstadoStyle(order.status);
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                  {/* Fila superior: ID, fecha, total, estado */}
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 font-mono">Pedido #{order.id}</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("es-MX", {
                          year: "numeric", month: "long", day: "numeric"
                        })}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-xl font-black text-gray-900">${order.total.toFixed(2)}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${estilo.bg}`}>
                        {estilo.label}
                      </span>
                      <Link href={`/pedidos/${order.id}`}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition">
                        Ver detalle →
                      </Link>
                    </div>
                  </div>

                  {/* Items del pedido */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Productos</p>
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm text-gray-700 py-1">
                        <span>Producto #{item.productId} × {item.quantity}</span>
                        <span className="font-semibold">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* ── Sección de cambio de estado ── */}
                  {mensajeOk === order.id && (
                    <p className="text-green-600 text-sm font-semibold mb-3">
                      ✓ Estado actualizado correctamente
                    </p>
                  )}

                  {editingId === order.id ? (
                    <div className="flex items-center gap-3 flex-wrap">
                      <select
                        value={nuevoEstado}
                        onChange={e => setNuevoEstado(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecciona un estado...</option>
                        {ESTADOS.map(e => (
                          <option key={e} value={e}>{getEstadoStyle(e).label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => guardarEstado(order.id)}
                        disabled={guardando || !nuevoEstado}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition disabled:opacity-50"
                      >
                        {guardando ? "Guardando..." : "Confirmar"}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-400 hover:text-gray-700 text-sm font-semibold transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingId(order.id); setNuevoEstado(order.status); }}
                      className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition"
                    >
                      ✏️ Cambiar estado
                    </button>
                  )}

                </div>
              );
            })}

            {orders.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-lg mb-4">No tienes pedidos aún.</p>
                <Link href="/carrito" className="text-blue-600 font-bold hover:underline">
                  Ir al carrito →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
