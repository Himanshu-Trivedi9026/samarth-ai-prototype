import React, { useState } from "react";
import Upload from "../components/Upload";
import Dashboard from "../components/Dashboard";
import ExplainPanel from "../components/ExplainPanel";

import {
  checkDuplicate,
  uploadCSV,
  getAnalytics,
} from "../services/api";

import ReviewPanel from "../components/ReviewPanel";
import HistoryPanel from "../components/HistoryPanel";
import QueryConsole from "../components/QueryConsole";

const Home = () => {

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [uploadResult, setUploadResult] = useState(null);

  const [analytics, setAnalytics] = useState(null);

  const handleSubmit = async (data) => {

    setLoading(true);

    const res = await checkDuplicate(data);

    console.log("FULL BACKEND RESPONSE:", res);

    const firstResult = res?.results?.[0];

    const explanation =
      res?.matching_explanations?.[0];

    const activity = firstResult?.activity;

    const formatted = {

      similarity_score:
        explanation?.scores?.total_score || 0,

      is_duplicate:
        explanation?.decision
          ?.toLowerCase()
          ?.includes("merge") || false,

      ubid: firstResult?.ubid || "N/A",

      business:
        firstResult?.business?.name || "N/A",

      activity: activity || null,

      activity_state:
        activity?.state || "Unknown",

      activity_confidence:
        activity?.confidence || 0,

      explanation:
        explanation?.decision ||
        explanation?.scores?.reason ||
        "No explanation available",

      review_needed:
        explanation?.confidence_level ===
          "medium" ||

        (
          (
            explanation?.scores
              ?.total_score || 0
          ) > 0.65 &&

          (
            explanation?.scores
              ?.total_score || 0
          ) < 0.90
        ),

      review_cases:
        res?.review_cases || [],
scores: explanation?.scores || {},
      raw_response: res,
    };

    setResult(formatted);

    const logs =
      JSON.parse(
        localStorage.getItem("queryLogs")
      ) || [];

    logs.unshift({
      time: new Date().toLocaleTimeString(),

      input:
        `${data.name} | ${data.address}`,

      output: {
        ubid: formatted.ubid,

        business:
          formatted.business,

        status:
          formatted.activity_state,
      },

      type:
        formatted.is_duplicate
          ? "EXISTING"
          : "NEW",
    });

    localStorage.setItem(
      "queryLogs",
      JSON.stringify(logs)
    );

    setLoading(false);
  };

  // ======================================
  // CSV UPLOAD HANDLER
  // ======================================

  const handleCSVUpload = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setUploading(true);

    const result = await uploadCSV(file);

    console.log(
      "UPLOAD RESULT:",
      result
    );

    setUploadResult(result);

    const analyticsData =
      await getAnalytics();

    console.log(
      "ANALYTICS:",
      analyticsData
    );

    setAnalytics(analyticsData);

    setUploading(false);
  };

  return (

    <div style={styles.page}>

      <h1 style={styles.title}>
        UBID System Dashboard
      </h1>

      <div style={styles.grid}>

        {/* LEFT */}

        <div
          className="glass"
          style={styles.card}
        >
          <Upload
            onSubmit={handleSubmit}
          />
        </div>

        {/* RIGHT */}

        <div
          className="glass"
          style={styles.card}
        >

          {loading && (

            <div
              style={
                styles.loaderContainer
              }
            >

              <div
                style={styles.loader}
              ></div>

              <p
                style={
                  styles.loaderText
                }
              >
                Processing business
                intelligence...
              </p>

            </div>
          )}

          {!result ? (

            <div
              style={
                styles.welcomeBox
              }
            >

              <h2
                style={
                  styles.welcomeTitle
                }
              >
                UBID Active Business
                Intelligence
              </h2>

              <p
                style={
                  styles.welcomeText
                }
              >
                Analyze businesses
                using:
              </p>

              <ul
                style={
                  styles.featureList
                }
              >
                <li>
                  ✔ Duplicate Detection
                </li>

                <li>
                  ✔ UBID Generation
                </li>

                <li>
                  ✔ Activity
                  Intelligence
                </li>

                <li>
                  ✔ AI Explainability
                </li>

                <li>
                  ✔ Human Review
                  Workflow
                </li>
              </ul>

              <p
                style={
                  styles.welcomeHint
                }
              >
                Enter a business
                name and address
                to begin analysis.
              </p>

            </div>

          ) : (

            <>

              <Dashboard
                result={result}
              />

              <ExplainPanel
                result={result}
              />

              <ReviewPanel
                result={result}
              />

            </>
          )}

        </div>

      </div>

      {/* CSV UPLOAD PANEL */}

      <div
        className="glass"
        style={styles.fullWidthCard}
      >

        <h2 style={styles.sectionTitle}>
          Department CSV Upload
        </h2>

        <p style={styles.sectionText}>
          Upload government department
          datasets for UBID intelligence
          processing.
        </p>

        <div style={styles.uploadBox}>

          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            style={styles.fileInput}
          />

          {uploading && (

            <p
              style={
                styles.processingText
              }
            >
              Processing CSV dataset...
            </p>
          )}

          {uploadResult && (

            <div
              style={
                styles.uploadResult
              }
            >

              <h3
                style={
                  styles.resultTitle
                }
              >
                Upload Complete
              </h3>

              <p>
                <strong>
                  Rows:
                </strong>{" "}
                {uploadResult.rows}
              </p>

              <p>
                <strong>
                  Columns:
                </strong>{" "}
                {uploadResult.columns?.join(
                  ", "
                )}
              </p>

            </div>
          )}

          {analytics && (

            <div
              style={
                styles.analyticsBox
              }
            >

              <h3
                style={
                  styles.resultTitle
                }
              >
                System Analytics
              </h3>

              <p>
                Total Businesses:
                {" "}
                {
                  analytics.total_businesses
                }
              </p>

              <p>
                Unique Businesses:
                {" "}
                {
                  analytics.unique_businesses
                }
              </p>

              <p>
                Duplicate Businesses:
                {" "}
                {
                  analytics.duplicate_businesses
                }
              </p>

              <p>
                Total Events:
                {" "}
                {
                  analytics.total_events
                }
              </p>

            </div>
          )}

        </div>

      </div>

      {/* HISTORY */}

      <div
        className="glass"
        style={styles.fullWidthCard}
      >
        <HistoryPanel />
      </div>

      {/* QUERY CONSOLE */}

      <div
        className="glass"
        style={styles.fullWidthCard}
      >
        <QueryConsole />
      </div>

    </div>
  );
};

