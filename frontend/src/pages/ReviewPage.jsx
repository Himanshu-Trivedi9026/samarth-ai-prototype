import React, {
  useEffect,
  useState,
} from "react";

const ReviewPage = () => {

  const [history, setHistory] =
    useState([]);

  const [filter, setFilter] =
    useState("ALL");

  useEffect(() => {

    const data =
      JSON.parse(
        localStorage.getItem(
          "reviews"
        )
      ) || [];

    setHistory(data.reverse());

  }, []);

  const filteredData =

    filter === "ALL"

      ? history

      : history.filter(
          (item) =>
            item.decision === filter
        );

  return (

    <div style={styles.page}>

      {/* HEADER */}

      <div style={styles.topSection}>

        <div>

          <h1 style={styles.title}>
            Human Review Intelligence
          </h1>

          <p style={styles.subtitle}>
            AI-assisted business
            verification and merge
            decision workflow.
          </p>

        </div>

        <div style={styles.statsBox}>

          <StatCard
            title="Total Reviews"
            value={history.length}
            color="#22c55e"
          />

          <StatCard
            title="Accepted"
            value={
              history.filter(
                (h) =>
                  h.decision ===
                  "ACCEPT"
              ).length
            }
            color="#3b82f6"
          />

          <StatCard
            title="Rejected"
            value={
              history.filter(
                (h) =>
                  h.decision ===
                  "REJECT"
              ).length
            }
            color="#ef4444"
          />

        </div>

      </div>

      {/* FILTERS */}

      <div style={styles.filters}>

        <FilterButton
          active={
            filter === "ALL"
          }
          label="ALL"
          setFilter={setFilter}
        />

        <FilterButton
          active={
            filter === "ACCEPT"
          }
          label="ACCEPT"
          setFilter={setFilter}
        />

        <FilterButton
          active={
            filter === "REJECT"
          }
          label="REJECT"
          setFilter={setFilter}
        />

        <FilterButton
          active={
            filter === "REVIEW"
          }
          label="REVIEW"
          setFilter={setFilter}
        />

      </div>

      {/* REVIEW CARDS */}

      <div style={styles.reviewGrid}>

        {filteredData.map(
          (item, index) => {

            const confidence =
              Math.round(
                (
                  item.result
                    ?.similarity_score ||
                  0
                ) * 100
              );

            return (

              <div
                key={index}
                style={styles.reviewCard}
              >

                {/* TOP */}

                <div
                  style={
                    styles.cardHeader
                  }
                >

                  <div
                    style={{
                      ...styles.badge,

                      ...getColor(
                        item.decision
                      ),
                    }}
                  >
                    {item.decision}
                  </div>

                  <div
                    style={
                      styles.confidence
                    }
                  >
                    {confidence}%
                  </div>

                </div>

                {/* BUSINESS */}

                <div
                  style={
                    styles.businessBox
                  }
                >

                  <h3
                    style={
                      styles.businessName
                    }
                  >
                    {
                      item.result
                        ?.business
                    }
                  </h3>

                  <p
                    style={
                      styles.ubid
                    }
                  >
                    UBID:
                    {" "}
                    {
                      item.result
                        ?.ubid
                    }
                  </p>

                </div>

                {/* STATUS */}

                <div
                  style={
                    styles.statusRow
                  }
                >

                  <span>
                    Duplicate
                    Status
                  </span>

                  <strong
                    style={{
                      color:
                        item.result
                          ?.is_duplicate
                          ? "#ef4444"
                          : "#22c55e",
                    }}
                  >

                    {item.result
                      ?.is_duplicate
                      ? "DUPLICATE"
                      : "UNIQUE"}

                  </strong>

                </div>

                {/* EXPLANATION */}

                <div
                  style={
                    styles.reasonBox
                  }
                >

                  <h4
                    style={
                      styles.sectionTitle
                    }
                  >
                    AI Reasoning
                  </h4>

                  <p
                    style={
                      styles.reasonText
                    }
                  >
                    {
                      item.result
                        ?.explanation
                    }
                  </p>

                </div>

                {/* REVIEW STATUS */}

                <div
                  style={
                    styles.reviewRow
                  }
                >

                  <span>
                    Human Review
                  </span>

                  <div
                    style={{
                      ...styles.reviewBadge,

                      background:
                        item.result
                          ?.review_needed
                          ? "#f59e0b"
                          : "#22c55e",
                    }}
                  >

                    {item.result
                      ?.review_needed
                      ? "REQUIRED"
                      : "NOT REQUIRED"}

                  </div>

                </div>

                {/* FOOTER */}

                <div
                  style={
                    styles.footer
                  }
                >

                  {new Date(
                    item.timestamp
                  ).toLocaleString()}

                </div>

              </div>
            );
          }
        )}

      </div>

      {/* EMPTY */}

      {filteredData.length === 0 && (

        <div style={styles.emptyBox}>
          No review records found.
        </div>

      )}

    </div>
  );
};

