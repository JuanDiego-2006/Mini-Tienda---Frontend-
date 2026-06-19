"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-[#0f111a] text-white py-4 px-6 shadow-md relative z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        <Link href="/productos" className="flex items-center gap-2 font-black text-xl tracking-tight hover:text-blue-400 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Papelería<span className="text-blue-500">AWOS</span></span>
        </Link>

        {/* Links de navegación */}
        <div className="hidden sm:flex items-center gap-4 text-sm text-gray-400">
          <Link href="/pedidos" className="hover:text-white transition">Pedidos</Link>
          <Link href="/envios" className="hover:text-white transition">Envíos</Link>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {!user ? (
            <>
              <Link href="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition hidden sm:block">
                Iniciar sesión
              </Link>
              <Link href="/registro" className="text-sm font-semibold text-gray-300 hover:text-white transition hidden sm:block">
                Crear cuenta
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 hover:bg-gray-800 p-2 rounded-lg transition"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
                <span className="text-sm font-semibold hidden sm:block">{user.name}</span>
                <svg className={`w-4 h-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg py-2 border border-gray-100 text-gray-800">
                  <div className="px-4 py-3 border-b border-gray-100 mb-2">
                    <p className="text-sm font-bold truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link href="/perfil" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50 font-medium transition">
                     Mi perfil
                  </Link>
                  <Link href="/pedidos" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50 font-medium transition">
                    Mis pedidos
                  </Link>
                  <Link href="/envios" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-gray-50 font-medium transition">
                    Envíos
                  </Link>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold transition"
                    >
                     Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="w-px h-5 bg-gray-700 hidden sm:block"></div>

          <Link href="/carrito" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-bold text-sm transition flex items-center gap-2">
            🛒 Carrito
            {cartItemCount > 0 && (
              <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-black">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
