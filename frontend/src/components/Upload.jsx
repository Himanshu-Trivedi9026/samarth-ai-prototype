import React, { useState } from "react";

const Upload = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = () => {
    onSubmit({ name, address });
  };

  return (
    <div style={styles.container}>
      <h2>Business Input</h2>

      <input
  className="input"
  placeholder="Business Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

<input
  className="input"
  placeholder="Address"
  value={address}
  onChange={(e) => setAddress(e.target.value)}
/>

<button className="btn" onClick={handleSubmit} disabled={!name || !address}>
  Check Duplicate
</button>
    </div>
  );
};

const styles = {
  container: { marginBottom: "20px" },
  input: {
    display: "block",
    margin: "10px 0",
    padding: "10px",
    width: "300px",
  },
  button: {
    padding: "10px 20px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default Upload;