const BASE_URL = "http://127.0.0.1:8000";

export const checkDuplicate = async (data) => {
  try {
    const payload = {
      businesses: [
        {
          ubid: "source-1",

          name: data.name,

          address: data.address,

          gstin: data.gstin || "",
        },
      ],

      events: [
        {
          ubid: "source-1",
          type: "payment",
          timestamp: new Date().toISOString(),
        },

        {
          ubid: "source-1",
          type: "inspection",
          timestamp: new Date().toISOString(),
        },

        {
          ubid: "source-1",
          type: "renewal",
          timestamp: new Date().toISOString(),
        },
      ],
    };

    console.log("REQUEST PAYLOAD:", payload);

    const response = await fetch(`${BASE_URL}/analyze/`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    const result = await response.json();

    console.log("API RESPONSE:", result);

    return result;

  } catch (error) {
    console.error("Analyze API Error:", error);

    return {
      error: "Backend connection failed",
    };
  }
};

export const classifyActivity = async (events) => {
  try {
    const response = await fetch(`${BASE_URL}/activity/batch`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(events),
    });

    return await response.json();

  } catch (error) {
    console.error("Activity API Error:", error);

    return {
      error: "Activity API failed",
    };
  }
};

export const getReviews = async () => {
  try {
    const response = await fetch(`${BASE_URL}/review/`);

    return await response.json();

  } catch (error) {
    console.error(error);

    return [];
  }
};

export const submitReview = async (reviewId, decision) => {
  try {
    const response = await fetch(`${BASE_URL}/review/`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        review_id: reviewId,
        decision,
      }),
    });

    return await response.json();

  } catch (error) {
    console.error(error);

    return {
      error: true,
    };
  }
};

export const uploadCSV = async (file) => {
  try {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/upload/`, {
      method: "POST",
      body: formData,
    });

    return await response.json();

  } catch (error) {
    console.error(error);

    return {
      error: true,
    };
  }
};


/* ======================================
   🔥 ANALYTICS API
====================================== */

export const getAnalytics = async () => {

  try {

    const response = await fetch(
      `${BASE_URL}/analytics/`
    );

    return await response.json();

  } catch (error) {

    console.error(
      "Analytics API Error:",
      error
    );

    return null;
  }
};