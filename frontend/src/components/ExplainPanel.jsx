import React from "react";

const ExplainPanel = ({ result }) => {

  if (!result) return null;

  // ✅ FIXED HERE
  const breakdown =
    result.scores ||
    result.breakdown ||
    {};

  const percentage = Math.round(
    (result.similarity_score || 0) * 100
  );

  return (
    <div style={styles.container}>

      <h2 style={styles.title}>
        AI Explainability Engine
      </h2>

      {/* ================================= */}
      {/* MAIN SCORE */}
      {/* ================================= */}

      <div style={styles.scoreCard}>

        <div style={styles.scoreCircle}>
          {percentage}%
        </div>

        <div>

          <div style={styles.label}>
            Confidence Level
          </div>

          <div style={styles.value}>
            {result.confidence_level}
          </div>

        </div>
      </div>

      {/* ================================= */}
      {/* EXPLANATION */}
      {/* ================================= */}

      <div style={styles.section}>

        <div style={styles.sectionTitle}>
          AI Reasoning
        </div>

        <div style={styles.reasonBox}>
          {result.explanation}
        </div>

      </div>

      {/* ================================= */}
      {/* REVIEW */}
      {/* ================================= */}

      <div style={styles.section}>

        <div style={styles.sectionTitle}>
          Human Review
        </div>

        <div
          style={{
            ...styles.reviewBadge,

            background:
              result.review_needed
                ? "#f59e0b"
                : "#22c55e",
          }}
        >
          {result.review_needed
            ? "REVIEW REQUIRED"
            : "AUTO APPROVED"}
        </div>

      </div>

      {/* ================================= */}
      {/* BREAKDOWN */}
      {/* ================================= */}

      <div style={styles.section}>

        <div style={styles.sectionTitle}>
          Similarity Breakdown
        </div>

        <ScoreRow
          label="Semantic Name"
          value={breakdown.semantic_name_score}
        />

        <ScoreRow
          label="Semantic Address"
          value={breakdown.semantic_address_score}
        />

        <ScoreRow
          label="Fuzzy Name"
          value={breakdown.fuzzy_name_score}
        />

        <ScoreRow
          label="Fuzzy Address"
          value={breakdown.fuzzy_address_score}
        />

        <ScoreRow
          label="Final Name Score"
          value={breakdown.name_score}
        />

        <ScoreRow
          label="Final Address Score"
          value={breakdown.address_score}
        />

        <ScoreRow
          label="GST Score"
          value={breakdown.gst_score}
        />

      </div>

      {/* ================================= */}
      {/* GST */}
      {/* ================================= */}

      <div style={styles.section}>

        <div style={styles.sectionTitle}>
          GST Intelligence
        </div>

        <div style={styles.gstBox}>
          {breakdown.gst_reason || "No GST analysis available"}
        </div>

      </div>

    </div>
  );
};


const ScoreRow = ({ label, value }) => {

  const numericValue =
    typeof value === "number"
      ? value
      : parseFloat(value || 0);

  const percent = Math.round(
    numericValue * 100
  );

  return (

    <div style={styles.scoreRow}>

      <div style={styles.scoreLabel}>
        {label}
      </div>

      <div style={styles.progressContainer}>

        <div
          style={{
            ...styles.progressBar,
            width: `${percent}%`,
          }}
        />

      </div>

      <div style={styles.scoreValue}>
        {percent}%
      </div>

    </div>
  );
};


const styles = {

  container: {
    marginTop: "24px",
    padding: "28px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(14px)",
    color: "white",
  },

  title: {
    textAlign: "center",
    marginBottom: "28px",
    color: "#22c55e",
    fontSize: "28px",
  },

  scoreCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "25px",
    marginBottom: "35px",
    flexWrap: "wrap",
  },

  scoreCircle: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background: "#22c55e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "bold",
    boxShadow: "0 0 30px rgba(34,197,94,0.4)",
  },

  label: {
    fontSize: "16px",
    opacity: 0.7,
  },

  value: {
    fontSize: "32px",
    fontWeight: "bold",
  },

  section: {
    marginTop: "30px",
  },

  sectionTitle: {
    marginBottom: "14px",
    fontWeight: "bold",
    fontSize: "18px",
    color: "#22c55e",
  },

  reasonBox: {
    padding: "16px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.05)",
    lineHeight: "1.7",
  },

  reviewBadge: {
    display: "inline-block",
    padding: "12px 20px",
    borderRadius: "12px",
    fontWeight: "bold",
    color: "white",
  },

  scoreRow: {
    display: "grid",
    gridTemplateColumns: "180px 1fr 70px",
    gap: "15px",
    alignItems: "center",
    marginBottom: "14px",
  },

  scoreLabel: {
    fontSize: "14px",
  },

  progressContainer: {
    width: "100%",
    height: "12px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    background: "#22c55e",
    borderRadius: "999px",
    transition: "0.5s",
  },

  scoreValue: {
    textAlign: "right",
    fontWeight: "bold",
  },

  gstBox: {
    padding: "16px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.05)",
    color: "#facc15",
    lineHeight: "1.7",
  },
};

export default ExplainPanel;