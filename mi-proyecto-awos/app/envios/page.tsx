"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

const ESTADOS = ["pendiente", "En camino", "Entregado"];

function getBadgeColor(status: string) {
  if (status === "Entregado") return "bg-green-100 text-green-700";
  if (status === "En camino") return "bg-blue-100 text-blue-700";
  return "bg-yellow-100 text-yellow-700";
}

const inputCls =
  "w-full px-3 py-2 border border-gray-600 rounded-xl text-sm bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

export default function EnviosPage() {
  const [envios, setEnvios]   = useState<Shipping[]>([]);
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const [editingId, setEditingId]     = useState<number | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [guardando, setGuardando]     = useState(false);
  const [mensajeOk, setMensajeOk]     = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [form, setForm] = useState({
    userName: "", direccion: "", telefono: "",
    referencia: "", empresa: "", guia: "", status: "pendiente",
  });
  const [creando, setCreando]     = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3001/api/v1/shipping").then(r => r.json()),
      fetch("http://localhost:3001/api/v1/orders").then(r => r.json()),
    ])
      .then(([shippingData, ordersData]) => {
        setEnvios(shippingData);
        setOrders(ordersData);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo conectar con la API. ¿Está corriendo en el puerto 3001?");
        setLoading(false);
      });
  }, []);

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const selectedOrder = orders.find(o => String(o.id) === selectedOrderId);

  const guardarEstado = async (id: number) => {
    if (!nuevoEstado) return;
    setGuardando(true);
    try {
      const res = await fetch(`http://localhost:3001/api/v1/shipping/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nuevoEstado }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Estado inválido"); return; }
      setEnvios(prev => prev.map(e => e.id === id ? { ...e, status: data.status } : e));
      setMensajeOk(id);
      setTimeout(() => setMensajeOk(null), 2500);
      setEditingId(null);
    } catch {
      alert("Error al actualizar el estado.");
    } finally {
      setGuardando(false);
    }
  };

  const crearEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!selectedOrder) {
      setFormError("Selecciona un pedido existente.");
      return;
    }

    setCreando(true);
    try {
      const primerItem = selectedOrder.items[0];

      const res = await fetch("http://localhost:3001/api/v1/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId:     selectedOrder.id,
          productId:   primerItem?.productId   ?? 0,
          productName: `Producto #${primerItem?.productId ?? 0}`,
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.message || "Error al crear el envío."); return; }

      setEnvios(prev => [...prev, data]);
      setShowModal(false);
      setSelectedOrderId("");
      setForm({ userName: "", direccion: "", telefono: "",
                referencia: "", empresa: "", guia: "", status: "pendiente" });
    } catch {
      setFormError("No se pudo conectar con la API.");
    } finally {
      setCreando(false);
    }
  };

  const abrirModal = () => {
    setShowModal(true);
    setSelectedOrderId("");
    setFormError("");
    setForm({ userName: "", direccion: "", telefono: "",
              referencia: "", empresa: "", guia: "", status: "pendiente" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Encabezado */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900">📦 Envíos</h1>
            <p className="text-gray-500 mt-1">Seguimiento y gestión de todos los envíos</p>
          </div>
          <button
            onClick={abrirModal}
            className="bg-[#0f111a] hover:bg-gray-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition"
          >
            + Nuevo envío
          </button>
        </div>

        {loading && <div className="text-center py-20 text-gray-400 text-lg">Cargando envíos...</div>}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>
        )}

        {/* Tabla */}
        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">ID</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">Pedido</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">Producto</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">Cliente</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">Empresa</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">Guía</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">Estado</th>
                  <th className="text-left px-5 py-4 font-semibold text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {envios.map((envio) => (
                  <tr key={envio.id} className="border-b border-gray-50 hover:bg-gray-50 transition align-top">
                    <td className="px-5 py-4 font-mono text-gray-400">#{envio.id}</td>
                    <td className="px-5 py-4 font-mono text-gray-500">#{envio.orderId}</td>
                    <td className="px-5 py-4 font-medium text-gray-900">{envio.productName}</td>
                    <td className="px-5 py-4 text-gray-600">{envio.userName}</td>
                    <td className="px-5 py-4 text-gray-600">{envio.empresa}</td>
                    <td className="px-5 py-4 font-mono text-xs text-gray-500">{envio.guia}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(envio.status)}`}>
                        {envio.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        {mensajeOk === envio.id && (
                          <span className="text-green-600 text-xs font-semibold">✓ Actualizado</span>
                        )}
                        {editingId === envio.id ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <select
                              value={nuevoEstado}
                              onChange={e => setNuevoEstado(e.target.value)}
                              className="px-2 py-1 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Estado...</option>
                              {ESTADOS.map(est => (
                                <option key={est} value={est}>{est}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => guardarEstado(envio.id)}
                              disabled={guardando || !nuevoEstado}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-lg transition disabled:opacity-50"
                            >
                              {guardando ? "..." : "OK"}
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-gray-400 hover:text-gray-700 text-xs transition"
                            >✕</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => { setEditingId(envio.id); setNuevoEstado(envio.status); }}
                              className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition"
                            >✏️ Estado</button>
                            <Link
                              href={`/envios/${envio.id}`}
                              className="text-xs text-gray-500 hover:text-gray-800 font-semibold transition"
                            >Ver →</Link>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {envios.length === 0 && (
              <div className="text-center py-16 text-gray-400">No hay envíos registrados.</div>
            )}
          </div>
        )}
      </div>

      {/* ── Modal: Crear envío ─────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1d2e] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-700">

            {/* Header del modal */}
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-black text-white">Nuevo envío</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition text-xl font-bold"
              >✕</button>
            </div>

            <form onSubmit={crearEnvio} className="p-6 space-y-5">
              {formError && (
                <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-xl p-3 text-sm">
                  {formError}
                </div>
              )}

              {/* Selector de pedido existente */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Pedido existente <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={selectedOrderId}
                  onChange={e => handleOrderSelect(e.target.value)}
                  className={inputCls}
                >
                  <option value="">— Selecciona un pedido —</option>
                  {orders.map(o => (
                    <option key={o.id} value={String(o.id)}>
                      #{o.id} · ${o.total.toFixed(2)} · {o.items.length} producto(s) · {o.status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Info del pedido seleccionado */}
              {selectedOrder && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-xs text-gray-300 space-y-1">
                  <p className="font-bold text-gray-200 mb-2">📋 Detalle del pedido #{selectedOrder.id}</p>
                  {selectedOrder.items.map((item, i) => (
                    <p key={i}>
                      • Producto #{item.productId} × {item.quantity} — ${(item.unitPrice * item.quantity).toFixed(2)}
                    </p>
                  ))}
                  <p className="pt-1 font-semibold text-white">Total: ${selectedOrder.total.toFixed(2)}</p>
                </div>
              )}

              {/* Datos del destinatario */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Cliente / Destinatario <span className="text-red-400">*</span>
                </label>
                <input
                  type="text" required
                  placeholder="Nombre completo"
                  value={form.userName}
                  onChange={e => setForm({ ...form, userName: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Dirección <span className="text-red-400">*</span>
                </label>
                <input
                  type="text" required
                  placeholder="Calle, número, colonia"
                  value={form.direccion}
                  onChange={e => setForm({ ...form, direccion: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    Teléfono <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel" required
                    placeholder="10 dígitos"
                    value={form.telefono}
                    onChange={e => setForm({ ...form, telefono: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">
                    Empresa paquetería <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text" required
                    placeholder="DHL, FedEx, Estafeta…"
                    value={form.empresa}
                    onChange={e => setForm({ ...form, empresa: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Referencia</label>
                <input
                  type="text"
                  placeholder="Casa azul con portón negro…"
                  value={form.referencia}
                  onChange={e => setForm({ ...form, referencia: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Guía de rastreo <span className="text-red-400">*</span>
                </label>
                <input
                  type="text" required
                  placeholder="DHL-2026-00999"
                  value={form.guia}
                  onChange={e => setForm({ ...form, guia: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Estado inicial</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  className={inputCls}
                >
                  {ESTADOS.map(est => (
                    <option key={est} value={est}>{est}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={creando || !selectedOrderId}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm transition disabled:opacity-50"
                >
                  {creando ? "Creando..." : "Crear envío"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold py-2.5 rounded-xl text-sm transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
