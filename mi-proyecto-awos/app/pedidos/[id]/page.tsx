"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

export default function PedidoDetallePage() {
  const params = useParams();
  const router = useRouter();

  const [order, setOrder]       = useState<Order | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  const [editando, setEditando]       = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [guardando, setGuardando]     = useState(false);

  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/api/v1/orders/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error("No encontrado");
        return res.json();
      })
      .then(data => { setOrder(data); setLoading(false); })
      .catch(() => { setError("Pedido no encontrado."); setLoading(false); });
  }, [params.id]);

  const guardarEstado = async () => {
    if (!nuevoEstado || !order) return;
    setGuardando(true);
    const res = await fetch(`http://localhost:3001/api/v1/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nuevoEstado })
    });
    const data = await res.json();
    if (res.ok) {
      setOrder({ ...order, status: data.status });
      setEditando(false);
    } else {
      alert(data.message);
    }
    setGuardando(false);
  };

  const eliminarPedido = async () => {
    if (!order) return;
    if (!confirm(`¿Eliminar el pedido #${order.id}? Esta acción no se puede deshacer.`)) return;
    setEliminando(true);
    const res = await fetch(`http://localhost:3001/api/v1/orders/${order.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/pedidos");
    } else {
      alert("Error al eliminar el pedido.");
      setEliminando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">

        <button onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-800 mb-6 flex items-center gap-1 transition">
          ← Volver a pedidos
        </button>

        {loading && <p className="text-center py-20 text-gray-400">Cargando...</p>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>}

        {order && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">

            {/* Encabezado */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black text-gray-900">Pedido #{order.id}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${getEstadoStyle(order.status).bg}`}>
                {getEstadoStyle(order.status).label}
              </span>
            </div>

            <hr className="border-gray-100" />

            {/* Productos */}
            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Productos</h2>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-gray-700">
                    <span>Producto #{item.productId} × {item.quantity}</span>
                    <span className="font-semibold">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-black text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Cambiar estado */}
            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Estado del pedido</h2>
              {editando ? (
                <div className="flex items-center gap-3 flex-wrap">
                  <select value={nuevoEstado} onChange={e => setNuevoEstado(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Selecciona un estado...</option>
                    {ESTADOS.map(e => (
                      <option key={e} value={e}>{getEstadoStyle(e).label}</option>
                    ))}
                  </select>
                  <button onClick={guardarEstado} disabled={guardando || !nuevoEstado}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition disabled:opacity-50">
                    {guardando ? "Guardando..." : "Confirmar"}
                  </button>
                  <button onClick={() => setEditando(false)}
                    className="text-gray-400 hover:text-gray-700 text-sm transition">
                    Cancelar
                  </button>
                </div>
              ) : (
                <button onClick={() => { setEditando(true); setNuevoEstado(order.status); }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-semibold transition">
                  ✏️ Cambiar estado
                </button>
              )}
            </div>

            <hr className="border-gray-100" />

            {/* Eliminar pedido */}
            <div>
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Zona de peligro</h2>
              <button onClick={eliminarPedido} disabled={eliminando}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm px-4 py-2 rounded-xl border border-red-200 transition disabled:opacity-50">
                {eliminando ? "Eliminando..." : "🗑 Eliminar pedido"}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
