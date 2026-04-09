import { useEffect, useState } from "react";
import {
  getAllRoles,
  getRoleById,
  searchRoleByName
} from "../services/roleService";

import AddRoleModal from "../components/Roles/AddRoleModal";
import DeleteRoleModal from "../components/Roles/DeleteRoleModal";
import ViewRoleModal from "../components/Roles/ViewRoleModal";
import RoleCard from "../components/Roles/RoleCard";

import { Search } from "lucide-react";
import "../styles/role.css";

export default function Role() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewRole, setViewRole] = useState(null);

  const [searchValue, setSearchValue] = useState("");

  /* ✅ AUTO SEARCH (DEBOUNCED) */
  useEffect(() => {
    const delay = setTimeout(() => {
      handleAutoSearch();
    }, 400);

    return () => clearTimeout(delay);
  }, [searchValue]);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await getAllRoles();
      setRoles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSearch = async () => {
    setError("");

    if (!searchValue.trim()) {
      loadRoles();
      return;
    }

    try {
      setLoading(true);
      const value = searchValue.trim();
      const isIdSearch = /^r\d+/i.test(value);

      const data = isIdSearch
        ? await getRoleById(value)
        : await searchRoleByName(value);

      setRoles(data);
    } catch (err) {
      setRoles([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-page">
      {/* ✅ HEADER TOOLBAR */}
      <div className="role-header">
        <h2 className="role-title">Role Management</h2>

        <div className="role-header-actions">
          {/* 🔍 SMALL SEARCH */}
          <div className="role-search-mini">
            <Search size={16} className="search-icon-mini" />
            <input
              type="text"
              placeholder="Search role"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          {/* ➕ CREATE ROLE */}
          <div className="create-role-wrapper">
            <button
              className="create-role-btn"
              onClick={() => setShowAddModal(true)}
            >
              + Create Role
            </button>
          </div>
        </div>
      </div>

      {/* ✅ STATE MESSAGES */}
      {loading && <p className="text-light">Loading roles...</p>}
      {error && <p className="text-danger">{error}</p>}

      {/* ✅ ROLE CARDS */}
      {!loading && !error && (
        <div className="role-card-grid">
          {roles.map((role) => (
            <RoleCard
              key={role.roleId}
              role={role}
              onView={() => {
                setViewRole(role);
                setShowViewModal(true);
              }}
              onDelete={() => {
                setSelectedRole(role);
                setShowDeleteModal(true);
              }}
            />
          ))}
        </div>
      )}

      {/* ✅ MODALS */}
      {showAddModal && (
        <AddRoleModal
          onClose={() => setShowAddModal(false)}
          onAdded={loadRoles}
        />
      )}

      {showDeleteModal && selectedRole && (
        <DeleteRoleModal
          role={selectedRole}
          onClose={() => setShowDeleteModal(false)}
          onDeleted={loadRoles}
        />
      )}

      {showViewModal && viewRole && (
        <ViewRoleModal
          role={viewRole}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
}