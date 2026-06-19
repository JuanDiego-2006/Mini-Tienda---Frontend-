"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CarritoPage() {
  const { cart, total, clearCart, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const [loading, setLoading]   = useState(false);
  const [pedidoCreado, setPedidoCreado] = useState<{ id: number; total: number } | null>(null);
  const [pagando, setPagando]   = useState(false);
  const [pagoOk, setPagoOk]     = useState(false);

  const procesarCompra = async () => {
    setLoading(true);
    try {
      const orderItems = cart.map(item => ({
        productId: 1,          
        quantity:  item.quantity,
        unitPrice: item.price   
      }));

      const res = await fetch("http://localhost:3001/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: orderItems })
      });

      const data = await res.json();

      if (res.ok) {
        setPedidoCreado({ id: data.id, total: data.total });
        clearCart();
      } else {
        alert(data.message || "Error al crear el pedido.");
      }
    } catch {
      alert("No se pudo conectar con la API.");
    } finally {
      setLoading(false);
    }
  };

  const confirmarPago = async () => {
    if (!pedidoCreado) return;
    setPagando(true);

    try {
      const res = await fetch("http://localhost:3001/api/v1/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: pedidoCreado.id, paymentMethod: "tarjeta" })
      });

      if (res.ok) {
        setPagoOk(true);
        setTimeout(() => router.push("/pedidos"), 2000);
      } else {
        alert("Error al procesar el pago.");
      }
    } catch {
      alert("No se pudo conectar con la API.");
    } finally {
      setPagando(false);
    }
  };

  if (pagoOk) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center max-w-md">
          <div className="text-6xl mb-4"></div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">¡Pago confirmado!</h2>
          <p className="text-gray-500 text-sm">Redirigiendo a tus pedidos...</p>
        </div>
      </div>
    );
  }

  if (pedidoCreado) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center max-w-md w-full">
          <div className="text-5xl mb-4">🧾</div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Pedido registrado</h2>
          <p className="text-gray-500 text-sm mb-1">
            Folio: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-800">#{pedidoCreado.id}</span>
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Total: <span className="font-bold text-gray-800">${pedidoCreado.total.toFixed(2)}</span>
          </p>

          {/* Pregunta de pago simulado */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6 text-left">
            <p className="text-sm font-bold text-blue-800 mb-1">Simular pago</p>
            <p className="text-xs text-blue-600">
              simulacio
            </p>
          </div>

          <button
            onClick={confirmarPago}
            disabled={pagando}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl transition disabled:opacity-50 text-base mb-3"
          >
            {pagando ? "Procesando..." : "Ya pagué — Confirmar pago"}
          </button>

          <Link href="/pedidos" className="block text-sm text-gray-400 hover:text-gray-600 transition">
            Ver mis pedidos sin pagar →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <Link href="/productos" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-blue-600 mb-8 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Seguir comprando
        </Link>

        <h1 className="text-3xl font-extrabold mb-8">Carrito de compras</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
            <p className="text-gray-500 text-lg mb-4">Tu carrito está vacío.</p>
            <Link href="/productos" className="text-blue-600 font-bold hover:underline">
              Explorar productos →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.productId} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-20 bg-yellow-400 rounded-xl flex-shrink-0 flex items-center justify-center">
                      <span className="text-3xl opacity-50"></span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)} c/u</p>
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-9 mt-3 w-fit">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-3 hover:bg-gray-100 text-gray-600 transition">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                        </button>
                        <span className="px-3 font-semibold text-sm w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-3 hover:bg-gray-100 text-gray-600 transition">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-4 sm:mt-0">
                    <button onClick={() => removeFromCart(item.productId)} className="text-red-500 hover:text-red-700 transition p-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <p className="font-extrabold text-lg sm:mt-8">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit">
              <h3 className="font-bold text-xl mb-6">Resumen del pedido</h3>
              <div className="flex justify-between items-center mb-4 text-gray-600">
                <span>Subtotal</span><span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-6 text-gray-600 border-b border-gray-100 pb-6">
                <span>Envío</span><span className="text-green-500 font-medium">Gratis</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-extrabold text-xl text-gray-900">Total</span>
                <span className="font-extrabold text-xl text-gray-900">${total.toFixed(2)}</span>
              </div>
              <button onClick={procesarCompra} disabled={loading}
                className="w-full bg-[#0a0c10] hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition disabled:opacity-50">
                {loading ? "Procesando..." : "Finalizar compra"}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
