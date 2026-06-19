"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Producto {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

const API_EXTERNA = "http://localhost:3001"; // eslint-disable-line @typescript-eslint/no-unused-vars

export default function ProductosPage() {
  const [products, setProducts]       = useState<Producto[]>([]);
  const [meta, setMeta]               = useState<PaginationMeta | null>(null);
  const [page, setPage]               = useState<number>(1);
  const [search, setSearch]           = useState<string>("");
  const [loading, setLoading]         = useState<boolean>(true);
  const [errorPayload, setErrorPayload] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setErrorPayload(null);
      try {
        const res = await fetch(`/api/v1/productos?page=${page}&limit=6&search=${search}`);
        const json = await res.json();

        if (!res.ok) throw json;

        setProducts(json.data);
        setMeta(json.meta);
      } catch (err) {
        setErrorPayload(err as ApiError);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, search]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10 font-sans">
      <header className="mb-10 max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">UPChiapas - AWOS</span>
          <h1 className="text-3xl font-black text-slate-800">Catálogo de Papelería</h1>
        </div>
        <div className="w-full sm:w-72">
          <input type="text" placeholder="Buscar artículos..."
            className="w-full px-4 py-2 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {errorPayload && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-5 rounded-r-xl mb-8 shadow-sm">
            <h3 className="font-bold text-lg mb-1"> Error 400 Bad Request</h3>
            <p className="text-sm font-semibold text-red-600 mb-2">Código: {errorPayload.code}</p>
            <p className="text-sm">{errorPayload.message}</p>
            {errorPayload.details && (
              <pre className="mt-3 p-3 bg-red-100 rounded-lg text-xs font-mono overflow-x-auto">
                {JSON.stringify(errorPayload.details, null, 2)}
              </pre>
            )}
            <button onClick={() => setPage(1)}
              className="mt-4 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition">
              Restablecer Paginación Válida
            </button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        )}

        {!loading && !errorPayload && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        #{product.id}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${product.inStock ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                        {product.inStock ? "Disponible" : "Agotado"}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mb-2">{product.name}</h3>
                  </div>
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-4">
                    <div>
                      <p className="text-xs text-slate-400">Precio</p>
                      <p className="text-xl font-black text-slate-900">${product.price.toFixed(2)}</p>
                    </div>
                    <Link href={`/productos/${product.id}`}
                      className="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm">
                      Ver Detalle
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <p className="text-center text-slate-500 py-10">No se encontraron productos.</p>
            )}

            {meta && products.length > 0 && (
              <div className="flex items-center justify-center gap-3 mt-12 border-t border-slate-200 pt-6">
                <button onClick={() => setPage(0)}
                  className="px-3 py-2 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-xl text-xs font-bold transition"
                  title="Prueba error 400">
                  Probar Error 400 (page=0)
                </button>
                <button disabled={page <= 1} onClick={() => setPage(prev => prev - 1)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm disabled:opacity-40 shadow-sm hover:bg-slate-50 transition">
                  Anterior
                </button>
                <span className="text-sm font-bold text-slate-600 bg-slate-200/60 px-3 py-1.5 rounded-xl">
                  Página {meta.page} de {meta.totalPages}
                </span>
                <button disabled={page >= meta.totalPages} onClick={() => setPage(prev => prev + 1)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm disabled:opacity-40 shadow-sm hover:bg-slate-50 transition">
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
