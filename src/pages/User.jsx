import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSystemUsers } from "../services/systemUserService";
import SystemUserCardGrid from "../components/SystemUsers/SystemUserCardGrid";
import AddSystemUserModal from "../components/systemUsers/AddSystemUserModal";
import { Button } from "@mui/material";
import { UserPlus, Search } from "lucide-react";
import "../styles/user.css";

export default function SystemUserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const data = await getAllSystemUsers();
    setUsers(data);
  }

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="system-user-page">
      {/* HEADER */}
      <div className="system-user-header">
        <h2 className="system-user-title">System User Management</h2>

        <Button
          variant="contained"
          onClick={() => setShowAdd(true)}
          startIcon={<UserPlus size={18} />}
        >
          Add System User
        </Button>
      </div>

      {/* SEARCH */}
      <div className="system-user-search">
        <Search size={16} className="search-icon-mini" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CARD GRID */}
      <SystemUserCardGrid
        users={filteredUsers}
        onView={(user) => navigate(`/users/${user.systemUserId}`)}
        onReload={loadUsers}
      />

      {/* ADD MODAL */}
      {showAdd && (
        <AddSystemUserModal
          onClose={() => setShowAdd(false)}
          onSuccess={loadUsers}
        />
      )}
    </div>
  );
}