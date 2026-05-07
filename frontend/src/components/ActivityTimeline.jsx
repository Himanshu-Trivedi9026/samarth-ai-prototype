import React, { useState } from "react";
import { classifyActivity } from "../services/api";

const ActivityTimeline = () => {
  const [data, setData] = useState({
    inspection_days: "",
    electricity: "",
    filings: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleCheck = async () => {
    const res = await classifyActivity(data);
    setResult(res);
  };

  return (
    <div style={styles.container}>
      <h2>Activity Intelligence</h2>

      <input
        className="input"
        name="inspection_days"
        placeholder="Days since last inspection"
        onChange={handleChange}
      />

      <input
        className="input"
        name="electricity"
        placeholder="Electricity usage"
        onChange={handleChange}
      />

      <input
        className="input"
        name="filings"
        placeholder="Filings count"
        onChange={handleChange}
      />

      <button className="btn btn-blue" onClick={handleCheck}>
        Analyze Activity
      </button>

      {result && (
        <p style={{ marginTop: "10px" }}>
          Status: <strong>{result.status}</strong>
        </p>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: "30px",
  },
};

export default ActivityTimeline;