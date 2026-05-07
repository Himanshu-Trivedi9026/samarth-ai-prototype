import React, {
  useEffect,
  useState,
} from "react";

import BusinessGraph from "../components/BusinessGraph";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import { getAnalytics } from "../services/api";

const COLORS = [
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
];

const Analytics = () => {

  const [data, setData] =
    useState(null);

  useEffect(() => {

    fetchAnalytics();

  }, []);

  const fetchAnalytics =
    async () => {

      const result =
        await getAnalytics();

      console.log(
        "Analytics:",
        result
      );

      setData(result);
    };

  if (!data) {

    return (

      <div style={styles.loading}>
        Loading analytics...
      </div>
    );
  }

  const activityData = [

    {
      name: "ACTIVE",
      value:
        data.activity_distribution
          ?.ACTIVE || 0,
    },

    {
      name: "DORMANT",
      value:
        data.activity_distribution
          ?.DORMANT || 0,
    },

    {
      name: "CLOSED",
      value:
        data.activity_distribution
          ?.CLOSED || 0,
    },

    {
      name: "UNKNOWN",
      value:
        data.activity_distribution
          ?.UNKNOWN || 0,
    },
  ];

  const businessData = [

    {
      name: "Unique",
      value:
        data.unique_businesses,
    },

    {
      name: "Duplicate",
      value:
        data.duplicate_businesses,
    },
  ];

  return (

    <div style={styles.page}>

      <h1 style={styles.title}>
        UBID Analytics Dashboard
      </h1>

      {/* KPI CARDS */}

      <div style={styles.cardGrid}>

        <div style={styles.card}>
          <h2>Total Businesses</h2>
          <p style={styles.metric}>
            {data.total_businesses}
          </p>
        </div>

        <div style={styles.card}>
          <h2>Unique Businesses</h2>
          <p style={styles.metric}>
            {data.unique_businesses}
          </p>
        </div>

        <div style={styles.card}>
          <h2>Duplicates</h2>
          <p style={styles.metric}>
            {
              data.duplicate_businesses
            }
          </p>
        </div>

        <div style={styles.card}>
          <h2>Total Events</h2>
          <p style={styles.metric}>
            {data.total_events}
          </p>
        </div>

      </div>

      {/* CHARTS */}

      <div style={styles.chartGrid}>

        {/* ACTIVITY PIE */}

        <div style={styles.chartCard}>

          <h2>
            Activity Distribution
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <PieChart>

              <Pie
                data={activityData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >

                {activityData.map(
                  (
                    entry,
                    index
                  ) => (

                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

        {/* DUPLICATE BAR */}

        <div style={styles.chartCard}>

          <h2>
            Duplicate Analysis
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <BarChart
              data={businessData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="value"
                fill="#22c55e"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* GRAPH SECTION */}

      <div
        style={{
          marginTop: "40px",
        }}
      >

        <BusinessGraph
          analytics={data}
        />

      </div>

    </div>
  );
};

const styles = {

  page: {
    padding: "30px",
    color: "white",
    minHeight: "100vh",
  },

  title: {
    fontSize: "36px",
    marginBottom: "30px",
    color: "#22c55e",
  },

  loading: {
    color: "white",
    padding: "40px",
    fontSize: "24px",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "40px",
  },

  card: {
    background:
      "rgba(255,255,255,0.06)",
    padding: "30px",
    borderRadius: "20px",
    textAlign: "center",
    border:
      "1px solid rgba(255,255,255,0.08)",
    boxShadow:
      "0 8px 30px rgba(0,0,0,0.2)",
  },

  metric: {
    fontSize: "42px",
    color: "#22c55e",
    fontWeight: "bold",
  },

  chartGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(450px, 1fr))",
    gap: "30px",
  },

  chartCard: {
    background:
      "rgba(255,255,255,0.06)",
    padding: "25px",
    borderRadius: "20px",
    border:
      "1px solid rgba(255,255,255,0.08)",
  },
};

export default Analytics;