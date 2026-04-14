const BASE_URL = "https://localhost:7181/api/system-users";

/* ✅ GET ALL */
export async function getAllSystemUsers(page = 1, pageSize = 20) {
  const res = await fetch(`${BASE_URL}?page=${page}&pageSize=${pageSize}`);
  if (!res.ok) throw new Error("Failed to fetch system users");
  return await res.json();
}

/* ✅ ADD USER */
export async function addSystemUser(registrationId, roleId) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ registrationId, roleId }),
  });

  if (!res.ok) throw new Error("Failed to add system user");
  return await res.json();
}

/* ✅ APPROVE USER (ADMIN FROM TOKEN) */
export const approveSystemUser = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/approve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Authorization header already handled globally
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to approve user");
  }

  return await res.json();
};

/* ✅ DEACTIVATE USER */
export const deactivateSystemUser = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/deactivate`, {
    method: "PUT",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to deactivate user");
  }

  return await res.json();
};

/* ✅ CHANGE ROLE */
export const changeUserRole = async (userId, newRoleId) => {
  const res = await fetch(`${BASE_URL}/${userId}/change-role`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newRoleId }),
  });

  if (!res.ok) throw new Error("Failed to change role");
  return await res.json();
};
