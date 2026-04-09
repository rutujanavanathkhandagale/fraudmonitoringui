const BASE_URL = "/api/risk-scores";

// ✅ GET ALL RISK SCORES (Suspicious transactions)
export async function getAllRiskScores() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch risk scores");
  return res.json();
}

// ✅ GET RISK SCORE BY ID
export async function getRiskScoreById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Risk score not found");
  return res.json();
}

// ✅ SEARCH RISK SCORES BY TRANSACTION ID
export async function searchRiskScores(transactionId) {
  const res = await fetch(`${BASE_URL}/search/${transactionId}`);
  if (!res.ok) throw new Error("Failed to search risk scores");
  return res.json();
}