import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

interface Property {
  id: string;
  site_name: string;
  block_no: string;
  house_no: string;
  category: string;
  asking_price: number;
  status: "available" | "sold" | "rented" | "occupied";
}

export const MyListings: React.FC<{ userId: string }> = ({ userId }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProperties = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setProperties(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMyProperties();
  }, [userId]);

  const handleStatusChange = async (propertyId: string, newStatus: string) => {
    const { error } = await supabase
      .from("properties")
      .update({ status: newStatus })
      .eq("id", propertyId);

    if (!error) {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId ? { ...p, status: newStatus as any } : p,
        ),
      );
    } else {
      alert(`Update failed: ${error.message}`);
    }
  };

  if (loading)
    return <div style={{ padding: "16px" }}>Loading registered condos...</div>;

  return (
    <div
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <h3>My Property Listings</h3>
      {properties.map((p) => (
        <div
          key={p.id}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "#fdfdfd",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>
              {p.site_name} (Blk {p.block_no})
            </strong>
            <span
              style={{
                textTransform: "uppercase",
                fontSize: "12px",
                color: "#666",
              }}
            >
              {p.category}
            </span>
          </div>
          <p style={{ margin: "6px 0" }}>
            Price: {p.asking_price.toLocaleString()} ETB
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            <label style={{ fontSize: "12px" }}>Status:</label>
            <select
              value={p.status}
              onChange={(e) => handleStatusChange(p.id, e.target.value)}
              style={{ padding: "4px" }}
            >
              <option value="available">🟢 Available</option>
              <option value="sold">🔴 Sold</option>
              <option value="rented">🔴 Rented</option>
              <option value="occupied">🔴 Occupied</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};
