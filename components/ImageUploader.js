import { useState } from "react";

export default function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold">Upload an Image</h2>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="p-2 border rounded-md"
      />
      
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Selected Preview"
          className="w-48 h-48 object-cover rounded-md border mt-2"
        />
      )}

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        {loading ? "Uploading..." : "Upload & Predict"}
      </button>

      {prediction && (
        <div className="mt-4 p-4 border rounded-md bg-gray-100">
          <h3 className="text-xl font-semibold">Prediction Result:</h3>
          
          <p><strong>Class:</strong> {prediction.class}</p>
          <p><strong>Confidence:</strong> {prediction.confidence ? `${prediction.confidence.toFixed(2)}%` : "N/A"}</p>
          <p><strong>Cause:</strong> {prediction.cause || "No information available"}</p>
          <p><strong>Problem:</strong> {prediction.problem || "No information available"}</p>
          <p><strong>Solution:</strong> {prediction.solution || "No solution available"}</p>

          
        </div>
      )}
    </div>
  );
}
