import { useState } from "react";

export default function ImageUploader() {
    const [file, setFile] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select an image first!");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/predict", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setPrediction(data);
        } catch (error) {
            alert("Error predicting disease!");
        }
        setLoading(false);
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <input type="file" onChange={handleFileChange} className="mb-4" />
            <button 
                onClick={handleUpload} 
                className="bg-green-600 text-white px-4 py-2 rounded"
                disabled={loading}
            >
                {loading ? "Analyzing..." : "Upload & Predict"}
            </button>

            {prediction && (
                <div className="mt-4 p-4 border rounded shadow">
                    <h3 className="text-xl font-bold">Prediction:</h3>
                    <p><strong>Class:</strong> {prediction.class}</p>
                    <p><strong>Confidence:</strong> {prediction.confidence.toFixed(2)}%</p>
                    <p><strong>Cause:</strong> {prediction.cause}</p>
                    <p><strong>Problem:</strong> {prediction.problem}</p>
                    <p><strong>Solution:</strong> {prediction.solution}</p>
                    <p><strong>Care:</strong> {prediction.care}</p>
                    <p><strong>Prevention:</strong> {prediction.prevention}</p>
                </div>
            )}
        </div>
    );
}
