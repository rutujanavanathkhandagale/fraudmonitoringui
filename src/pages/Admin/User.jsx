import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { UserPlus, Search, Filter } from "lucide-react";

import {
  getAllSystemUsers,
  changeUserRole,
  deactivateSystemUser,
} from "../../services/Admin/systemUserService";
import { getAllRoles } from "../../services/Admin/roleService";

import SystemUserCardGrid from "../../components/Admin/SystemUsers/SystemUserCardGrid.jsx";
import ChangeRoleModal from "../../components/Admin/SystemUsers/ChangeRoleModal.jsx";
import SystemUserProfile from "../../components/Admin/SystemUsers/SystemUserProfile.jsx";

import "../../styles/user.css";

export default function User() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showChangeRole, setShowChangeRole] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ NEW: View user inside same page
  const [viewUser, setViewUser] = useState(null);

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  async function loadUsers() {
    const data = await getAllSystemUsers();
    setUsers(data || []);
  }

  async function loadRoles() {
    const data = await getAllRoles();
    setRoles(data || []);
  }

  function matchesStatusFilter(user, filter) {
    if (filter === "ALL") return true;
    if (filter === "PENDING") return !user.isApproved && !user.isActive;
    if (filter === "ACTIVE") return user.isApproved && user.isActive;
    if (filter === "DEACTIVATED") return user.isApproved && !user.isActive;
    return true;
  }

  const filteredUsers = users.filter(
    (u) =>
      (
        `${u.firstName} ${u.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      ) &&
      matchesStatusFilter(u, statusFilter)
  );

  return (
    <div className="system-user-page">
      {/* HEADER */}
      <div className="system-user-header">
        <h2 className="system-user-title">System User Management</h2>

        <Button
          variant="contained"
          startIcon={<UserPlus size={18} />}
        >
          Add System User
        </Button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="system-user-toolbar">
        <div className="system-user-search">
          <Search size={16} className="search-icon-mini" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="system-user-filter">
          <Filter size={16} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="ACTIVE">Active</option>
            <option value="DEACTIVATED">Deactivated</option>
          </select>
        </div>
      </div>

      {/* USER GRID */}
      <SystemUserCardGrid
        users={filteredUsers}
        onView={(user) => setViewUser(user)}  
        onReload={loadUsers}
        onChangeRole={(user) => {
          setSelectedUser(user);
          setShowChangeRole(true);
        }}
      />

      {/* ✅ CHANGE ROLE MODAL */}
      {showChangeRole && selectedUser && (
        <ChangeRoleModal
          user={selectedUser}
          roles={roles}
          onClose={() => {
            setShowChangeRole(false);
            setSelectedUser(null);
          }}
          onSave={async (newRoleId) => {
            await changeUserRole(
              selectedUser.systemUserId,
              newRoleId
            );
            setShowChangeRole(false);
            setSelectedUser(null);
            loadUsers();
          }}
        />
      )}

      {/* ✅ VIEW USER PROFILE (IN SAME PAGE) */}
      {viewUser && (
        <SystemUserProfile
          user={viewUser}
          onClose={() => setViewUser(null)}
          onDeactivate={async (id) => {
            await deactivateSystemUser(id);
            setViewUser(null);
            loadUsers();
          }}
        />
      )}
    </div>
  );
}