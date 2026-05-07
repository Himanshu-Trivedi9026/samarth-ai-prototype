import React, { useEffect, useState } from "react";

const HistoryPanel = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("reviews")) || [];

    // latest first without mutating original
    const sorted = [...stored].reverse();

    setHistory(sorted);
  }, []);

  return (
    <div className="glass" style={styles.container}>
      <h3 style={styles.heading}>Review History</h3>

      {history.length === 0 ? (
        <div style={styles.emptyState}>
          No review actions yet
        </div>
      ) : (
        history.map((item, index) => (
          <div key={index} style={styles.row}>
            <span
              style={{
                ...styles.badge,
                ...getColor(item.decision),
              }}
            >
              {item.decision}
            </span>

            <span>
              {item.result?.is_duplicate
                ? "Duplicate"
                : "Unique"}
            </span>

            <span>
              {Math.round(
                (item.result?.similarity_score || 0) * 100
              )}
              %
            </span>

            <span style={styles.time}>
              {new Date(item.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

const getColor = (decision) => {
  if (decision === "ACCEPT") {
    return { background: "#22c55e" };
  }

  if (decision === "REJECT") {
    return { background: "#ef4444" };
  }

  return { background: "#f59e0b" };
};

const styles = {
  container: {
    marginTop: "30px",
    padding: "20px",
  },

  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "28px",
  },

  emptyState: {
    textAlign: "center",
    padding: "40px",
    opacity: 0.7,
    fontSize: "18px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
    padding: "14px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    fontSize: "14px",
  },

  badge: {
    padding: "6px 12px",
    borderRadius: "6px",
    color: "white",
    fontWeight: "bold",
    minWidth: "90px",
    textAlign: "center",
  },

  time: {
    opacity: 0.7,
  },
};

export default HistoryPanel;