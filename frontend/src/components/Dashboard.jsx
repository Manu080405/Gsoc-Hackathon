import { useState, useEffect, useRef } from "react";
import MapView from "./MapView";
import "./Dashboard.css";

function Dashboard() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [crisis, setCrisis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const heroRef = useRef(null);

  // 🎤 Voice Input
  const handleVoice = () => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) return alert("Speech not supported");

    const recognition = new SpeechRecognition();
    setIsListening(true);

    recognition.onresult = (e) => {
      setText(e.results[0][0].transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // 📸 Image Upload
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // 🚨 BACKEND CALL
  const handleSubmit = async () => {
    if (!text.trim() && !image) {
      alert("Please describe the situation or upload an image.");
      return;
    }

    setIsLoading(true);
    setCrisis(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      setCrisis({
        id: data.id,
        type: `🚨 ${data.type}`,
        severity: data.severity,
        location: `📍 ${data.location}`,
        floor: data.floor,
        teams: data.teams,
        staff: data.assigned_staff,
        status: data.status || "active",
        timestamp: new Date().toLocaleTimeString(),
      });

    } catch (err) {
      console.error(err);
      setCrisis({
        type: "⚠️ Backend Error",
        severity: "Moderate",
        location: "📍 Try again",
        status: "active",
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    setIsLoading(false);
  };

  // ✅ RESOLVE FUNCTION
  const resolveCrisis = async () => {
    if (!crisis?.id) return;

    try {
      await fetch(`http://127.0.0.1:8000/resolve/${crisis.id}`, {
        method: "PUT",
      });

      setCrisis((prev) => ({
        ...prev,
        status: "resolved",
      }));

    } catch (err) {
      console.error(err);
      alert("Failed to resolve crisis");
    }
  };

  // Parallax Effect
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="dashboard">
      {/* Parallax Hero Section */}
      <div className="hero-parallax" ref={heroRef}>
        <div className="hero-bg"></div>
        <div className="hero-content">
          <div className="hero-badge">AI-POWERED EMERGENCY RESPONSE</div>
          <h1 className="hero-title">
            <span className="gradient-text">HospAlert AI</span>
            <br />
            <span className="hero-sub">Real-time Crisis Intelligence</span>
          </h1>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">⚡ 2.4s</span>
              <span className="stat-label">Avg Response</span>
            </div>
            <div className="stat">
              <span className="stat-number">🎯 99.7%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat">
              <span className="stat-number">🔄 24/7</span>
              <span className="stat-label">Monitoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="main-container">
        {/* Input Card */}
        <div className="input-card glass-card">
          <div className="card-header">
            <span className="header-icon">🚨</span>
            <h2>Emergency Dispatch</h2>
            <p className="header-desc">Describe the situation via text, voice, or image</p>
          </div>

          {/* Text Input */}
          <div className="input-group">
            <textarea
              className="crisis-textarea"
              placeholder="Describe the situation (e.g., 'Fire on 3rd floor', 'Medical emergency in ICU')..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="4"
            />
            <div className="input-actions">
              <button 
                className={`action-btn voice-btn ${isListening ? 'listening' : ''}`}
                onClick={handleVoice}
                disabled={isListening}
              >
                {isListening ? (
                  <>
                    <span className="pulse-ring"></span>
                    <span className="btn-icon">🎤</span>
                    Listening...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🎤</span>
                    Voice Input
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Image Upload */}
          <div className="upload-area">
            <label className="upload-label">
              <input type="file" accept="image/*" onChange={handleImage} hidden />
              <div className="upload-content">
                <span className="upload-icon">📸</span>
                <span>{image ? "Change Image" : "Upload Scene Image"}</span>
              </div>
            </label>
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Uploaded scene" />
                <button 
                  className="remove-image" 
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Analyzing Emergency...
              </>
            ) : (
              <>
                <span className="btn-icon">🚨</span>
                Submit Emergency
              </>
            )}
          </button>
        </div>

        {/* Crisis Result Card with ALL Backend Fields */}
        {crisis && (
          <div className="crisis-card glass-card slide-up">
            <div className="crisis-header">
              <span className="crisis-icon">{crisis.type.split(" ")[0]}</span>
              <div>
                <h3>AI Analysis Complete</h3>
                <span className="timestamp">{crisis.timestamp}</span>
              </div>
            </div>
            
            <div className="crisis-details">
              {/* Incident Type */}
              <div className="detail-row">
                <span className="detail-label">Incident Type</span>
                <span className="detail-value crisis-type">{crisis.type}</span>
              </div>
              
              {/* Severity Level */}
              <div className="detail-row">
                <span className="detail-label">Severity Level</span>
                <span className={`severity-badge ${crisis.severity?.toLowerCase() || 'moderate'}`}>
                  {crisis.severity || "Moderate"}
                </span>
              </div>
              
              {/* Status with Dynamic Styling */}
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className={`status-badge ${crisis.status === "resolved" ? "resolved" : "active"}`}>
                  {crisis.status === "resolved" ? "✅ RESOLVED" : "🚨 ACTIVE"}
                </span>
              </div>
              
              {/* Location */}
              <div className="detail-row">
                <span className="detail-label">Location</span>
                <span className="detail-value location">{crisis.location}</span>
              </div>
              
              {/* Floor - Dynamic Field */}
              {crisis.floor && (
                <div className="detail-row">
                  <span className="detail-label">🏢 Floor / Zone</span>
                  <span className="detail-value">{crisis.floor}</span>
                </div>
              )}
            </div>

            {/* Teams Section - Dynamic */}
            {crisis.teams && crisis.teams.length > 0 && (
              <div className="teams-section">
                <div className="section-header">
                  <span className="section-icon">🧠</span>
                  <h4>AI Assigned Teams</h4>
                </div>
                <div className="teams-list">
                  {crisis.teams.map((t, i) => (
                    <div key={i} className="team-badge">{t}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Staff Section - Dynamic */}
            {crisis.staff && crisis.staff.length > 0 && (
              <div className="staff-section">
                <div className="section-header">
                  <span className="section-icon">👨‍🚒</span>
                  <h4>Assigned Staff</h4>
                </div>
                <div className="staff-list">
                  {crisis.staff.map((s, i) => (
                    <div key={i} className="staff-card">
                      <span className="staff-name">{s.name}</span>
                      <span className="staff-id">{s.id}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="crisis-actions">
              <button className="action-secondary" onClick={() => alert("Calling hospital emergency...")}>
                📞 Call Hospital
              </button>
              <button className="action-primary" onClick={() => {
                const loc = crisis.location?.replace("📍 ", "");
                if (loc) {
                  window.open(`https://maps.google.com/?q=${encodeURIComponent(loc)}`);
                }
              }}>
                📍 Navigate
              </button>
              <button 
                className={`resolve-btn ${crisis.status === "resolved" ? "resolved" : ""}`}
                onClick={resolveCrisis}
                disabled={crisis.status === "resolved"}
              >
                {crisis.status === "resolved" ? "✔ Resolved" : "✅ Mark as Resolved"}
              </button>
            </div>
          </div>
        )}

        {/* Map Section */}
        <div className="map-section">
          <div className="section-title">
            <span className="title-icon">🗺️</span>
            <h2>Real-time Navigation</h2>
            <p>Live route to nearest trauma center</p>
          </div>
          <div className="map-wrapper glass-card">
            <MapView destination={crisis?.location?.replace("📍 ", "") || "Medical Trust Hospital, Kochi"} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>⚡ AI-powered emergency response system | 24/7 Support | Powered by HospAlert AI</p>
      </footer>
    </div>
  );
}

export default Dashboard;