const styles = {

  page: {
    padding: "20px",
    minHeight: "100vh",
    color: "white",
    fontFamily: "Arial",
    width: "100%",
    boxSizing: "border-box",
    overflowX: "hidden",
  },

  title: {
    fontSize: "32px",
    marginBottom: "30px",
  },

  grid: {
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
    alignItems: "flex-start",
    width: "100%",
  },

  card: {
    flex: 1,
    minWidth: "300px",
    width: "100%",
    padding: "20px",
    overflow: "hidden",
    borderRadius: "15px",
    height: "fit-content",
    boxSizing: "border-box",
  },

  fullWidthCard: {
    marginTop: "30px",
    padding: "20px",
    borderRadius: "15px",
  },

  welcomeBox: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "30px",
  },

  welcomeTitle: {
    fontSize: "28px",
    marginBottom: "20px",
    color: "#22c55e",
  },

  welcomeText: {
    fontSize: "18px",
    marginBottom: "15px",
  },

  featureList: {
    listStyle: "none",
    padding: 0,
    marginBottom: "25px",
    lineHeight: "2",
    fontSize: "16px",
  },

  welcomeHint: {
    opacity: 0.8,
    fontSize: "15px",
  },

  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
  },

  loader: {
    width: "55px",
    height: "55px",
    border:
      "5px solid rgba(255,255,255,0.15)",
    borderTop:
      "5px solid #22c55e",
    borderRadius: "50%",
    animation:
      "spin 1s linear infinite",
  },

  loaderText: {
    marginTop: "18px",
    fontSize: "15px",
    opacity: 0.9,
  },

  sectionTitle: {
    fontSize: "28px",
    marginBottom: "10px",
    color: "#22c55e",
  },

  sectionText: {
    opacity: 0.85,
    marginBottom: "20px",
  },

  uploadBox: {
    padding: "20px",
    borderRadius: "15px",
    background:
      "rgba(255,255,255,0.04)",
  },

  fileInput: {
    width: "100%",
    padding: "15px",
    borderRadius: "10px",
    background: "#1e293b",
    color: "white",
    border:
      "1px solid rgba(255,255,255,0.1)",
  },

  processingText: {
    marginTop: "15px",
    color: "#22c55e",
  },

  uploadResult: {
    marginTop: "20px",
    padding: "20px",
    borderRadius: "12px",
    background:
      "rgba(34,197,94,0.08)",
  },

  analyticsBox: {
    marginTop: "20px",
    padding: "20px",
    borderRadius: "12px",
    background:
      "rgba(59,130,246,0.08)",
  },

  resultTitle: {
    marginBottom: "15px",
    color: "#22c55e",
  },
};

export default Home;