import { NextResponse } from "next/server";

const API = "http://localhost:3001/api/v1/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page   = searchParams.get("page")   || "1";
  const limit  = searchParams.get("limit")  || "6";
  const search = searchParams.get("search") || "";

  if (isNaN(parseInt(page)) || parseInt(page) <= 0) {
    return NextResponse.json(
      {
        code: "INVALID_QUERY_PARAMS",
        message: "Parámetros de búsqueda incorrectos.",
        details: { page: "El valor de la página debe ser un número entero mayor a 0." }
      },
      { status: 400 }
    );
  }

  try {
    const res  = await fetch(`${API}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { code: "API_UNREACHABLE", message: "No se pudo conectar con el backend." },
      { status: 502 }
    );
  }
}
