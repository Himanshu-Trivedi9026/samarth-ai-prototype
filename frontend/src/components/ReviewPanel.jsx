import React, { useState } from "react";

const ReviewPanel = ({ result }) => {
  const [decision, setDecision] = useState(null);

  if (!result) return null;

  const handleDecision = (type) => {
    setDecision(type);

    // Load existing history
    const history = JSON.parse(localStorage.getItem("reviews")) || [];

    // Add new review entry
    history.push({
      decision: type,
      timestamp: new Date().toISOString(),
      result: result,
    });

    // Save back to localStorage
    localStorage.setItem("reviews", JSON.stringify(history));
  };

  return (
    <div className="glass" style={styles.container}>
      <h3 style={styles.heading}>Human Review</h3>

      <p style={styles.text}>
        System Decision:{" "}
        <strong
          style={{
            color: result.is_duplicate ? "#ef4444" : "#22c55e",
          }}
        >
          {result.is_duplicate ? "Duplicate" : "Unique"}
        </strong>
      </p>

      <div style={styles.actions}>
        {/* ACCEPT */}
        <button
          style={{
            ...styles.button,
            background: "#22c55e",
            boxShadow: "0 0 15px rgba(34,197,94,0.4)",
          }}
          onClick={() => handleDecision("ACCEPT")}
        >
          ✔ Accept
        </button>

        {/* REJECT */}
        <button
          style={{
            ...styles.button,
            background: "#ef4444",
            boxShadow: "0 0 15px rgba(239,68,68,0.4)",
          }}
          onClick={() => handleDecision("REJECT")}
        >
          ✖ Reject
        </button>

        {/* REVIEW */}
        <button
          style={{
            ...styles.button,
            background: "#3b82f6",
            boxShadow: "0 0 15px rgba(59,130,246,0.4)",
          }}
          onClick={() => handleDecision("REVIEW")}
        >
          ⚠ Review Later
        </button>
      </div>

      {decision && (
        <p style={styles.selected}>
          Selected: <strong>{decision}</strong>
        </p>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: "20px",
    padding: "24px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    textAlign: "center",
  },

  heading: {
    marginBottom: "20px",
    fontSize: "18px",
    fontWeight: "600",
  },

  text: {
    fontSize: "16px",
    marginBottom: "10px",
  },

  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "25px",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  button: {
    border: "none",
    padding: "12px 18px",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease",
    minWidth: "120px",
  },

  selected: {
    marginTop: "18px",
    fontSize: "14px",
    opacity: 0.9,
  },
};

export default ReviewPanel;