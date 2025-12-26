const form = document.getElementById("appForm");
const list = document.getElementById("list");
const filterStatus = document.getElementById("filterStatus");
const summary = document.getElementById("summary");

// Fetch all applications from backend
async function refresh() {
  const res = await fetch("/api/applications");
  const items = await res.json();
  render(items);
}

// Render list + summary + filter
function render(items) {
  // ---- Summary counts ----
  const counts = items.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  summary.innerHTML =
    `Total: <strong>${items.length}</strong> · ` +
    `Applied: <strong>${counts["Applied"] || 0}</strong> · ` +
    `OA: <strong>${counts["OA"] || 0}</strong> · ` +
    `Interview: <strong>${counts["Interview"] || 0}</strong> · ` +
    `Offer: <strong>${counts["Offer"] || 0}</strong> · ` +
    `Rejected: <strong>${counts["Rejected"] || 0}</strong>`;

  // ---- Apply filter ----
  const selected = filterStatus.value;
  const visible =
    selected === "All"
      ? items
      : items.filter((a) => a.status === selected);

  list.innerHTML = "";

  if (!visible.length) {
    list.innerHTML = `<div style="opacity:.7">No applications for this filter.</div>`;
    return;
  }

  // ---- Render items ----
  for (const it of visible) {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div>
        <strong>${escapeHtml(it.company)}</strong>
        <div style="opacity:.8">
          ${
            it.link
              ? `<a href="${escapeAttr(it.link)}" target="_blank">Link</a>`
              : ""
          }
        </div>
      </div>
      <div>${escapeHtml(it.role)}</div>
      <div class="badge">${escapeHtml(it.status)}</div>
      <button data-id="${it.id}">X</button>
    `;
    list.appendChild(div);
  }

  // ---- Delete handlers ----
  list.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await fetch(`/api/applications/${id}`, { method: "DELETE" });
      await refresh();
    });
  });
}

// ---- Form submit (POST) ----
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    company: document.getElementById("company").value.trim(),
    role: document.getElementById("role").value.trim(),
    link: document.getElementById("link").value.trim(),
    status: document.getElementById("status").value,
  };

  const res = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    alert(err.error || "Failed to add application");
    return;
  }

  form.reset();
  await refresh();
});

// ---- Filter change ----
filterStatus.addEventListener("change", refresh);

// ---- Helpers ----
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeAttr(str) {
  return escapeHtml(str);
}

// Initial load
refresh();
