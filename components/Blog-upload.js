import { useState } from "react";
import { useSession } from "next-auth/react";

export default function BlogUpload() {
  const { data: session } = useSession(); // Get the logged-in user session
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [status, setStatus] = useState("draft");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleUpload(event) {
    event.preventDefault();

    if (!session || !session.user?.email) {
      return setMessage("❌ Please log in to upload a blog");
    }

    if (!image) return setMessage("❌ Please select an image");

    const formData = new FormData();
    formData.append("email", session.user.email); // Send the email of logged-in user
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);
    formData.append("scheduleDate", scheduleDate);
    formData.append("status", status);
    formData.append("image", image);

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/uploadBlog", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Blog uploaded successfully!");
      } else {
        setMessage("❌ Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      setMessage("❌ Something went wrong");
    }
    setLoading(false);
  }


  return (
    <>
      <div
        style={{
          backgroundColor: "#28a745",
          color: "white",
          textAlign: "center",
          padding: "15px",
          fontSize: "24px",
          fontWeight: "bold",
          borderRadius: "8px 8px 0 0",
          margin: "auto",
          maxWidth: "1200px",
        }}
      >
        Write a Blog
      </div>

      <form
        onSubmit={handleUpload}
        style={{
          maxWidth: "2000px",
          margin: "0 auto",
          padding: "40px",
          display: "flex",
          gap: "40px",
          borderRadius: "0 0 16px 16px",
          background: "#fff",
          boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "380px",
              height: "320px",
              border: "2px dashed #ccc",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: "#f9f9f9",
            }}
            onClick={() => document.getElementById("imageUpload").click()}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "16px",
                }}
              />
            ) : (
              <span style={{ fontSize: "50px", fontWeight: "bold", color: "#555" }}>+</span>
            )}
          </div>
          <input id="imageUpload" type="file" onChange={handleImageChange} style={{ display: "none" }} required />

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Blog Title"
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
              outline: "none",
            }}
          />

          <input
            type="date"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
              outline: "none",
            }}
          />

          <div style={{ display: "flex", gap: "12px", width: "100%" }}>
            <button
              type="button"
              style={{
                flex: "1",
                padding: "12px",
                backgroundColor: "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
              onClick={() => setStatus("draft")}
            >
              Draft
            </button>
            <button
              type="button"
              style={{
                flex: "1",
                padding: "12px",
                backgroundColor: "#17a2b8",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
              onClick={() => setShowPreview(true)}
            >
              Preview
            </button>
            <button
              type="submit"
              style={{
                flex: "2",
                padding: "12px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Publish"}
            </button>
          </div>
        </div>

        <div style={{ flex: "3", display: "flex", flexDirection: "column", gap: "20px" }}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter Description"
            style={{
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
              outline: "none",
              resize: "vertical",
              minHeight: "120px",
            }}
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Enter Content"
            style={{
              padding: "14px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
              outline: "none",
              resize: "vertical",
              minHeight: "400px",
            }}
          />
        </div>
      </form>

      {message && <p style={{ textAlign: "center", color: message.includes("✅") ? "green" : "red" }}>{message}</p>}
    </>
  );
}
