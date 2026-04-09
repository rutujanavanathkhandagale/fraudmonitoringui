
const BASE_URL = "/api/roles";

/* GET ALL ROLES */
export async function getAllRoles() {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch roles");
  }

  return await response.json();
}

/* GET ROLE BY ID */
export async function getRoleById(roleId) {
  const response = await fetch(`${BASE_URL}/${roleId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Role not found");
  }

  return await response.json();
}

/* SEARCH ROLE */
export async function searchRoleByName(name) {
  const response = await fetch(
    `${BASE_URL}/search?name=${encodeURIComponent(name)}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "No roles found");
  }

  return await response.json();
}

/* CREATE ROLE */
export async function createRole(roleName) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roleName }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return await response.json();
}

/* DELETE ROLE */
export async function deleteRole(roleId) {
  const response = await fetch(`${BASE_URL}/${roleId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    // ✅ do NOT assume JSON
    const text = await response.text();
    throw new Error(text || "Failed to delete role");
  }

  // ✅ success – no JSON expected
  return true;
}