/**
 * In Faith Birth Support — tiny zero-dependency static server.
 *
 * Serves the /public site and accepts consultation requests at
 * POST /api/consultation, appending each one to data/consultations.json.
 *
 * No npm install required — just `node server.js`.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 4040; // unique port for this project (4000+)
const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "consultations.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function saveConsultation(entry, callback) {
  fs.mkdir(DATA_DIR, { recursive: true }, (mkErr) => {
    if (mkErr) return callback(mkErr);
    fs.readFile(DATA_FILE, "utf8", (readErr, raw) => {
      let list = [];
      if (!readErr && raw) {
        try {
          list = JSON.parse(raw);
        } catch (_) {
          list = [];
        }
      }
      list.push(entry);
      fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), callback);
    });
  });
}

function handleConsultation(req, res) {
  let body = "";
  let tooBig = false;
  req.on("data", (chunk) => {
    body += chunk;
    if (body.length > 1e6) {
      tooBig = true;
      req.destroy();
    }
  });
  req.on("end", () => {
    if (tooBig) return sendJson(res, 413, { ok: false, error: "Payload too large." });
    let data;
    try {
      data = JSON.parse(body || "{}");
    } catch (_) {
      return sendJson(res, 400, { ok: false, error: "Invalid request." });
    }

    const name = (data.name || "").toString().trim();
    const email = (data.email || "").toString().trim();
    if (!name || !email) {
      return sendJson(res, 400, { ok: false, error: "Name and email are required." });
    }

    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      receivedAt: new Date().toISOString(),
      name,
      email,
      phone: (data.phone || "").toString().trim(),
      dueDate: (data.dueDate || "").toString().trim(),
      service: (data.service || "").toString().trim(),
      contactMethod: (data.contactMethod || "").toString().trim(),
      message: (data.message || "").toString().trim().slice(0, 4000),
    };

    saveConsultation(entry, (err) => {
      if (err) {
        console.error("Could not save consultation:", err);
        return sendJson(res, 500, { ok: false, error: "Something went wrong. Please email us directly." });
      }
      console.log(`New consultation request from ${entry.name} <${entry.email}>`);
      sendJson(res, 200, { ok: true, message: "Thank you — we'll be in touch soon." });
    });
  });
}

function serveStatic(req, res) {
  // Map URL path to a file inside PUBLIC_DIR, defaulting to index/.html.
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";

  // Allow extension-less pretty URLs (e.g. /about -> /about.html).
  let filePath = path.join(PUBLIC_DIR, urlPath);
  if (!path.extname(filePath)) filePath += ".html";

  // Prevent path traversal outside PUBLIC_DIR.
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(PUBLIC_DIR))) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(resolved, (err, content) => {
    if (err) {
      // Fall back to a friendly 404 page if present.
      fs.readFile(path.join(PUBLIC_DIR, "404.html"), (e2, notFound) => {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end(e2 ? "404 — Not found" : notFound);
      });
      return;
    }
    const ext = path.extname(resolved).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/consultation") {
    return handleConsultation(req, res);
  }
  if (req.method === "GET" || req.method === "HEAD") {
    return serveStatic(req, res);
  }
  res.writeHead(405, { Allow: "GET, POST" });
  res.end("Method Not Allowed");
});

server.listen(PORT, () => {
  console.log(`\n  In Faith Birth Support`);
  console.log(`  Running at  http://localhost:${PORT}\n`);
});
