import React from "react";

const QueryConsole = () => {
  const logs = JSON.parse(localStorage.getItem("queryLogs")) || [];

  if (logs.length === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>System Query Console</h2>

        <div style={styles.emptyBox}>
          No queries processed yet
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>System Query Console</h2>

      {logs
        .slice()
        .reverse()
        .map((log, index) => {
          const result = log.output?.results?.[0];

          return (
            <div key={index} style={styles.logCard}>
              <p style={styles.time}>{log.time}</p>

              <p>
                <strong>Input:</strong> {log.input}
              </p>

              <p>
                <strong>UBID:</strong>{" "}
                {result?.ubid || log.output?.ubid || "N/A"}
              </p>

              <p>
                <strong>Business:</strong>{" "}
                {result?.business?.name ||
                  log.output?.business ||
                  "N/A"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {result?.activity?.state ||
                  log.output?.status ||
                  "N/A"}
              </p>
            </div>
          );
        })}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },

  heading: {
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "20px",
  },

  emptyBox: {
    textAlign: "center",
    padding: "50px",
    opacity: 0.7,
    fontSize: "18px",
  },

  logCard: {
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  time: {
    fontSize: "12px",
    opacity: 0.7,
    marginBottom: "8px",
  },
};

export default QueryConsole;