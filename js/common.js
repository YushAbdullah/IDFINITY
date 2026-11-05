/* Shared helpers: Supabase client, card rendering, contact file, QR code, wallet image. */
(function () {
  var cfg = window.ECARD_CONFIG || {};
  var configured = cfg.supabaseUrl && cfg.supabaseUrl.indexOf("YOUR-PROJECT") === -1 && cfg.supabaseAnonKey && cfg.supabaseAnonKey.indexOf("YOUR-") !== 0;
  var sb = configured && window.supabase ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null;

  var P = {
    pin: "M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z",
    add: "M15 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    phone: "M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z",
    whatsapp: "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3 .78.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.25-.12-1.47-.72-1.7-.8s-.39-.12-.56.12-.64.8-.78.97-.29.18-.54.06a6.7 6.7 0 0 1-3.3-2.9c-.25-.43.25-.4.71-1.33a.45.45 0 0 0-.02-.43c-.06-.12-.56-1.34-.76-1.84s-.4-.42-.56-.42h-.47a.9.9 0 0 0-.66.3 2.8 2.8 0 0 0-.86 2.06 4.8 4.8 0 0 0 1 2.56 11 11 0 0 0 4.2 3.7c1.56.68 2.17.73 2.95.62a2.5 2.5 0 0 0 1.66-1.17 2 2 0 0 0 .14-1.17c-.06-.1-.22-.16-.47-.28z",
    share: "M18 16.1c-.8 0-1.5.3-2 .8l-7.1-4.1c.1-.3.1-.5.1-.8s0-.5-.1-.8L16 7.1c.5.5 1.2.8 2 .8a3 3 0 1 0-3-3c0 .3 0 .5.1.8L8 9.8A3 3 0 1 0 8 14.2l7.1 4.1c-.1.2-.1.5-.1.7a3 3 0 1 0 3-2.9z",
    wallet: "M21 7.3V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2.3A2 2 0 0 0 22 15V9a2 2 0 0 0-1-1.7zM20 9v6h-7V9zM5 19V5h14v2h-6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6v2zm11-5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
    email: "M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.2-8 5-8-5V6l8 5 8-5v2.2z",
    linkedin: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3v-11zm6.5 0h3.83v1.5h.06c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.13v5.43h-4v-4.82c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.9h-4v-11z",
    website: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm6.9 6h-2.95a15.6 15.6 0 0 0-1.38-3.56A8 8 0 0 1 18.9 8zM12 4.04A14 14 0 0 1 13.9 8h-3.8A14 14 0 0 1 12 4.04zM4.26 14a7.9 7.9 0 0 1 0-4h3.38a16.5 16.5 0 0 0 0 4zm.84 2h2.95a15.6 15.6 0 0 0 1.38 3.56A8 8 0 0 1 5.1 16zm2.95-8H5.1a8 8 0 0 1 4.33-3.56A15.6 15.6 0 0 0 8.05 8zM12 19.96A14 14 0 0 1 10.1 16h3.8A14 14 0 0 1 12 19.96zM14.34 14H9.66a14.7 14.7 0 0 1 0-4h4.68a14.7 14.7 0 0 1 0 4zm.25 5.56A15.6 15.6 0 0 0 15.95 16h2.95a8 8 0 0 1-4.31 3.56zM16.36 14a16.5 16.5 0 0 0 0-4h3.38a7.9 7.9 0 0 1 0 4z",
    youtube: "M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.75 15.02V8.98L15.5 12z",
    github: "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z",
    facebook: "M14 8.5V6.6c0-.8.2-1.3 1.4-1.3H17V2.2C16.7 2.1 15.7 2 14.6 2 12.2 2 10.6 3.5 10.6 6.1v2.4H8v3.4h2.6V22H14V11.9h2.7l.4-3.4H14z",
    instagram: "M12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8.2a3.2 3.2 0 1 1 3.2-3.2 3.2 3.2 0 0 1-3.2 3.2zM17.3 5.5a1.2 1.2 0 1 0 1.2 1.2 1.2 1.2 0 0 0-1.2-1.2zM12 2c-2.7 0-3.05 0-4.12.06a7.3 7.3 0 0 0-2.43.47 5.1 5.1 0 0 0-2.92 2.92 7.3 7.3 0 0 0-.47 2.43C2 8.95 2 9.3 2 12s0 3.05.06 4.12a7.3 7.3 0 0 0 .47 2.43 5.1 5.1 0 0 0 2.92 2.92 7.3 7.3 0 0 0 2.43.47C8.95 22 9.3 22 12 22s3.05 0 4.12-.06a7.3 7.3 0 0 0 2.43-.47 5.1 5.1 0 0 0 2.92-2.92 7.3 7.3 0 0 0 .47-2.43C22 15.05 22 14.7 22 12s0-3.05-.06-4.12a7.3 7.3 0 0 0-.47-2.43 5.1 5.1 0 0 0-2.92-2.92 7.3 7.3 0 0 0-2.43-.47C15.05 2 14.7 2 12 2zm0 1.8c2.67 0 2.99 0 4.04.06a5.5 5.5 0 0 1 1.86.34 3.3 3.3 0 0 1 1.9 1.9 5.5 5.5 0 0 1 .34 1.86c.05 1.05.06 1.37.06 4.04s0 2.99-.06 4.04a5.5 5.5 0 0 1-.34 1.86 3.3 3.3 0 0 1-1.9 1.9 5.5 5.5 0 0 1-1.86.34c-1.05.05-1.37.06-4.04.06s-2.99 0-4.04-.06a5.5 5.5 0 0 1-1.86-.34 3.3 3.3 0 0 1-1.9-1.9 5.5 5.5 0 0 1-.34-1.86C3.81 14.99 3.8 14.67 3.8 12s0-2.99.06-4.04a5.5 5.5 0 0 1 .34-1.86 3.3 3.3 0 0 1 1.9-1.9 5.5 5.5 0 0 1 1.86-.34C9.01 3.81 9.33 3.8 12 3.8z",
    x: "M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78zm-1.08 16.2h1.7L7.4 4.73H5.58z",
    tiktok: "M16.6 5.82A4.3 4.3 0 0 1 15.54 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.27 0 .53.04.78.12V9.75a5.7 5.7 0 1 0 4.92 5.65V9.01a7.3 7.3 0 0 0 4.26 1.36V7.28a4.3 4.3 0 0 1-3.2-1.46z",
    link: "M10.6 13.4a1 1 0 0 1 0-1.4l3.4-3.4a1 1 0 1 1 1.4 1.4L12 13.4a1 1 0 0 1-1.4 0zm-2.8 5.6a4 4 0 0 1-2.83-6.83l2.12-2.12a1 1 0 0 1 1.42 1.42l-2.13 2.12a2 2 0 0 0 2.83 2.83l2.12-2.13a1 1 0 0 1 1.42 1.42l-2.12 2.12A4 4 0 0 1 7.8 19zm7.78-6.33a1 1 0 0 1-.71-1.71l2.13-2.12a2 2 0 0 0-2.83-2.83l-2.12 2.13a1 1 0 0 1-1.42-1.42l2.12-2.12a4 4 0 0 1 5.66 5.66l-2.12 2.12a1 1 0 0 1-.71.29z"
  };

  var LINK_TYPES = [
    { id: "linkedin", label: "LinkedIn" },
    { id: "instagram", label: "Instagram" },
    { id: "facebook", label: "Facebook" },
    { id: "x", label: "X (Twitter)" },
    { id: "tiktok", label: "TikTok" },
    { id: "youtube", label: "YouTube" },
    { id: "github", label: "GitHub" },
    { id: "website", label: "Website" },
    { id: "link", label: "Other link" }
  ];

  var ACCENTS = ["#6BE683", "#262828", "#FFD166", "#8FD3FF", "#C3B1FF", "#FF9EC4", "#FFA98A"];
  function onAccent(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || ""); if (!m) return "#003503";
    var n = parseInt(m[1], 16), ch = [n >> 16 & 255, n >> 8 & 255, n & 255].map(function (v) { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
    var L = .2126 * ch[0] + .7152 * ch[1] + .0722 * ch[2];
    return L > .25 ? "#0F1A12" : "#FFFFFF";
  }

  var RESERVED = ["admin", "demo", "api", "app", "card", "cards", "edit", "login", "logout", "signup", "settings", "help", "about", "www", "static", "css", "js", "img"];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function icon(name, size) {
    size = size || 20;
    return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" aria-hidden="true"><path fill="currentColor" d="' + (P[name] || P.link) + '"/></svg>';
  }
  function safeUrl(u) {
    u = String(u || "").trim();
    if (!u) return "";
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    try { var x = new URL(u); return x.protocol === "http:" || x.protocol === "https:" ? x.href : ""; } catch (e) { return ""; }
  }
  function prettyUrl(u) { return String(u).replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, ""); }
  function digits(p) { return String(p || "").replace(/[^\d+]/g, ""); }
  function waNumber(p) { return String(p || "").replace(/\D/g, ""); }
  function initials(name) {
    var parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    return ((parts[0] || "?")[0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
  }
  function nameHtml(name) {
    var parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (parts.length < 2) return esc(parts[0] || "Your name");
    var last = parts.pop();
    return esc(parts.join(" ")) + " <em>" + esc(last) + "</em>";
  }
  function slugify(s) {
    return String(s || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32);
  }
  function slugError(s) {
    if (!s) return "Pick a link name.";
    if (s.length < 3) return "Use at least 3 characters.";
    if (s.length > 32) return "Use 32 characters or fewer.";
    if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(s)) return "Use lowercase letters, numbers and dashes only.";
    if (RESERVED.indexOf(s) !== -1) return "That name is reserved. Try another.";
    return "";
  }
  function cardUrl(slug) { return location.origin + "/card/" + encodeURIComponent(slug); }

  /* ---------- QR ---------- */
  function qrFor(text) { var q = qrcode(0, "M"); q.addData(text); q.make(); return q; }
  function qrSvg(text) {
    var q = qrFor(text), n = q.getModuleCount(), d = "";
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (q.isDark(r, c)) d += "M" + c + " " + r + "h1v1h-1z";
    return '<svg viewBox="0 0 ' + n + " " + n + '" shape-rendering="crispEdges" role="img" aria-label="QR code for ' + esc(text) + '"><path fill="#0F1A12" d="' + d + '"/></svg>';
  }
  function drawQr(ctx, text, x, y, size) {
    var q = qrFor(text), n = q.getModuleCount(), cell = size / n;
    ctx.fillStyle = "#0F1A12";
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (q.isDark(r, c)) ctx.fillRect(Math.floor(x + c * cell), Math.floor(y + r * cell), Math.ceil(cell), Math.ceil(cell));
  }
  function qrPng(text) {
    var cv = document.createElement("canvas"), s = 1024, pad = 64;
    cv.width = cv.height = s;
    var ctx = cv.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, s, s);
    drawQr(ctx, text, pad, pad, s - pad * 2);
    return new Promise(function (res) { cv.toBlob(res, "image/png"); });
  }

  /* ---------- vCard ---------- */
  function vesc(s) { return String(s || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1"); }
  function fold(line) {
    var out = [], first = true;
    while (line.length > 75) { out.push((first ? "" : " ") + line.slice(0, first ? 75 : 74)); line = line.slice(first ? 75 : 74); first = false; }
    out.push((first ? "" : " ") + line);
    return out.join("\r\n");
  }
  function blobToBase64(blob) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(String(r.result).split(",")[1]); };
      r.onerror = rej; r.readAsDataURL(blob);
    });
  }
  async function makeVcf(c) {
    var parts = String(c.full_name || "").trim().split(/\s+/);
    var last = parts.length > 1 ? parts.pop() : "", first = parts.join(" ");
    var L = ["BEGIN:VCARD", "VERSION:3.0", "N:" + vesc(last) + ";" + vesc(first) + ";;;", "FN:" + vesc(c.full_name)];
    if (c.company) L.push("ORG:" + vesc(c.company));
    if (c.title) L.push("TITLE:" + vesc(c.title));
    if (c.phone) L.push("TEL;TYPE=CELL,VOICE:" + digits(c.phone));
    if (c.whatsapp && digits(c.whatsapp) !== digits(c.phone)) L.push("TEL;TYPE=CELL:" + digits(c.whatsapp));
    if (c.email) L.push("EMAIL;TYPE=INTERNET,PREF:" + vesc(c.email));
    if (c.location) L.push("ADR;TYPE=WORK:;;;" + vesc(c.location) + ";;;");
    L.push("URL:" + cardUrl(c.slug));
    (c.links || []).forEach(function (l) { var u = safeUrl(l.url); if (u) L.push("URL:" + u); });
    if (c.bio) L.push("NOTE:" + vesc(c.bio));
    if (c.avatar_url) {
      try {
        var r = await fetch(c.avatar_url, { mode: "cors" });
        if (r.ok) {
          var b = await r.blob(), t = /png/.test(b.type) ? "PNG" : "JPEG";
          if (b.size < 400000) L.push("PHOTO;ENCODING=b;TYPE=" + t + ":" + (await blobToBase64(b)));
        }
      } catch (e) { /* skip photo */ }
    }
    L.push("END:VCARD");
    return new Blob([L.map(fold).join("\r\n") + "\r\n"], { type: "text/vcard;charset=utf-8" });
  }

  /* ---------- wallet image (1080 x 1920 phone wallpaper style) ---------- */
  function loadImg(src) {
    return new Promise(function (res) {
      if (!src) return res(null);
      var i = new Image(); i.crossOrigin = "anonymous";
      i.onload = function () { res(i); }; i.onerror = function () { res(null); }; i.src = src;
    });
  }
  function wrap(ctx, text, maxW) {
    var words = String(text).split(/\s+/), lines = [], cur = "";
    words.forEach(function (w) { var t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
    if (cur) lines.push(cur);
    return lines;
  }
  async function walletPng(c) {
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
    var W = 1080, H = 1920, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    var ctx = cv.getContext("2d"), accent = c.accent || "#6BE683"; if (onAccent(accent) === "#FFFFFF") accent = "#6BE683";
    ctx.fillStyle = "#262828"; ctx.fillRect(0, 0, W, H);
    var g = ctx.createRadialGradient(W * 0.85, 0, 0, W * 0.85, 0, W * 0.9);
    g.addColorStop(0, "rgba(107,230,131,.30)"); g.addColorStop(1, "rgba(107,230,131,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    var cx = W / 2, y = 260, R = 150;
    var img = await loadImg(c.avatar_url);
    ctx.save(); ctx.beginPath(); ctx.arc(cx, y + R, R, 0, Math.PI * 2); ctx.closePath();
    if (img) {
      ctx.clip();
      var s = Math.max((R * 2) / img.width, (R * 2) / img.height);
      ctx.drawImage(img, cx - (img.width * s) / 2, y + R - (img.height * s) / 2, img.width * s, img.height * s);
    } else {
      ctx.fillStyle = "#33373A"; ctx.fill();
      ctx.fillStyle = accent; ctx.font = "600 110px Outfit, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(initials(c.full_name), cx, y + R + 6);
    }
    ctx.restore();
    ctx.lineWidth = 8; ctx.strokeStyle = accent; ctx.beginPath(); ctx.arc(cx, y + R, R, 0, Math.PI * 2); ctx.stroke();
    y += R * 2 + 120;
    ctx.textAlign = "center"; ctx.textBaseline = "alphabetic"; ctx.fillStyle = "#FFFFFF";
    ctx.font = "600 92px Outfit, system-ui, sans-serif";
    wrap(ctx, c.full_name || "Your name", W - 160).slice(0, 3).forEach(function (l) { ctx.fillText(l, cx, y); y += 110; });
    y += 10;
    if (c.title) { ctx.font = "600 44px Outfit, system-ui, sans-serif"; ctx.fillStyle = "#FFFFFF"; wrap(ctx, c.title, W - 160).slice(0, 2).forEach(function (l) { ctx.fillText(l, cx, y); y += 58; }); }
    if (c.company) { ctx.font = "400 40px Outfit, system-ui, sans-serif"; ctx.fillStyle = "#C9D1CB"; ctx.fillText(c.company, cx, y); y += 56; }
    var qs = 560, qx = cx - qs / 2, qy = H - qs - 300;
    ctx.fillStyle = "#fff"; roundRect(ctx, qx - 40, qy - 40, qs + 80, qs + 80, 40); ctx.fill();
    drawQr(ctx, cardUrl(c.slug), qx, qy, qs);
    ctx.fillStyle = accent; ctx.font = "600 52px Outfit, system-ui, sans-serif";
    ctx.fillText("Scan to save my contact", cx, H - 170);
    ctx.fillStyle = "#C9D1CB"; ctx.font = "400 34px Outfit, system-ui, sans-serif";
    ctx.fillText(prettyUrl(cardUrl(c.slug)), cx, H - 112);
    return new Promise(function (res) { cv.toBlob(res, "image/png"); });
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function download(blob, filename) {
    var a = document.createElement("a"), u = URL.createObjectURL(blob);
    a.href = u; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(u); }, 4000);
  }
  function fileBase(c) { return (slugify(c.full_name) || c.slug || "contact").replace(/(^|-)([a-z])/g, function (m, d, ch) { return d + ch.toUpperCase(); }); }

  /* ---------- card markup ---------- */
  function renderCard(c, opts) {
    opts = opts || {};
    var url = c.slug ? cardUrl(c.slug) : location.origin + "/card/your-name";
    var phone = digits(c.phone), wa = waNumber(c.whatsapp || c.phone);
    var h = '<main class="card" aria-label="Digital business card" style="--accent:' + esc(c.accent || "#6BE683") + ";--on-accent:" + onAccent(c.accent || "#6BE683") + '">';
    h += '<header class="top">';
    h += c.avatar_url
      ? '<img class="av" src="' + esc(c.avatar_url) + '" width="224" height="224" alt="Portrait of ' + esc(c.full_name) + '">'
      : '<div class="av av-ph" aria-hidden="true">' + esc(initials(c.full_name)) + "</div>";
    h += "<h1>" + nameHtml(c.full_name) + "</h1>";
    if (c.title) h += '<p class="role">' + esc(c.title) + "</p>";
    if (c.company) h += '<p class="org">' + esc(c.company) + "</p>";
    if (c.location) h += '<span class="loc">' + icon("pin", 15) + esc(c.location) + "</span>";
    if (c.bio) h += '<p class="bio">' + esc(c.bio) + "</p>";
    var tags = (c.tags || []).filter(Boolean);
    if (tags.length) h += '<div class="tags" aria-label="Focus areas">' + tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div>";
    h += "</header><div class=\"body\">";
    h += '<button class="save" type="button" data-act="vcf">' + icon("add") + " Save to contacts</button>";
    var acts = [];
    if (phone) acts.push('<a class="act" href="tel:' + esc(phone) + '">' + icon("phone") + "<span>Call</span></a>");
    if (wa) acts.push('<a class="act" href="https://wa.me/' + esc(wa) + '" target="_blank" rel="noopener">' + icon("whatsapp") + "<span>WhatsApp</span></a>");
    acts.push('<button class="act" type="button" data-act="share">' + icon("share") + "<span>Share card</span></button>");
    acts.push('<button class="act" type="button" data-act="wallet">' + icon("wallet") + "<span>Save image</span></button>");
    h += '<div class="row">' + acts.join("") + "</div>";

    var rows = [];
    if (phone) rows.push(['tel:' + phone, "phone", "Phone", c.phone, false]);
    if (c.whatsapp && waNumber(c.whatsapp) !== waNumber(c.phone)) rows.push(["https://wa.me/" + waNumber(c.whatsapp), "whatsapp", "WhatsApp", c.whatsapp, true]);
    if (c.email) rows.push(["mailto:" + c.email, "email", "Email", c.email, false]);
    (c.links || []).forEach(function (l) {
      var u = safeUrl(l.url); if (!u) return;
      var t = LINK_TYPES.filter(function (x) { return x.id === l.type; })[0] || LINK_TYPES[LINK_TYPES.length - 1];
      rows.push([u, t.id, l.label || t.label, prettyUrl(u), true]);
    });
    if (rows.length) {
      h += '<nav class="links" aria-label="Contact and profiles">' + rows.map(function (r) {
        return '<a href="' + esc(r[0]) + '"' + (r[4] ? ' target="_blank" rel="noopener"' : "") + ">" + icon(r[1]) + "<div><b>" + esc(r[2]) + "</b><small>" + esc(r[3]) + '</small></div><span class="chev" aria-hidden="true">›</span></a>';
      }).join("") + "</nav>";
    }
    h += '<section class="qr" aria-label="QR code"><div class="qr-img">' + qrSvg(url) + "</div><div><b>Scan to save my card</b><p>Point a phone camera here to open this card and save my contact.</p><button type=\"button\" data-act=\"qr\">Download QR code</button></div></section>";
    h += "</div></main>";
    if (!opts.noFoot) h += '<p class="foot">' + esc(prettyUrl(url)) + ' · <a href="/">Make your own free card on IDFINITY</a></p>';
    return h;
  }

  var toastTimer;
  function toast(m) {
    var t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); t.setAttribute("aria-live", "polite"); document.body.appendChild(t); }
    t.textContent = m; t.classList.add("on"); clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("on"); }, 2400);
  }

  function bindCard(root, getCard) {
    root.addEventListener("click", async function (e) {
      var b = e.target.closest("[data-act]"); if (!b) return;
      var c = getCard(), url = c.slug ? cardUrl(c.slug) : "";
      var act = b.getAttribute("data-act");
      try {
        if (act === "vcf") download(await makeVcf(c), fileBase(c) + ".vcf");
        else if (act === "qr") download(await qrPng(url || location.href), fileBase(c) + "-QR.png");
        else if (act === "wallet") { toast("Making your image…"); download(await walletPng(c), fileBase(c) + "-card.png"); }
        else if (act === "share") {
          var data = { title: (c.full_name || "My") + " · digital card", text: "My digital business card", url: url };
          if (navigator.share) { navigator.share(data).catch(function () {}); return; }
          if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast("Card link copied"); }, function () { toast(url); });
          else toast(url);
        }
      } catch (err) { console.error(err); toast("Something went wrong. Please try again."); }
    });
  }

  window.ECard = {
    sb: sb, configured: !!sb, cfg: cfg, esc: esc, icon: icon, safeUrl: safeUrl, slugify: slugify, slugError: slugError,
    cardUrl: cardUrl, renderCard: renderCard, bindCard: bindCard, toast: toast, LINK_TYPES: LINK_TYPES, ACCENTS: ACCENTS,
    makeVcf: makeVcf, walletPng: walletPng, qrPng: qrPng
  };
})();
