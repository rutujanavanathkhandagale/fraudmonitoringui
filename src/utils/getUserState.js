export function getUserState(user) {
  // 1️⃣ Registered but not approved yet
  if (!user.isApproved && !user.isActive) {
    return {
      label: "Pending",
      css: "pending",
      state: "PENDING"
    };
  }

  // 2️⃣ Approved and active
  if (user.isApproved && user.isActive) {
    return {
      label: "Active User",
      css: "active",
      state: "ACTIVE"
    };
  }

  // 3️⃣ Approved but role removed / manually deactivated
  if (user.isApproved && !user.isActive) {
    return {
      label: "User Deactivated",
      css: "deactivated",
      state: "DEACTIVATED"
    };
  }

  // 4️⃣ Safety fallback
  return {
    label: "Inactive",
    css: "inactive",
    state: "INACTIVE"
  };
}