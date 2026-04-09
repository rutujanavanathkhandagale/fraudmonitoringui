const BASE_URL = "https://localhost:7181/api/system-users";

/* ============================
   GET: All System Users
============================ */
export async function getAllSystemUsers(page = 1, pageSize = 10) {
  const response = await fetch(
    `${BASE_URL}?page=${page}&pageSize=${pageSize}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch system users");
  }

  return await response.json();
}