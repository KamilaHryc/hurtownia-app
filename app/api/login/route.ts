import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.text();

    const response = await fetch(
      "https://hurtownia-api-production.up.railway.app/login.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      }
    );

    const text = await response.text();

    const nextResponse = new NextResponse(text, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const setCookie = response.headers.get("set-cookie");

    if (setCookie) {
      nextResponse.headers.set("set-cookie", setCookie);
    }

    return nextResponse;
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