const FilterButton = ({
  label,
  active,
  setFilter,
}) => (

  <button
    onClick={() =>
      setFilter(label)
    }
    style={{
      ...styles.filterBtn,

      background: active
        ? "#22c55e"
        : "rgba(255,255,255,0.06)",
    }}
  >
    {label}
  </button>
);

const StatCard = ({
  title,
  value,
  color,
}) => (

  <div style={styles.statCard}>

    <h4>{title}</h4>

    <div
      style={{
        ...styles.statValue,
        color,
      }}
    >
      {value}
    </div>

  </div>
);

const getColor = (
  decision
) => {

  if (decision === "ACCEPT") {

    return {
      background: "#22c55e",
    };
  }

  if (decision === "REJECT") {

    return {
      background: "#ef4444",
    };
  }

  return {
    background: "#f59e0b",
  };
};

const styles = {

  page: {
    padding: "35px",
    color: "white",
    minHeight: "100vh",
  },

  topSection: {
    display: "flex",
    justifyContent:
      "space-between",
    gap: "30px",
    flexWrap: "wrap",
    marginBottom: "35px",
  },

  title: {
    fontSize: "40px",
    color: "#22c55e",
    marginBottom: "10px",
  },

  subtitle: {
    opacity: 0.8,
    maxWidth: "600px",
    lineHeight: "1.7",
  },

  statsBox: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  statCard: {
    background:
      "rgba(255,255,255,0.05)",
    padding: "20px",
    borderRadius: "18px",
    minWidth: "150px",
    textAlign: "center",
    border:
      "1px solid rgba(255,255,255,0.08)",
  },

  statValue: {
    fontSize: "34px",
    fontWeight: "bold",
    marginTop: "10px",
  },

  filters: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "35px",
  },

  filterBtn: {
    border: "none",
    padding: "12px 22px",
    borderRadius: "14px",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s",
  },

  reviewGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(380px, 1fr))",
    gap: "25px",
  },

  reviewCard: {
    background:
      "rgba(255,255,255,0.05)",
    borderRadius: "22px",
    padding: "24px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
  },

  cardHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  badge: {
    padding: "8px 16px",
    borderRadius: "30px",
    fontWeight: "bold",
    fontSize: "13px",
  },

  confidence: {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#22c55e",
  },

  businessBox: {
    marginBottom: "20px",
  },

  businessName: {
    fontSize: "24px",
    marginBottom: "10px",
  },

  ubid: {
    opacity: 0.8,
    wordBreak: "break-all",
  },

  statusRow: {
    display: "flex",
    justifyContent:
      "space-between",
    marginBottom: "20px",
  },

  reasonBox: {
    background:
      "rgba(255,255,255,0.04)",
    padding: "18px",
    borderRadius: "14px",
    marginBottom: "20px",
  },

  sectionTitle: {
    color: "#22c55e",
    marginBottom: "10px",
  },

  reasonText: {
    lineHeight: "1.7",
    opacity: 0.9,
  },

  reviewRow: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  reviewBadge: {
    padding: "8px 16px",
    borderRadius: "30px",
    fontWeight: "bold",
    fontSize: "13px",
  },

  footer: {
    paddingTop: "15px",
    borderTop:
      "1px solid rgba(255,255,255,0.08)",
    opacity: 0.7,
    fontSize: "13px",
  },

  emptyBox: {
    marginTop: "50px",
    textAlign: "center",
    opacity: 0.7,
  },
};

export default ReviewPage;