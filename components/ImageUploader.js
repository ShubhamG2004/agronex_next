import { useState } from "react";

export default function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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
          <p><strong>Confidence:</strong> {prediction.confidence.toFixed(2)}%</p>
          <p><strong>Cause:</strong> {prediction.cause}</p>
          <p><strong>Problem:</strong> {prediction.problem}</p>
          <p><strong>Solution:</strong> {prediction.solution}</p>
        </div>
      )}
    </div>
  );
}
