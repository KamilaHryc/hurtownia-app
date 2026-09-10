import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://hurtownia-api-production.up.railway.app/admin_dashboard.php",
      {
        method: "GET",
        headers: {
          Cookie: "",
        },
      }
    );

    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Błąd proxy panelu admina:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Nie udało się połączyć z backendem PHP",
      },
      { status: 500 }
    );
  }
}