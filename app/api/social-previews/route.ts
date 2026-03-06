import { NextResponse } from "next/server";

const SOCIAL_URLS = [
  "https://youtube.com/shorts/Ixefqoz5wjo",
  "https://youtube.com/shorts/LCBdFN3TPkQ",
  "https://www.instagram.com/reel/DVB96FWjHf8/",
  "https://www.instagram.com/reel/DU8LiJOjEMe/",
  "https://vt.tiktok.com/ZSud99v4G/",
  "https://vt.tiktok.com/ZSud9bBX2/",
];

const FALLBACKS = [
  "https://i.ytimg.com/vi/Ixefqoz5wjo/hqdefault.jpg",
  "https://i.ytimg.com/vi/LCBdFN3TPkQ/hqdefault.jpg",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1505232458567-cc966a066914?auto=format&fit=crop&w=600&q=80",
];

async function getOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; TGCBot/1.0)" },
      signal: AbortSignal.timeout(5000),
    });
    const html = await res.text();
    const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const results = await Promise.all(
    SOCIAL_URLS.map(async (url, i) => {
      const og = await getOgImage(url);
      return og || FALLBACKS[i];
    })
  );
  return NextResponse.json({ images: results });
}
