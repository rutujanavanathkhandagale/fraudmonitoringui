import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { getAllDetectionRules, deleteDetectionRule } from "../../services/Rule/detectionRuleService";
import DetectionRuleList from "../../components/Rule/DetectionRuleList";
import DetectionRuleForm from "../../components/Rule/DetectionRuleForm";
import DetectionRuleEditForm from "../../components/Rule/DetectionRuleEditForm";

export default function DetectionRulePage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [deletingRule, setDeletingRule] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchData = async () => {
    try {
      const data = await getAllDetectionRules();
      setRules(data);
    } catch (error) {
      console.error("Error fetching detection rules:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteDetectionRule(deletingRule.ruleId);
      setDeletingRule(null);
      Swal.fire({
        title: "Rule Deleted",
        text: `Detection rule "${deletingRule.expression}" has been deleted successfully!`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#198754",
        background: "#1e1e1e",
        color: "#fff",
        width: "350px",
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting rule:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to delete detection rule.",
        icon: "error",
        confirmButtonText: "OK",
        background: "#1e1e1e",
        color: "#fff",
        width: "350px",
      });
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("All");
  };

  const filteredRules = rules.filter((rule) => {
    const keyword = searchTerm.toLowerCase().trim();
    
    const matchesSearch =
      rule.scenario?.name?.toLowerCase().includes(keyword) ||
      rule.scenario?.riskDomain?.toLowerCase().includes(keyword) ||
      rule.expression?.toLowerCase().includes(keyword) ||
      rule.customerType?.toLowerCase().includes(keyword);

    const matchesStatus = statusFilter === "All" || rule.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-4 text-white">Loading detection rules...</div>;

  return (
    <div className="p-4">
      <h2 className="fw-bold mb-1 text-white">Detection Rule Management</h2>
      <p className="opacity-75 mb-4 text-white" style={{ fontSize: "0.9rem" }}>
        Configure and manage detection rules with custom expressions and thresholds
      </p>

      {/* Summary Stats */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="summary-box text-center">
            <h6 className="opacity-75">Total Rules</h6>
            <h3 className="fw-bold mb-0 text-white">{rules.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="summary-box text-center">
            <h6 className="opacity-75 text-success">Active Rules</h6>
            <h3 className="fw-bold mb-0 text-success">
              {rules.filter((r) => r.status === "Active").length}
            </h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="summary-box text-center">
            <h6 className="opacity-75 text-danger">Inactive Rules</h6>
            <h3 className="fw-bold mb-0 text-danger">
              {rules.filter((r) => r.status === "Inactive").length}
            </h3>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-panel p-3 mb-4">
        <div className="d-flex gap-3 flex-wrap">
          <input
            type="text"
            className="form-control"
            placeholder="Search by scenario, risk domain, or customer type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: "2" }}
          />
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ flex: "1" }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <button className="btn btn-outline-light px-4" onClick={handleReset}>
            Reset
          </button>
          <button className="btn btn-primary px-4" onClick={() => setShowCreateForm(true)}>
            + Create Rule
          </button>
        </div>
      </div>

      {/* Rule List */}
      <div className="glass-panel p-0 overflow-hidden">
        <DetectionRuleList
          rules={filteredRules}
          onEdit={(rule) => setEditingRule(rule)}
          onDelete={setDeletingRule}
        />
      </div>

      {/* CREATE MODAL */}
      {showCreateForm && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.8)" }}>
          {/* ✅ Changed to modal-lg */}
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-secondary shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title text-white">Add Detection Rule</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateForm(false)}></button>
              </div>
              <div className="modal-body">
                <DetectionRuleForm
                  onRuleCreated={() => { fetchData(); setShowCreateForm(false); }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingRule && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.8)" }}>
          {/* ✅ Changed to modal-lg */}
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-secondary shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title text-white">Edit Detection Rule</h5>
                <button type="button" className="btn-close" onClick={() => setEditingRule(null)}></button>
              </div>
              <div className="modal-body">
                <DetectionRuleEditForm
                  rule={editingRule} 
                  onRuleUpdated={() => { fetchData(); setEditingRule(null); }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deletingRule && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.8)" }}>
          {/* ✅ Changed to modal-lg for consistency */}
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-secondary">
              <div className="modal-header border-0">
                <h5 className="modal-title text-danger">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setDeletingRule(null)}></button>
              </div>
              <div className="modal-body text-white">
                <p>Are you sure you want to delete the rule for <strong>{deletingRule.scenario?.name}</strong>?</p>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-outline-light" onClick={() => setDeletingRule(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}