const REPO_BASE = "https://raw.githubusercontent.com/snplogistics/avenor-transport/main";

const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function contentTypeFor(pathname) {
  const extension = pathname.match(/\.[^.\/]+$/)?.[0]?.toLowerCase();
  return CONTENT_TYPES[extension] || "application/octet-stream";
}

function normalizePath(pathname) {
  if (pathname === "/" || pathname === "") return "/index.html";
  if (pathname.endsWith("/")) return `${pathname}index.html`;
  return pathname;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = normalizePath(url.pathname);
    const sourceUrl = `${REPO_BASE}${pathname}`;
    const upstream = await fetch(sourceUrl, {
      headers: {
        "User-Agent": "avenortransport-cloudflare-worker",
      },
      cf: {
        cacheTtl: 60,
        cacheEverything: true,
      },
    });

    if (!upstream.ok) {
      return new Response("Not found", {
        status: 404,
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
      });
    }

    const headers = new Headers(upstream.headers);
    headers.set("content-type", contentTypeFor(pathname));
    headers.set("cache-control", "public, max-age=60");
    headers.set("x-avenor-source", "github-main");

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  },
};
