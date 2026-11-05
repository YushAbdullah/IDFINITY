(async function () {
  var E = window.ECard, sb = E.sb, $ = function (id) { return document.getElementById(id); };
  var FIELDS = ["full_name", "title", "company", "location", "bio", "phone", "whatsapp", "email"];
  var offline = !sb && /[?&]preview=1/.test(location.search); // design preview without a database
  var user = null, existing = null, card = { links: [], tags: [], accent: E.ACCENTS[0], published: true };
  var slugOk = true, slugTimer, slugCheck = Promise.resolve();

  if (!sb && !offline) { location.replace("/"); return; }
  if (sb) {
    var s = await sb.auth.getSession();
    if (!s.data.session) { location.replace("/"); return; }
    user = s.data.session.user;
    var r = await sb.from("cards").select("*").eq("user_id", user.id).maybeSingle();
    if (r.error) { $("loading").innerHTML = "<p>Couldn't load your card: " + E.esc(r.error.message) + "</p>"; return; }
    existing = r.data;
  } else {
    user = { id: "preview", email: "you@example.com" };
  }

  if (existing) card = Object.assign(card, existing);
  else { card.email = user.email || ""; }
  card.links = Array.isArray(card.links) ? card.links : [];
  card.tags = Array.isArray(card.tags) ? card.tags : [];

  $("slug-prefix").textContent = location.host + "/card/";
  $("loading").hidden = true; $("editor").hidden = false;

  /* ---------- fill form ---------- */
  FIELDS.forEach(function (f) { $(f).value = card[f] || ""; });
  $("slug").value = card.slug || "";
  $("tags").value = card.tags.join(", ");
  $("published").checked = card.published !== false;
  $("delete-btn").hidden = !existing;
  updateViewLink();
  renderLinks(); renderSwatches(); renderPhoto(); preview();

  /* ---------- form events ---------- */
  $("form").addEventListener("input", function (e) {
    if (e.target.id === "slug") return;
    if (e.target.closest("#links") || e.target.closest("#swatches")) return;
    collect();
    if (e.target.id === "full_name" && !existing && !$("slug").dataset.touched) {
      $("slug").value = E.slugify(card.full_name); checkSlug();
    }
    preview(); dirty();
  });
  $("slug").addEventListener("input", function () {
    var v = E.slugify($("slug").value.replace(/\s/g, "-")); if (v !== $("slug").value) $("slug").value = v;
    $("slug").dataset.touched = "1"; checkSlug(); dirty();
  });

  function collect() {
    FIELDS.forEach(function (f) { card[f] = $(f).value.trim(); });
    card.slug = $("slug").value.trim();
    card.tags = $("tags").value.split(",").map(function (t) { return t.trim(); }).filter(Boolean).slice(0, 5);
    card.published = $("published").checked;
  }

  function checkSlug() {
    var v = $("slug").value.trim(), hint = $("slug-hint"), err = E.slugError(v);
    card.slug = v; preview();
    clearTimeout(slugTimer);
    hint.className = "hint";
    if (err) { slugOk = false; hint.textContent = err; hint.classList.add("err"); return; }
    if (existing && existing.slug === v) { slugOk = true; hint.textContent = "This is your current link."; return; }
    hint.textContent = "Checking…"; slugOk = false;
    var done; slugCheck = new Promise(function (r) { done = r; });
    slugTimer = setTimeout(async function () {
      try { await lookup(); } finally { done(); }
    }, 400);
    async function lookup() {
      if (!sb) { slugOk = true; hint.textContent = "Looks good."; hint.classList.add("ok"); return; }
      var r = await sb.from("cards").select("slug").eq("slug", v).maybeSingle();
      if ($("slug").value.trim() !== v) return;
      if (r.data) { slugOk = false; hint.textContent = "Someone already has that link. Try another."; hint.classList.add("err"); }
      else { slugOk = true; hint.textContent = "Nice, " + location.host + "/card/" + v + " is free."; hint.classList.add("ok"); }
    }
  }

  /* ---------- links ---------- */
  function renderLinks() {
    var box = $("links");
    box.innerHTML = card.links.map(function (l, i) {
      return '<div class="link-row" data-i="' + i + '"><select aria-label="Link type">' + E.LINK_TYPES.map(function (t) {
        return '<option value="' + t.id + '"' + (t.id === l.type ? " selected" : "") + ">" + E.esc(t.label) + "</option>";
      }).join("") + '</select><input type="url" inputmode="url" aria-label="Link address" placeholder="https://" value="' + E.esc(l.url || "") + '"><button class="icon-btn" type="button" aria-label="Remove link">×</button></div>';
    }).join("");
  }
  $("links").addEventListener("input", function (e) {
    var row = e.target.closest(".link-row"); if (!row) return;
    var l = card.links[+row.dataset.i];
    l.type = row.querySelector("select").value; l.url = row.querySelector("input").value.trim();
    preview(); dirty();
  });
  $("links").addEventListener("click", function (e) {
    if (!e.target.classList.contains("icon-btn")) return;
    card.links.splice(+e.target.closest(".link-row").dataset.i, 1); renderLinks(); preview(); dirty();
  });
  $("add-link").addEventListener("click", function () {
    if (card.links.length >= 10) { E.toast("You can add up to 10 links."); return; }
    card.links.push({ type: card.links.length ? "website" : "linkedin", url: "" }); renderLinks();
    var inputs = $("links").querySelectorAll("input"); inputs[inputs.length - 1].focus();
  });

  /* ---------- colour ---------- */
  function renderSwatches() {
    $("swatches").innerHTML = E.ACCENTS.map(function (c, i) {
      return '<label title="' + c + '"><input type="radio" name="accent" value="' + c + '"' + (c.toLowerCase() === String(card.accent).toLowerCase() ? " checked" : "") + ' aria-label="Colour ' + (i + 1) + '"><i style="background:' + c + '"></i></label>';
    }).join("");
  }
  $("swatches").addEventListener("change", function (e) { card.accent = e.target.value; preview(); dirty(); });

  /* ---------- photo ---------- */
  function renderPhoto() {
    var p = $("photo-preview");
    if (card.avatar_url) { p.outerHTML = '<img id="photo-preview" class="av" src="' + E.esc(card.avatar_url) + '" alt="">'; }
    else { p.outerHTML = '<div id="photo-preview" class="av av-ph" aria-hidden="true">' + E.esc((card.full_name || "?").trim().charAt(0).toUpperCase() || "?") + "</div>"; }
    $("photo-remove").hidden = !card.avatar_url;
  }
  function resize(file) {
    return new Promise(function (res, rej) {
      var img = new Image(), u = URL.createObjectURL(file);
      img.onload = function () {
        var s = Math.min(img.width, img.height), out = 512, cv = document.createElement("canvas");
        cv.width = cv.height = out;
        cv.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, out, out);
        URL.revokeObjectURL(u); cv.toBlob(res, "image/jpeg", 0.86);
      };
      img.onerror = function () { URL.revokeObjectURL(u); rej(new Error("That file isn't an image we can read.")); };
      img.src = u;
    });
  }
  $("photo").addEventListener("change", async function () {
    var f = this.files[0]; this.value = ""; if (!f) return;
    if (f.size > 15 * 1024 * 1024) { E.toast("Please pick a photo under 15 MB."); return; }
    status("Uploading photo…");
    try {
      var blob = await resize(f);
      if (!sb) { card.avatar_url = URL.createObjectURL(blob); }
      else {
        var path = user.id + "/avatar-" + Date.now() + ".jpg";
        var up = await sb.storage.from("avatars").upload(path, blob, { contentType: "image/jpeg", upsert: true });
        if (up.error) throw up.error;
        await removeOldPhotos(path);
        card.avatar_url = sb.storage.from("avatars").getPublicUrl(path).data.publicUrl;
      }
      renderPhoto(); preview(); dirty(); status("Photo ready. Save to publish it.");
    } catch (err) { status(""); E.toast(err.message || "Upload failed."); }
  });
  async function removeOldPhotos(keep) {
    var l = await sb.storage.from("avatars").list(user.id);
    if (!l.data) return;
    var old = l.data.map(function (o) { return user.id + "/" + o.name; }).filter(function (p) { return p !== keep; });
    if (old.length) await sb.storage.from("avatars").remove(old);
  }
  $("photo-remove").addEventListener("click", function () { card.avatar_url = null; renderPhoto(); preview(); dirty(); });

  /* ---------- preview ---------- */
  function preview() { $("preview").innerHTML = E.renderCard(card, { noFoot: true }); }
  E.bindCard($("preview"), function () { return card; });

  /* ---------- save ---------- */
  var isDirty = false;
  function dirty() { isDirty = true; status("Unsaved changes"); }
  function status(t) { $("status").textContent = t; }
  window.addEventListener("beforeunload", function (e) { if (isDirty) { e.preventDefault(); e.returnValue = ""; } });
  function updateViewLink() {
    var v = $("view-link");
    if (existing && existing.slug) { v.hidden = false; v.href = "/card/" + encodeURIComponent(existing.slug); } else v.hidden = true;
  }

  $("form").addEventListener("submit", async function (e) {
    e.preventDefault(); collect();
    if (!card.full_name) { $("full_name").focus(); status("Please add your name."); return; }
    var se = E.slugError(card.slug);
    if (se) { $("slug").focus(); status(se); return; }
    await slugCheck;
    if (!slugOk) { $("slug").focus(); status("Please pick a different link name."); return; }
    if (card.email && !/^\S+@\S+\.\S+$/.test(card.email)) { $("email").focus(); status("That email doesn't look right."); return; }
    var bad = card.links.filter(function (l) { return l.url && !E.safeUrl(l.url); });
    if (bad.length) { status("One of your links isn't a valid web address."); return; }

    var row = { user_id: user.id, slug: card.slug, avatar_url: card.avatar_url || null, accent: card.accent, published: card.published,
      tags: card.tags, links: card.links.filter(function (l) { return l.url; }).map(function (l) { return { type: l.type, url: E.safeUrl(l.url) }; }) };
    FIELDS.forEach(function (f) { row[f] = card[f] || null; });
    row.full_name = card.full_name;

    if (!sb) { isDirty = false; status("Preview mode: nothing was saved."); return; }
    $("save-btn").disabled = true; status("Saving…");
    var r = await sb.from("cards").upsert(row, { onConflict: "user_id" }).select().single();
    $("save-btn").disabled = false;
    if (r.error) {
      status(r.error.code === "23505" ? "Someone already has that link. Try another." : "Couldn't save: " + r.error.message);
      return;
    }
    existing = r.data; card = Object.assign(card, r.data); isDirty = false;
    $("delete-btn").hidden = false; updateViewLink();
    status("Saved. Your card is " + (card.published ? "live at " + location.host + "/card/" + card.slug : "hidden") + ".");
    checkSlug();
  });

  $("delete-btn").addEventListener("click", async function () {
    if (!confirm("Delete your card? Your link will stop working. This can't be undone.")) return;
    var r = await sb.from("cards").delete().eq("user_id", user.id);
    if (r.error) { status("Couldn't delete: " + r.error.message); return; }
    try { await removeOldPhotos(""); } catch (err) {}
    isDirty = false; location.reload();
  });

  $("signout").addEventListener("click", async function () {
    if (sb) await sb.auth.signOut();
    location.replace("/");
  });
})();
