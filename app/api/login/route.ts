import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.text();

    const response = await fetch(
      "https://hurtownia-warzywa.42web.io/hurtownia-api/login.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
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
    console.error("Błąd proxy logowania:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Nie udało się połączyć z backendem PHP",
      },
      { status: 500 }
    );
  }
}