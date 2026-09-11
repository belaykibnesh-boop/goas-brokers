import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";

export const PropertyForm: React.FC<{ userId: string }> = ({ userId }) => {
  const [formData, setFormData] = useState({
    category: "sale",
    site_name: "Ayat 49",
    block_no: "",
    floor_no: "",
    house_no: "",
    bedrooms: "2-bed",
    bathrooms: 1,
    asking_price: "",
    commission_percent: "2.00",
    phone_number: "",
  });

  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls: string[] = [];
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = `${Date.now()}_${file.name}`;
          const { data, error } = await supabase.storage
            .from("condo-images")
            .upload(fileName, file);

          if (data) {
            const publicUrl = supabase.storage
              .from("condo-images")
              .getPublicUrl(fileName).data.publicUrl;
            uploadedUrls.push(publicUrl);
          }
        }
      }

      const { error } = await supabase.from("properties").insert([
        {
          user_id: userId,
          ...formData,
          asking_price: parseFloat(formData.asking_price),
          commission_percent: parseFloat(formData.commission_percent),
          image_urls: uploadedUrls,
        },
      ]);

      if (error) throw error;
      alert("Condo Listing Successfully Registered & Queued for Broadcast!");
    } catch (err: any) {
      alert(`Error submitting form: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <h2>Register Condo Unit</h2>

      <label>Listing Purpose</label>
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      >
        <option value="sale">For Sale</option>
        <option value="rental">For Rent</option>
        <option value="guesthouse">Guest House</option>
      </select>

      <label>Condo Site Name</label>
      <select
        value={formData.site_name}
        onChange={(e) =>
          setFormData({ ...formData, site_name: e.target.value })
        }
      >
        <option value="Ayat 49">Ayat 49</option>
        <option value="Gotera">Gotera</option>
        <option value="Summit">Summit</option>
        <option value="Koye Feche">Koye Feche</option>
        <option value="Jeka">Jeka</option>
        <option value="Bole Bulbula">Bole Bulbula</option>
      </select>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          placeholder="Block No"
          required
          onChange={(e) =>
            setFormData({ ...formData, block_no: e.target.value })
          }
          style={{ flex: 1, padding: "8px" }}
        />
        <input
          placeholder="Floor No"
          required
          onChange={(e) =>
            setFormData({ ...formData, floor_no: e.target.value })
          }
          style={{ flex: 1, padding: "8px" }}
        />
        <input
          placeholder="House No"
          required
          onChange={(e) =>
            setFormData({ ...formData, house_no: e.target.value })
          }
          style={{ flex: 1, padding: "8px" }}
        />
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <select
          value={formData.bedrooms}
          onChange={(e) =>
            setFormData({ ...formData, bedrooms: e.target.value })
          }
          style={{ flex: 1, padding: "8px" }}
        >
          <option value="studio">Studio</option>
          <option value="1-bed">1 Bed</option>
          <option value="2-bed">2 Bed</option>
          <option value="3-bed">3 Bed</option>
        </select>
        <input
          type="number"
          placeholder="Price (ETB)"
          required
          onChange={(e) =>
            setFormData({ ...formData, asking_price: e.target.value })
          }
          style={{ flex: 1, padding: "8px" }}
        />
      </div>

      <label>Commission Rate (%)</label>
      <input
        type="number"
        step="0.1"
        value={formData.commission_percent}
        onChange={(e) =>
          setFormData({ ...formData, commission_percent: e.target.value })
        }
        style={{ padding: "8px" }}
      />

      <label>Registrant Contact Phone</label>
      <input
        type="tel"
        placeholder="+251..."
        required
        onChange={(e) =>
          setFormData({ ...formData, phone_number: e.target.value })
        }
        style={{ padding: "8px" }}
      />

      <label>Property Photos</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setFiles(e.target.files)}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "12px",
          background: "#0088cc",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
        }}
      >
        {loading ? "Processing..." : "Submit & Broadcast Listing"}
      </button>
    </form>
  );
};
