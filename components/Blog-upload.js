import { useState } from "react";
import { useSession } from "next-auth/react";

export default function BlogUpload() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [status, setStatus] = useState("draft");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  
  const categories = [
      "Disease",
      "Technology",
      "Plant Pathology",
      "Crop Protection",
      "Pest and Disease Control",
      "Soil Health and Nutrients",
      "Organic Farming and Disease Management",
      "Fungal Infections in Plants",
      "Bacterial Plant Diseases",
      "Viral Plant Diseases",
      "Climate Impact on Plant Health",
      "Precision Agriculture & Disease Detection",
      "AI & Machine Learning in Plant Disease Diagnosis",
      "Integrated Pest Management (IPM)",
      "Sustainable Agriculture & Disease Prevention",
      "Genetic Engineering for Disease Resistance",
      "Herbal & Natural Remedies for Plant Diseases",
      "Other"
  ];


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

    const finalCategory = category === "Other" ? customCategory : category;

    const formData = new FormData();
    formData.append("email", session.user.email);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);
    formData.append("scheduleDate", scheduleDate);
    formData.append("status", status);
    formData.append("category", finalCategory);
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
        resetForm();
      } else {
        setMessage("❌ Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      setMessage("❌ Something went wrong");
    }
    setLoading(false);
  }

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setContent("");
    setScheduleDate("");
    setStatus("draft");
    setImage(null);
    setPreview(null);
    setCategory("");
    setCustomCategory("");
    setShowPreview(false);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

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
          flexDirection: { xs: "column", md: "row" },
          gap: "40px",
          borderRadius: "0 0 16px 16px",
          background: "#fff",
          boxShadow: "0px 6px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Left Section - Form Inputs */}
        <div style={{ 
          flex: "1", 
          display: "flex", 
          flexDirection: "column", 
          gap: "20px",
          minWidth: "300px"
        }}>
          <div
            style={{
              width: "100%",
              maxWidth: "380px",
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
          <input 
            id="imageUpload" 
            type="file" 
            onChange={handleImageChange} 
            style={{ display: "none" }} 
            accept="image/*"
            required 
          />

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

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "16px",
              outline: "none",
            }}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {category === "Other" && (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter Custom Category"
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
          )}
        </div>

        {/* Right Section - Content and Buttons */}
        <div style={{ 
          flex: "3", 
          display: "flex", 
          flexDirection: "column", 
          gap: "20px",
          minWidth: "0"
        }}>
          {showPreview ? (
            <div style={{
              padding: "20px",
              border: "1px solid #eee",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9"
            }}>
              <h2 style={{ marginTop: 0 }}>{title || "Preview Title"}</h2>
              {preview && (
                <img 
                  src={preview} 
                  alt="Preview" 
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "contain",
                    borderRadius: "8px",
                    marginBottom: "20px"
                  }} 
                />
              )}
              <p style={{ color: "#666", fontSize: "18px" }}>
                {description || "Preview description will appear here"}
              </p>
              <div style={{ 
                marginTop: "20px",
                lineHeight: "1.6",
                whiteSpace: "pre-wrap"
              }}>
                {content || "Blog content will appear here"}
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}

          {/* Button Group - Now in right section */}
          <div style={{ 
            display: "flex", 
            gap: "12px",
            justifyContent: "flex-end",
            flexWrap: "wrap"
          }}>
            <button
              type="button"
              onClick={() => setStatus("draft")}
              style={{
                padding: "12px 24px",
                backgroundColor: status === "draft" ? "#5a6268" : "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                minWidth: "120px"
              }}
            >
              Save Draft
            </button>
            
            <button
              type="button"
              onClick={togglePreview}
              style={{
                padding: "12px 24px",
                backgroundColor: showPreview ? "#6c757d" : "#17a2b8",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                minWidth: "120px"
              }}
            >
              {showPreview ? "Hide Preview" : "Preview"}
            </button>
            
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                minWidth: "120px"
              }}
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </form>

      {message && (
        <p style={{ 
          textAlign: "center", 
          color: message.includes("✅") ? "green" : "red",
          margin: "20px 0",
          fontWeight: "bold"
        }}>
          {message}
        </p>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          form {
            flex-direction: column;
            padding: 20px;
            gap: 20px;
          }
          
          div[style*="flex: 1"], 
          div[style*="flex: 3"] {
            width: 100%;
          }
          
          div[style*="width: 380px"] {
            width: 100%;
            height: 250px;
          }
          
          div[style*="justify-content: flex-end"] {
            justify-content: center !important;
          }
        }
        
        @media (max-width: 480px) {
          button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}