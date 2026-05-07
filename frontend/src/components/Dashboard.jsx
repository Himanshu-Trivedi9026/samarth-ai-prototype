import React from "react";

const Dashboard = ({ result }) => {
  if (!result) return null;

  const percentage = Math.round(
    parseFloat(result.similarity_score || 0) * 100
  );

  return (
    <div style={styles.container}>
      <h2>Duplicate Detection Result</h2>

      {result.ubid && (
        <p style={{ marginBottom: "10px", fontSize: "14px", opacity: 0.8 }}>
          UBID: <strong>{result.ubid}</strong>
        </p>
      )}

      {/* PROGRESS BAR */}
      <div style={styles.progressContainer}>
        <div
          style={{
            ...styles.progressBar,
            width: `${percentage}%`,
            background:
  percentage > 85
    ? "linear-gradient(90deg, #ef4444, #dc2626)"
    : percentage > 60
    ? "linear-gradient(90deg, #f59e0b, #d97706)"
    : "linear-gradient(90deg, #22c55e, #16a34a)",
          }}
        ></div>
      </div>

      <p style={{ marginTop: "10px" }}>
        Confidence: <strong>{percentage}%</strong>
      </p>

      <p>
        Status:{" "}
        <strong style={{ color: result.is_duplicate ? "#ef4444" : "#22c55e" }}>
          {result.is_duplicate
            ? "Duplicate Business"
            : "Unique Business"}
        </strong>
      </p>

      {/* STATUS MESSAGE */}
      <p style={{ marginTop: "10px" }}>
        {result.is_duplicate ? (
          <span style={{ color: "#f59e0b" }}>
            Existing Business → Using existing UBID
          </span>
        ) : (
          <span style={{ color: "#22c55e" }}>
            New Business → UBID Created
          </span>
        )}
      </p>

      {/* ACTIVITY */}
      {result.activity && (
        <div style={styles.activityBox}>
          <h3>Activity Intelligence</h3>

          <p>
            State:{" "}
            <strong style={{ color: "#22c55e" }}>
              {result.activity_state}
            </strong>
          </p>

          <p>
            Activity Confidence:{" "}
            <strong>
              {Math.round(result.activity_confidence * 100)}%
            </strong>
          </p>

          <div style={{ marginTop: "10px" }}>
            <p>
              Total Events:{" "}
              {result.activity.features?.total_events}
            </p>

            <p>
              Payments:{" "}
              {result.activity.features?.payments}
            </p>

            <p>
              Inspections:{" "}
              {result.activity.features?.inspections}
            </p>

            <p>
              Renewals:{" "}
              {result.activity.features?.renewals}
            </p>

            <p>
              Recent Events:{" "}
              {result.activity.features?.recent_events}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: "20px",
    padding: "20px",
    borderRadius: "10px",
    background: "#111827",
    border: "1px solid #1f2937",
    width: "350px",
  },

  progressContainer: {
  height: "18px",
  background: "rgba(255,255,255,0.08)",
  borderRadius: "12px",
  overflow: "hidden",
  marginTop: "15px",
  boxShadow: "inset 0 0 10px rgba(0,0,0,0.4)",
},

  progressBar: {
  height: "100%",
  transition: "width 0.8s ease",
  borderRadius: "12px",
  boxShadow: "0 0 18px rgba(34,197,94,0.5)",
},

  activityBox: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "10px",
    background: "#1f2937",
  },
};

export default Dashboard;