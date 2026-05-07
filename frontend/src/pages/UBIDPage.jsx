import React, { useState } from "react";
import UBIDView from "../components/UBIDView";

const UBIDPage = () => {
  const [ubid, setUbid] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = () => {
    const history = JSON.parse(localStorage.getItem("reviews")) || [];

    const match = history.find(
      (item) => item.result?.ubid === ubid
    );

    if (match) {
      // 🔥 Transform data to match UBIDView format
      setResult({
        ubid: match.result.ubid,
        name: "Business Name (Demo)", // placeholder until backend
        address: "Address (Demo)",
        city: "City (Demo)",
        status: match.result.is_duplicate ? "DUPLICATE" : "UNIQUE",
        confidence: Math.round(match.result.similarity_score * 100),
        decision: match.decision,
      });
    } else {
      setResult({ error: true });
    }
  };

  return (
    <div style={styles.page}>
      <h1>UBID Lookup</h1>

      <div className="glass" style={styles.card}>
        <input
          className="input"
          placeholder="Enter UBID (e.g. BBGIE-123456)"
          value={ubid}
          onChange={(e) => setUbid(e.target.value)}
        />

        <button className="btn" onClick={handleSearch}>
          Search
        </button>

        {/* 🔥 NEW CLEAN DISPLAY */}
        <UBIDView data={result} />
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: "40px",
    color: "white",
  },
  card: {
    padding: "20px",
    marginTop: "20px",
  },
};

export default UBIDPage;