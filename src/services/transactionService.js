const BASE_URL = "/api/transactions";

// ✅ GET ALL TRANSACTIONS (Total count)
export async function getAllTransactions() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
}

// ✅ GET TRANSACTION BY ID
export async function getTransactionById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Transaction not found");
  return res.json();
}
