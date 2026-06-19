"use client";


import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PagosPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/carrito");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Redirigiendo al carrito...</p>
    </div>
  );
}
