import { NextResponse } from "next/server";

const BASE_URL = "https://hurtownia-api-production.up.railway.app";

type Context = {
    params: Promise<{ endpoint: string }>;
};

async function proxy(request: Request, context: Context) {
    try {
        const { endpoint } = await context.params;

        if (!/^[a-zA-Z0-9_-]+\.php$/.test(endpoint)) {
            return NextResponse.json(
                { success: false, message: "Nieprawidłowy endpoint" },
                { status: 400 }
            );
        }

        const incomingUrl = new URL(request.url);
        const targetUrl = `${BASE_URL}/${endpoint}${incomingUrl.search}`;

        const headers: Record<string, string> = {};

        const cookie = request.headers.get("cookie");
        const contentType = request.headers.get("content-type");

        if (cookie) {
            headers["Cookie"] = cookie;
        }

        if (contentType) {
            headers["Content-Type"] = contentType;
        }

        const method = request.method;

        const body =
            method === "GET" || method === "HEAD"
                ? undefined
                : await request.text();

        const response = await fetch(targetUrl, {
            method,
            headers,
            body,
            cache: "no-store",
        });

        const text = await response.text();

        const nextResponse = new NextResponse(text, {
            status: response.status,
            headers: {
                "Content-Type":
                    response.headers.get("content-type") || "application/json",
            },
        });

        const setCookie = response.headers.get("set-cookie");

        if (setCookie) {
            nextResponse.headers.set("Set-Cookie", setCookie);
        }

        return nextResponse;
    } catch (error) {
        console.error("Błąd proxy PHP:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Błąd połączenia z backendem PHP",
            },
            { status: 500 }
        );
    }
}

export {
    proxy as GET,
    proxy as POST,
    proxy as PUT,
    proxy as PATCH,
    proxy as DELETE,
};