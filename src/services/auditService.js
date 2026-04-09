// ✅ GET ALL AUDIT LOGS (ADMIN VIEW)
export async function getAllAuditLogs() {
  const res = await fetch("/api/admin/audit/all");
  if (!res.ok) throw new Error("Failed to fetch audit logs");
  return res.json();
}