const BASE_URL = "/api/alerts";

// ✅ GET ALL ALERTS (Dashboard KPIs, trends)
export async function getAllAlerts() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch alerts");
  return res.json();
}

// ✅ GET ALERT BY ID
export async function getAlertById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Alert not found");
  return res.json();
}
