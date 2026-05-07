import React from "react";

import ReactFlow, {
  Background,
  Controls,
} from "reactflow";

import "reactflow/dist/style.css";

const BusinessGraph = ({
  analytics,
}) => {

  if (!analytics) {
    return null;
  }

  // =========================
  // NODES
  // =========================

  const nodes = [

    {
      id: "1",

      position: {
        x: 250,
        y: 50,
      },

      data: {
        label:
          `Total Businesses: ${analytics.total_businesses}`,
      },

      style: {
        background: "#22c55e",
        color: "white",
        border: "none",
        padding: 10,
        borderRadius: 12,
        width: 220,
      },
    },

    {
      id: "2",

      position: {
        x: 50,
        y: 220,
      },

      data: {
        label:
          `Unique: ${analytics.unique_businesses}`,
      },

      style: {
        background: "#3b82f6",
        color: "white",
        border: "none",
        padding: 10,
        borderRadius: 12,
        width: 180,
      },
    },

    {
      id: "3",

      position: {
        x: 450,
        y: 220,
      },

      data: {
        label:
          `Duplicates: ${analytics.duplicate_businesses}`,
      },

      style: {
        background: "#ef4444",
        color: "white",
        border: "none",
        padding: 10,
        borderRadius: 12,
        width: 180,
      },
    },

    {
      id: "4",

      position: {
        x: 250,
        y: 400,
      },

      data: {
        label:
          `Events: ${analytics.total_events}`,
      },

      style: {
        background: "#f59e0b",
        color: "white",
        border: "none",
        padding: 10,
        borderRadius: 12,
        width: 180,
      },
    },
  ];

  // =========================
  // EDGES
  // =========================

  const edges = [

    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
    },

    {
      id: "e1-3",
      source: "1",
      target: "3",
      animated: true,
    },

    {
      id: "e2-4",
      source: "2",
      target: "4",
      animated: true,
    },
  ];

  return (

    <div
      style={{
        width: "100%",
        height: "600px",
        background:
          "rgba(255,255,255,0.06)",
        borderRadius: "20px",
        overflow: "hidden",
        border:
          "1px solid rgba(255,255,255,0.08)",
      }}
    >

      <div
        style={{
          textAlign: "center",
          color: "#22c55e",
          fontSize: "32px",
          fontWeight: "bold",
          paddingTop: "20px",
        }}
      >
        UBID Relationship Graph
      </div>

      <div
        style={{
          width: "100%",
          height: "520px",
        }}
      >

        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
        >

          <Background />

          <Controls />

        </ReactFlow>

      </div>

    </div>
  );
};

export default BusinessGraph;