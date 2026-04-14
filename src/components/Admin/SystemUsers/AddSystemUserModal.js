function getUserState(user) {
  if (!user.isApproved && !user.isActive) {
    return { text: "Pending Approval", className: "pending" };
  }

  if (user.isApproved && user.isActive) {
    return { text: "Active User", className: "active" };
  }

  if (user.isApproved && !user.isActive) {
    return { text: "User Deactivated", className: "inactive" };
  }

  return { text: "Unknown", className: "unknown" };
}