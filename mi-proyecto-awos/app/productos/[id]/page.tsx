"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

interface Producto {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export default function DetalleProductoPage() {
  const params = useParams();
  const id = params?.id as string;
  const { addToCart } = useCart();

  const [producto, setProducto]         = useState<Producto | null>(null);
  const [loading, setLoading]           = useState<boolean>(true);
  const [errorPayload, setErrorPayload] = useState<ApiError | null>(null);
  const [added, setAdded]               = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      setErrorPayload(null);
      try {
        const res = await fetch(`/api/v1/productos/${id}`);
        const json = await res.json();
        if (!res.ok) throw json;
        setProducto(json);
      } catch (err) {
        setErrorPayload(err as ApiError);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleAddToCart = () => {
    if (producto) {
      addToCart({ productId: String(producto.id), name: producto.name, price: producto.price, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10 font-sans flex flex-col items-center pt-10">
      <div className="max-w-xl w-full">
        <Link href="/productos" className="text-sm font-bold text-blue-600 hover:underline mb-4 inline-block">
          ← Volver al catálogo
        </Link>

        {loading && <p className="text-center text-slate-500 font-medium">Cargando detalles...</p>}

        {errorPayload && (
          <div className="bg-white rounded-2xl p-8 shadow-md border border-rose-100 text-center">
            <span className="text-4xl">🔍</span>
            <h2 className="text-2xl font-black text-rose-600 mt-2">Error 404 Not Found</h2>
            <p className="text-xs text-slate-400 font-mono mt-1">CODE: {errorPayload.code}</p>
            <p className="text-slate-700 font-medium mt-4">{errorPayload.message}</p>
          </div>
        )}

        {producto && !loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-mono bg-slate-100 text-slate-500 px-3 py-1 rounded-lg">
                ID: {producto.id}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${producto.inStock ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                {producto.inStock ? "En Existencia" : "Agotado"}
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-800 mb-4">{producto.name}</h2>
            <div className="bg-slate-50 p-4 rounded-xl mb-6">
              <p className="text-3xl font-black text-blue-600">${producto.price.toFixed(2)} MXN</p>
            </div>

            <button disabled={!producto.inStock || added} onClick={handleAddToCart}
              className={`w-full py-3 font-bold rounded-xl shadow-sm transition-all ${
                added ? 'bg-green-500 text-white' :
                !producto.inStock ? 'bg-slate-200 text-slate-400' :
                'bg-slate-900 hover:bg-blue-600 text-white'
              }`}>
              {added ? "¡Agregado al carrito! ✓" : producto.inStock ? "Añadir al Carrito" : "Agotado Temporalmente"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
