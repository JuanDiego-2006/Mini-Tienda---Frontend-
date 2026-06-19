import { NextResponse } from "next/server";

const API = "http://localhost:3001/api/v1/products";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const res  = await fetch(`${API}/${id}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { code: "API_UNREACHABLE", message: "No se pudo conectar con el backend." },
      { status: 502 }
    );
  }
}
