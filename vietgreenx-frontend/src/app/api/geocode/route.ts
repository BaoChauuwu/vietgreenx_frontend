import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const baseUrl = process.env.GEOCODE_API_URL || "https://nominatim.openstreetmap.org/search";
    const target = `${baseUrl}?q=${encodeURIComponent(q)}&format=json&limit=1`;
    const upstream = await fetch(target, {
      headers: {
        "User-Agent": "VietGreenX-App/1.0",
        "Accept-Language": "vi",
      },
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: "Geocoding failed" }, { status: upstream.status });
    }

    const data = await upstream.json();
    if (data && data.length > 0) {
      return NextResponse.json({ lat: data[0].lat, lon: data[0].lon });
    }

    return NextResponse.json({ lat: null, lon: null });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
