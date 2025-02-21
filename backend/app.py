from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import io
from PIL import Image
import json

app = Flask(__name__)

# Load TensorFlow Model
MODEL_PATH = "model/plant_disease_model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

# Load class labels dynamically
CLASS_LABELS = [
    "Apple__Apple_scab", "Apple__Black_rot", "Apple__Cedar_apple_rust", "Apple__healthy",
    "Blueberry__healthy", "Cherry__healthy", "Cherry__Powdery_mildew",
    "Corn__Cercospora_leaf_spot", "Corn__Common_rust", "Corn__Northern_Leaf_Blight", "Corn__healthy",
    "Grape__Black_rot", "Grape__Esca", "Grape__healthy", "Grape__Leaf_blight",
    "Orange__Haunglongbing", "Peach__Bacterial_spot", "Peach__healthy",
    "Pepper__Bacterial_spot", "Pepper__healthy", "Potato__Early_blight", "Potato__Late_blight", "Potato__healthy",
    "Raspberry__healthy", "Soybean__healthy", "Squash__Powdery_mildew",
    "Strawberry__Leaf_scorch", "Strawberry__healthy",
    "Tomato__Bacterial_spot", "Tomato__Early_blight", "Tomato__Late_blight",
    "Tomato__Leaf_Mold", "Tomato__Septoria_leaf_spot", "Tomato__Spider_mites",
    "Tomato__Target_Spot", "Tomato__Tomato_mosaic_virus", "Tomato__Tomato_Yellow_Leaf_Curl_Virus",
    "Unknown"  # Handling non-plant images
]

# Disease information (you can extend this dynamically)
disease_info = {
    "Apple__Apple_scab": {
        "problem": "Apple scab is a fungal disease that causes dark, scabby lesions on leaves and fruit.",
        "solution": "Use fungicides and remove infected leaves to prevent spread.",
        "care": "Ensure proper pruning and avoid excessive moisture."
    },
    "Apple__Black_rot": {
        "problem": "Black rot causes dark, sunken spots on apple fruit and leaves.",
        "solution": "Remove affected areas and use copper-based fungicides.",
        "care": "Avoid overhead watering and ensure good airflow."
    },
    "Unknown": {
        "problem": "This image does not match any known plant disease.",
        "solution": "Ensure you upload a clear image of a plant's leaf with visible symptoms.",
        "care": "Try using another image with proper focus and lighting."
    }
}

# Function to predict plant disease
def predict_disease(img_bytes):
    try:
        # Load and preprocess image
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB").resize((128, 128))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Make predictions
        predictions = model.predict(img_array)
        confidence_scores = predictions[0]  # Extract confidence scores for each class
        class_index = int(np.argmax(confidence_scores))  # Get highest class index
        confidence = float(round(100 * np.max(confidence_scores), 2))  # Convert to float

        # DEBUG: Print confidence scores for debugging
        print("Confidence Scores:", confidence_scores)

        # Define confidence threshold
        confidence_threshold = 70.0  

        # Handling unknown images
        if confidence < confidence_threshold or CLASS_LABELS[class_index] == "Unknown":
            return {
                "class": "Unknown",
                "confidence": confidence,
                "message": "This image does not match any known plant disease. Please upload a valid plant image."
            }

        # Get disease details
        disease = CLASS_LABELS[class_index]
        result = {
            "class": disease,
            "confidence": confidence,
            "problem": disease_info.get(disease, {}).get("problem", "No information available."),
            "solution": disease_info.get(disease, {}).get("solution", "No solution available."),
            "care": disease_info.get(disease, {}).get("care", "No care information available.")
        }
        return result
    except Exception as e:
        return {"error": str(e)}

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    img_bytes = file.read()  # Read file as bytes

    result = predict_disease(img_bytes)

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
