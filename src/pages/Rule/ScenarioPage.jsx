import { useEffect, useState } from "react";
import Swal from "sweetalert2";
 
import { getAllScenarios, deleteScenario } from "../../services/Rule/scenarioService";
 
import ScenarioList from "../../components/Rule/ScenarioList";
import ScenarioForm from "../../components/Rule/ScenarioForm";
import ScenarioEditForm from "../../components/Rule/ScenarioEditForm";
import "../../styles/Rule/rule.css";
 
export default function ScenarioPage() {
  const [scenarios, setScenarios] = useState([]);
  const [filteredScenarios, setFilteredScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingScenario, setEditingScenario] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
 
  const fetchData = async () => {
    try {
      const data = await getAllScenarios();
      console.log("Fetched Scenarios:", data);
      setScenarios(data);
      setFilteredScenarios(data);
    } catch (error) {
      console.error("Error fetching scenarios:", error);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { fetchData(); }, []);
 
  useEffect(() => {
    const results = scenarios.filter((s) => {
      const search = searchTerm.toLowerCase().trim();
      if (!search) return true;
 
      const nameMatch = s.name?.toLowerCase().includes(search);
      const descMatch = s.description?.toLowerCase().includes(search);
     
      const domainValue = s.riskDomain || s.riskdomain || s.domain || "";
      const domainMatch = domainValue.toLowerCase().includes(search);
 
      return nameMatch || descMatch || domainMatch;
    });
 
    const finalResults = statusFilter === "All"
      ? results
      : results.filter((s) => s.status === statusFilter);
 
    setFilteredScenarios(finalResults);
  }, [searchTerm, statusFilter, scenarios]);
 
  const handleDelete = async (scenarioId, scenarioName) => {
    try {
      await deleteScenario(scenarioId);
      Swal.fire({
        title: "Scenario Deleted",
        text: `Scenario "${scenarioName}" has been deleted successfully!`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#198754",
        background: "#1e1e1e",
        color: "#fff",
        width: "350px",
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting scenario:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to delete scenario.",
        icon: "error",
        confirmButtonText: "OK",
        background: "#1e1e1e",
        color: "#fff",
        width: "350px",
      });
    }
  };
 
  if (loading) return <div className="p-4 text-white">Loading scenarios...</div>;
 
  return (
    <div className="p-4">
      <h2 className="fw-bold mb-1 text-white">Scenario Management</h2>
      <p className="opacity-75 mb-4 text-white" style={{ fontSize: "0.9rem" }}>
        Create and manage fraud detection scenarios across different risk domains
      </p>
 
      {/* --- KPI CARDS SECTION FIXED --- */}
      {/* --- KPI CARDS SECTION FIXED --- */}
      <div className="rule-stats-row mb-4">
       
        {/* Total Scenarios Card */}
        <div className="rule-card">
          <span className="card-label text-white">Total Scenarios</span>
          <span className="card-value text-white">{scenarios.length}</span>
        </div>
 
        {/* Active Scenarios Card */}
        <div className="rule-card">
          <span className="card-label text-success-custom">Active Scenarios</span>
          <span className="card-value text-success-custom">
            {scenarios.filter((s) => s.status === "Active").length}
          </span>
        </div>
 
        {/* Inactive Scenarios Card */}
        <div className="rule-card">
          <span className="card-label text-danger-custom">Inactive Scenarios</span>
          <span className="card-value text-danger-custom">
            {scenarios.filter((s) => s.status === "Inactive").length}
          </span>
        </div>
 
      </div>
 
      {/* Filter Bar */}
      <div className="glass-panel p-3 mb-4">
        <div className="d-flex gap-3 flex-wrap">
          <input
            type="text"
            className="form-control"
            placeholder="Search name, risk domain, or description..."
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
          <button
            className="btn btn-outline-light"
            onClick={() => {setSearchTerm(""); setStatusFilter("All");}}
          >
            Reset
          </button>
          <button className="btn btn-primary px-4" onClick={() => setShowForm(true)}>
            + Create Scenario
          </button>
        </div>
      </div>
 
      <div className="glass-panel p-0 overflow-hidden">
        <ScenarioList
          scenarios={filteredScenarios}
          onUpdated={fetchData}
          onEdit={setEditingScenario}
          onDelete={handleDelete}
        />
      </div>
 
      {/* --- ADD MODAL --- */}
      {showForm && (
        <div className="modal d-block" style={{background: 'rgba(0,0,0,0.8)'}} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header border-0">
                <h5 className="modal-title">Add Scenario</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                <ScenarioForm onScenarioCreated={() => { fetchData(); setShowForm(false); }} />
              </div>
            </div>
          </div>
        </div>
      )}
 
      {/* --- EDIT MODAL --- */}
      {editingScenario && (
        <div className="modal d-block" style={{background: 'rgba(0,0,0,0.8)'}} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header border-0">
                <h5 className="modal-title">Edit Scenario</h5>
                <button type="button" className="btn-close" onClick={() => setEditingScenario(null)}></button>
              </div>
              <div className="modal-body">
                <ScenarioEditForm
                  scenario={editingScenario}
                  onScenarioUpdated={() => { fetchData(); setEditingScenario(null); }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}