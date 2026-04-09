const BASE_URL = "/api/cases";

// ✅ GET ALL CASES (Dashboard table)
export async function getAllCases() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch cases");
  return res.json();
}

// ✅ GET AML CASES
export async function getAmlCases() {
  const res = await fetch(`${BASE_URL}/aml`);
  if (!res.ok) throw new Error("Failed to fetch AML cases");
  return res.json();
}

// ✅ GET FRAUD CASES
export async function getFraudCases() {
  const res = await fetch(`${BASE_URL}/fraud`);
  if (!res.ok) throw new Error("Failed to fetch fraud cases");
  return res.json();
}

// ✅ GET CASE BY ID
export async function getCaseById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Case not found");
  return res.json();
}