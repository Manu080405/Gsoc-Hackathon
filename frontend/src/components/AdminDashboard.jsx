import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [crises, setCrises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, active, resolved
  const [stats, setStats] = useState({ total: 0, active: 0, resolved: 0 });

  // 🔥 Fetch all crises
  const fetchCrises = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/crises");
      const data = await res.json();
      setCrises(data);
      
      // Update stats
      const activeCount = data.filter(c => c.status !== "resolved").length;
      const resolvedCount = data.filter(c => c.status === "resolved").length;
      setStats({
        total: data.length,
        active: activeCount,
        resolved: resolvedCount
      });
      
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrises();

    // 🔄 Auto refresh every 5 seconds
    const interval = setInterval(fetchCrises, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Resolve Crisis
  const resolveCrisis = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/resolve/${id}`, {
        method: "PUT",
      });

      // update UI instantly
      setCrises((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "resolved" } : c
        )
      );
      
      // Update stats
      setStats(prev => ({
        ...prev,
        active: prev.active - 1,
        resolved: prev.resolved + 1
      }));

    } catch (err) {
      console.error("Resolve error:", err);
      alert("Failed to resolve crisis");
    }
  };

  // Filter crises based on status
  const filteredCrises = crises.filter(crisis => {
    if (filter === "active") return crisis.status !== "resolved";
    if (filter === "resolved") return crisis.status === "resolved";
    return true;
  });

  // Get severity color
  const getSeverityColor = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'moderate': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#8b5cf6';
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-title-section">
          <span className="admin-icon">🚨</span>
          <h1>Admin Crisis Dashboard</h1>
          <span className="admin-badge">Real-time Monitoring</span>
        </div>
        
        {/* Stats Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Crises</div>
            </div>
          </div>
          <div className="stat-card active">
            <div className="stat-icon">🚨</div>
            <div className="stat-info">
              <div className="stat-number">{stats.active}</div>
              <div className="stat-label">Active</div>
            </div>
          </div>
          <div className="stat-card resolved">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-number">{stats.resolved}</div>
              <div className="stat-label">Resolved</div>
            </div>
          </div>
        </div>
        
        {/* Filter Buttons */}
        <div className="filter-section">
          <button 
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Crises
          </button>
          <button 
            className={`filter-btn ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            🚨 Active
          </button>
          <button 
            className={`filter-btn ${filter === "resolved" ? "active" : ""}`}
            onClick={() => setFilter("resolved")}
          >
            ✅ Resolved
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading crises...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredCrises.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No crises found</h3>
          <p>{filter === "all" ? "No emergency reports yet" : `No ${filter} crises to display`}</p>
        </div>
      )}

      {/* Crisis Cards */}
      <div className="crises-grid">
        {filteredCrises.map((crisis) => (
          <div 
            key={crisis.id} 
            className={`crisis-card-admin ${crisis.status === "resolved" ? "resolved" : "active"}`}
          >
            <div className="crisis-card-header">
              <div className="crisis-type-badge">
                <span className="crisis-icon">{crisis.type?.split(" ")[0] || "🚨"}</span>
                <h3>{crisis.type || "Emergency"}</h3>
              </div>
              <div className={`status-indicator ${crisis.status === "resolved" ? "resolved" : "active"}`}>
                {crisis.status === "resolved" ? "✅ RESOLVED" : "🚨 ACTIVE"}
              </div>
            </div>

            <div className="crisis-card-content">
              <div className="info-row">
                <span className="info-label">Severity:</span>
                <span 
                  className="severity-value"
                  style={{ color: getSeverityColor(crisis.severity) }}
                >
                  {crisis.severity || "Moderate"}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">📍 Location:</span>
                <span className="info-value">{crisis.location || "Unknown"}</span>
              </div>

              {crisis.floor && (
                <div className="info-row">
                  <span className="info-label">🏢 Floor:</span>
                  <span className="info-value">{crisis.floor}</span>
                </div>
              )}

              <div className="info-row">
                <span className="info-label">🕐 Reported:</span>
                <span className="info-value">
                  {new Date(crisis.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {/* Teams Section */}
              {crisis.teams && crisis.teams.length > 0 && (
                <div className="teams-section-admin">
                  <div className="section-header-admin">
                    <span className="section-icon">🧠</span>
                    <strong>AI Assigned Teams</strong>
                  </div>
                  <div className="teams-list-admin">
                    {crisis.teams.map((team, i) => (
                      <span key={i} className="team-tag">{team}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Staff Section */}
              {crisis.assigned_staff && crisis.assigned_staff.length > 0 && (
                <div className="staff-section-admin">
                  <div className="section-header-admin">
                    <span className="section-icon">👨‍🚒</span>
                    <strong>Assigned Staff</strong>
                  </div>
                  <div className="staff-list-admin">
                    {crisis.assigned_staff.map((staff, i) => (
                      <div key={i} className="staff-item">
                        <span className="staff-name">{staff.name}</span>
                        <span className="staff-id">({staff.id})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            {crisis.status !== "resolved" && (
              <div className="crisis-card-footer">
                <button
                  onClick={() => resolveCrisis(crisis.id)}
                  className="resolve-button"
                >
                  ✅ Mark as Resolved
                </button>
              </div>
            )}
            
            {crisis.status === "resolved" && (
              <div className="crisis-card-footer resolved-footer">
                <span className="resolved-badge">✓ Crisis Resolved</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;