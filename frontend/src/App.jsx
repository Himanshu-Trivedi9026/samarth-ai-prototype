import React, { useState } from "react";
import Home from "./pages/Home";
import UBIDPage from "./pages/UBIDPage";
import ReviewPage from "./pages/ReviewPage";
import Analytics from "./pages/Analytics";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div>
      {/* Enhanced Navigation */}
      <div style={styles.nav}>
        <div style={styles.logo}>SAMARTH AI</div>

        <div style={styles.navButtons}>
          <button
            style={{
              ...styles.btn,
              ...(page === "home" && styles.active),
            }}
            onClick={() => setPage("home")}
          >
            Dashboard
          </button>

          <button
            style={{
              ...styles.btn,
              ...(page === "ubid" && styles.active),
            }}
            onClick={() => setPage("ubid")}
          >
            UBID Lookup
          </button>

          <button
            style={{
              ...styles.btn,
              ...(page === "review" && styles.active),
            }}
            onClick={() => setPage("review")}
          >
            Review Dashboard
          </button>

          <button
            style={{
              ...styles.btn,
              ...(page === "analytics" && styles.active),
            }}
            onClick={() => setPage("analytics")}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Page Rendering */}
      {page === "home" && <Home />}
      {page === "ubid" && <UBIDPage />}
      {page === "review" && <ReviewPage />}
      {page === "analytics" && <Analytics />}
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backdropFilter: "blur(12px)",
    background: "rgba(2, 6, 23, 0.7)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },

  logo: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#22c55e",
  },

  navButtons: {
    display: "flex",
    gap: "10px",
  },

  btn: {
    padding: "8px 15px",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
  },

  active: {
    background: "#22c55e",
    color: "#020617",
    boxShadow: "0 0 10px #22c55e",
  },
};

export default App;