import { NextResponse } from "next/server";

/** Proxy Open API VN v2 (post-2025 administrative merger). */
const OPEN_API_V2 = process.env.OPEN_API_LOCATION_URL || "https://provinces.open-api.vn/api/v2";

const CACHE_SECONDS = 60 * 60 * 24 * 7;

export async function GET(req: Request, context: { params: { path: string[] } }) {
  const segments = context.params.path ?? [];
  const incoming = new URL(req.url);
  const target = `${OPEN_API_V2}/${segments.join("/")}${incoming.search}`;

  try {
    const upstream = await fetch(target, {
      headers: { Accept: "application/json" },
      next: { revalidate: CACHE_SECONDS },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { message: "Upstream location API error" },
        { status: upstream.status },
      );
    }

    const data = await upstream.json();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS}`,
      },
    });
  } catch {
    return NextResponse.json({ message: "Location proxy unavailable" }, { status: 502 });
  }
}
