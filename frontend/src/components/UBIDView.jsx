import React from "react";

const UBIDView = ({ data }) => {
  if (!data) return null;

  if (data.error) {
    return (
      <div className="glass" style={styles.container}>
        <h3 style={{ color: "#ef4444" }}>❌ Business Not Found</h3>
        <p style={{ opacity: 0.7 }}>No record found for this UBID.</p>
      </div>
    );
  }

  return (
    <div className="glass" style={styles.container}>
      <h2 style={styles.title}>Business Details</h2>

      <div style={styles.row}>
        <span style={styles.label}>UBID</span>
        <span style={styles.value}>{data.ubid}</span>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>Business Name</span>
        <span style={styles.value}>{data.name}</span>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>Address</span>
        <span style={styles.value}>{data.address}</span>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>City</span>
        <span style={styles.value}>{data.city}</span>
      </div>

      <div style={styles.row}>
        <span style={styles.label}>Status</span>
        <span
          style={{
            ...styles.status,
            color:
              data.status === "ACTIVE"
                ? "#22c55e"
                : data.status === "DORMANT"
                ? "#f59e0b"
                : "#ef4444",
          }}
        >
          {data.status}
        </span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: "20px",
    padding: "20px",
    borderRadius: "15px",
    backdropFilter: "blur(15px)",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  title: {
    marginBottom: "15px",
    fontSize: "20px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    paddingBottom: "5px",
  },
  label: {
    opacity: 0.6,
  },
  value: {
    fontWeight: "bold",
  },
  status: {
    fontWeight: "bold",
  },
};

export default UBIDView;