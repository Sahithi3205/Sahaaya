const API = "/api/medicines";



export async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);

  // 🔥 THIS LINE IS CRITICAL
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API request failed");
  }

  const text = await res.text();

  if (!text) return null;

  return JSON.parse(text);
}

export async function getAllMedicines() {
    const meds = await apiFetch(API);
    // normalize time to HH:MM
    return meds.map(m => ({ ...m, time: m.time.trim() }));
}

export async function addMedicineAPI(med) {
    return apiFetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(med),
    });
}

export async function deleteMedicineAPI(id) {
    return apiFetch(`${API}/${id}`, {
        method: "DELETE",
    });
}

export async function markMedicineTaken(id) {
    const updated = await apiFetch(`${API}/${id}/taken`, {
        method: "PATCH",
    });
    return updated;
}