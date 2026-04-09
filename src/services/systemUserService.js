const BASE_URL = "/api/system-users";

// ✅ GET ALL
export async function getAllSystemUsers(page = 1, pageSize = 20) {
  const res = await fetch(`${BASE_URL}?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) throw new Error("Failed to fetch system users");
  return await res.json();
}

// ✅ ADD USER
export async function addSystemUser(registrationId, roleId) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ registrationId, roleId })
  });

  if (!res.ok) throw new Error("Failed to add system user");
  return await res.json();
}

// ✅ APPROVE USER (ACTIVE)
export async function approveSystemUser(systemUserId, adminRegistrationId) {
  const res = await fetch(
    `${BASE_URL}/${systemUserId}/approve?adminRegistrationId=${adminRegistrationId}`,
    { method: "POST" }
  );

  if (!res.ok) throw new Error("Failed to approve system user");
  return await res.json();
}