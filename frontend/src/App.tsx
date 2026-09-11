import React, { useState } from "react";
import { PropertyForm } from "./views/PropertyForm";
import { MyListings } from "./views/MyListings";

export default function App() {
  const [activeTab, setActiveTab] = useState<"register" | "manage">("register");

  // Static user ID anchor for prototype/testing (Replaced dynamically via initData)
  const TEST_USER_ID = "00000000-0000-0000-0000-000000000000";

  return (
    <div
      style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}
    >
      <nav
        style={{
          display: "flex",
          borderBottom: "1px solid #ccc",
          background: "#f8f9fa",
        }}
      >
        <button
          onClick={() => setActiveTab("register")}
          style={{
            flex: 1,
            padding: "12px",
            border: "none",
            background: activeTab === "register" ? "#0088cc" : "transparent",
            color: activeTab === "register" ? "#fff" : "#333",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ➕ Register Condo
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          style={{
            flex: 1,
            padding: "12px",
            border: "none",
            background: activeTab === "manage" ? "#0088cc" : "transparent",
            color: activeTab === "manage" ? "#fff" : "#333",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          📋 My Listings
        </button>
      </nav>

      {activeTab === "register" ? (
        <PropertyForm userId={TEST_USER_ID} />
      ) : (
        <MyListings userId={TEST_USER_ID} />
      )}
    </div>
  );
}
