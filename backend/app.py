from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import io
from PIL import Image
import json
import os

app = Flask(__name__)

# Load Model
MODEL_PATH = "model/plant_disease_model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

# Load Class Labels
with open("model/class_indices.json", "r") as f:
    CLASS_LABELS = json.load(f)

# Disease Information with Causes and Solutions
disease_info = {
    "Apple___Apple_scab": {
        "cause": "Caused by the fungus Venturia inaequalis, thriving in cool, wet conditions.",
        "problem": "Dark, scabby lesions appear on leaves and fruit, reducing yield quality.",
        "solution": "Apply fungicides such as captan or mancozeb early in the season.",
        "care": "Prune trees to improve air circulation and remove infected leaves.",
        "prevention": "Use resistant apple varieties and rake up fallen leaves to prevent reinfection."
    },
    "Apple___Black_rot": {
        "cause": "Caused by the fungus Botryosphaeria obtusa, spreading through infected debris.",
        "problem": "Circular, sunken black lesions appear on fruit, eventually shriveling them.",
        "solution": "Remove infected fruit and twigs; use fungicides like thiophanate-methyl.",
        "care": "Maintain proper orchard sanitation and ensure adequate tree nutrition.",
        "prevention": "Apply copper-based sprays and practice proper pruning techniques."
    },
    "Apple___Cedar_apple_rust": {
        "cause": "Caused by the fungus Gymnosporangium juniperi-virginianae, cycling between apple and juniper trees.",
        "problem": "Orange, rust-colored spots appear on leaves, leading to premature leaf drop.",
        "solution": "Remove nearby juniper hosts and apply fungicides like myclobutanil.",
        "care": "Prune and dispose of infected leaves to reduce fungal spread.",
        "prevention": "Plant resistant apple varieties and space trees properly for airflow."
    },
    "Apple___healthy": {
        "cause": "No disease detected.",
        "problem": "The apple plant is in good health.",
        "solution": "Continue with regular maintenance and care.",
        "care": "Ensure proper watering, pruning, and fertilization.",
        "prevention": "Monitor for any signs of disease and maintain orchard hygiene."
    },
    "Blueberry___healthy": {
        "cause": "No disease detected.",
        "problem": "The blueberry plant is in good health.",
        "solution": "Ensure optimal soil conditions and watering.",
        "care": "Prune dead branches and maintain proper spacing.",
        "prevention": "Regularly inspect plants for any early disease signs."
    },
    "Cherry_(including_sour)___Powdery_mildew": {
        "cause": "Caused by the Podosphaera clandestina fungus, thriving in humid environments.",
        "problem": "White powdery patches appear on leaves, reducing photosynthesis.",
        "solution": "Apply sulfur-based fungicides and prune to improve airflow.",
        "care": "Water plants at the base to reduce leaf moisture.",
        "prevention": "Use resistant cultivars and ensure proper spacing for ventilation."
    },
    "Cherry_(including_sour)___healthy": {
        "cause": "No disease detected.",
        "problem": "The cherry plant is in good health.",
        "solution": "Continue regular pruning and proper watering.",
        "care": "Maintain balanced soil nutrients and avoid waterlogging.",
        "prevention": "Inspect regularly for early signs of disease."
    },
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        "cause": "Caused by the Cercospora zeae-maydis fungus, spread through infected residues.",
        "problem": "Grayish rectangular lesions appear on leaves, reducing crop yield.",
        "solution": "Use resistant hybrids and apply fungicides if necessary.",
        "care": "Rotate crops and remove infected plant debris.",
        "prevention": "Maintain proper plant spacing and monitor fields regularly."
    },
    "Corn_(maize)___Common_rust_": {
        "cause": "Caused by the fungus Puccinia sorghi, spreading via airborne spores.",
        "problem": "Reddish-brown pustules form on both sides of leaves, reducing photosynthesis.",
        "solution": "Plant rust-resistant corn varieties and apply fungicides if severe.",
        "care": "Avoid excessive nitrogen fertilization and maintain good field drainage.",
        "prevention": "Remove infected plant residues and ensure proper crop rotation."
    },
    "Corn_(maize)___healthy": {
        "cause": "No disease detected.",
        "problem": "The corn plant is in good health.",
        "solution": "Continue regular watering and fertilization.",
        "care": "Ensure proper plant spacing and remove weeds.",
        "prevention": "Monitor plants for any signs of early disease."
    },
    "Grape___Black_rot": {
        "cause": "Caused by the fungus Guignardia bidwellii, thriving in warm, humid conditions.",
        "problem": "Dark, circular lesions with black spore masses develop on leaves and fruit.",
        "solution": "Apply fungicides like mancozeb and remove infected parts.",
        "care": "Prune vines to improve airflow and reduce moisture.",
        "prevention": "Use resistant grape varieties and practice good vineyard sanitation."
    },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "cause": "Caused by the fungus Pseudocercospora vitis, spreading through rain and wind.",
        "problem": "Brown necrotic spots appear on leaves, leading to defoliation.",
        "solution": "Apply copper-based fungicides and improve air circulation.",
        "care": "Avoid excessive nitrogen fertilization to prevent soft growth.",
        "prevention": "Ensure proper plant spacing and remove infected debris."
    },
    "Grape___healthy": {
        "cause": "No disease detected.",
        "problem": "The grape plant is in good health.",
        "solution": "Maintain regular vineyard care practices.",
        "care": "Ensure proper pruning and fertilization.",
        "prevention": "Monitor for early signs of disease and pests."
    },
    "Orange___Haunglongbing_(Citrus_greening)": {
        "cause": "Caused by bacteria Candidatus Liberibacter, spread by Asian citrus psyllid.",
        "problem": "Yellowing leaves, misshapen fruit, and tree decline.",
        "solution": "Remove infected trees and control psyllid populations.",
        "care": "Apply balanced fertilizers and irrigate properly.",
        "prevention": "Use disease-free seedlings and insect-proof nurseries."
    },
    "Peach___Bacterial_spot": {
        "cause": "Caused by the bacterium Xanthomonas campestris, spreading through rain splash.",
        "problem": "Dark spots on leaves and fruit, causing premature drop.",
        "solution": "Use copper-based bactericides and resistant peach varieties.",
        "care": "Prune infected branches and remove fallen leaves.",
        "prevention": "Avoid overhead irrigation and ensure proper air circulation."
    },
    "Peach___healthy": {
        "cause": "No disease detected.",
        "problem": "The peach plant is in good health.",
        "solution": "Maintain regular care and pruning.",
        "care": "Ensure balanced soil nutrients and pest control.",
        "prevention": "Monitor for early signs of disease."
    },
    "Tomato___Bacterial_spot": {
        "cause": "Caused by Xanthomonas bacteria, spreading through water splashes.",
        "problem": "Small, water-soaked lesions appear on leaves and fruit.",
        "solution": "Use copper-based sprays and remove infected plants.",
        "care": "Avoid overhead watering and rotate crops annually.",
        "prevention": "Plant disease-resistant tomato varieties."
    },
    "Tomato___Early_blight": {
        "cause": "Caused by the fungus Alternaria solani, thriving in warm, wet conditions.",
        "problem": "Dark concentric spots on lower leaves, causing wilting.",
        "solution": "Apply fungicides like chlorothalonil and practice crop rotation.",
        "care": "Remove infected leaves and ensure proper spacing.",
        "prevention": "Use resistant tomato varieties and provide good soil drainage."
    },
    "Tomato___healthy": {
        "cause": "No disease detected.",
        "problem": "The tomato plant is in good health.",
        "solution": "Continue regular watering and fertilization.",
        "care": "Prune excess foliage for better airflow.",
        "prevention": "Monitor for early disease symptoms."
    },
    "Pepper,_bell___Bacterial_spot": {
        "cause": "Caused by the bacterium Xanthomonas campestris, spread through water splashes.",
        "problem": "Dark, water-soaked lesions on leaves and fruit, reducing yield.",
        "solution": "Use copper-based sprays and remove infected plants.",
        "care": "Avoid overhead watering and maintain good plant spacing.",
        "prevention": "Rotate crops and use resistant pepper varieties."
    },
    "Pepper,_bell___healthy": {
        "cause": "No disease detected.",
        "problem": "The bell pepper plant is in good health.",
        "solution": "Continue regular watering and fertilization.",
        "care": "Monitor for early signs of disease and pests.",
        "prevention": "Ensure proper spacing and good soil drainage."
    },
    "Potato___Early_blight": {
        "cause": "Caused by the fungus Alternaria solani, thriving in warm, wet conditions.",
        "problem": "Dark concentric spots on older leaves, causing leaf drop.",
        "solution": "Apply fungicides like chlorothalonil or copper-based sprays.",
        "care": "Ensure good soil drainage and remove infected leaves.",
        "prevention": "Practice crop rotation and avoid overhead irrigation."
    },
    "Potato___Late_blight": {
        "cause": "Caused by the oomycete Phytophthora infestans, spreading in wet conditions.",
        "problem": "Irregular water-soaked lesions on leaves, leading to plant collapse.",
        "solution": "Apply fungicides like metalaxyl and remove infected plants.",
        "care": "Avoid excessive moisture and improve field ventilation.",
        "prevention": "Use certified disease-free potato seeds and rotate crops."
    },
    "Potato___healthy": {
        "cause": "No disease detected.",
        "problem": "The potato plant is in good health.",
        "solution": "Continue regular watering and fertilization.",
        "care": "Monitor for early signs of disease and pests.",
        "prevention": "Ensure proper soil drainage and use disease-resistant varieties."
    },
    "Raspberry___healthy": {
        "cause": "No disease detected.",
        "problem": "The raspberry plant is in good health.",
        "solution": "Maintain proper pruning and watering.",
        "care": "Monitor plants for any disease symptoms.",
        "prevention": "Ensure good soil drainage and airflow."
    },
    "Soybean___healthy": {
        "cause": "No disease detected.",
        "problem": "The soybean plant is in good health.",
        "solution": "Continue with optimal farming practices.",
        "care": "Monitor for pests and nutrient deficiencies.",
        "prevention": "Rotate crops and maintain soil health."
    },
    "Squash___Powdery_mildew": {
        "cause": "Caused by Podosphaera xanthii fungus, spreading in dry conditions.",
        "problem": "White, powdery spots appear on leaves, reducing plant growth.",
        "solution": "Apply sulfur or potassium bicarbonate-based fungicides.",
        "care": "Water plants at the base to reduce moisture on leaves.",
        "prevention": "Use resistant squash varieties and ensure proper plant spacing."
    },
    "Strawberry___Leaf_scorch": {
        "cause": "Caused by the fungus Diplocarpon earlianum, thriving in wet conditions.",
        "problem": "Brown spots with purple margins appear on leaves, leading to defoliation.",
        "solution": "Use fungicides like chlorothalonil and remove infected leaves.",
        "care": "Improve air circulation by spacing plants properly.",
        "prevention": "Avoid overhead irrigation and ensure good drainage."
    },
    "Strawberry___healthy": {
        "cause": "No disease detected.",
        "problem": "The strawberry plant is in good health.",
        "solution": "Maintain regular watering and fertilization.",
        "care": "Monitor for pests and diseases regularly.",
        "prevention": "Ensure proper soil drainage and good airflow."
    },
    "Tomato___Bacterial_spot": {
        "cause": "Caused by Xanthomonas bacteria, spreading through water splashes.",
        "problem": "Small, water-soaked lesions appear on leaves and fruit.",
        "solution": "Use copper-based sprays and remove infected plants.",
        "care": "Avoid overhead watering and rotate crops annually.",
        "prevention": "Plant disease-resistant tomato varieties."
    },
    "Tomato___Early_blight": {
        "cause": "Caused by the fungus Alternaria solani, thriving in warm, wet conditions.",
        "problem": "Dark concentric spots on lower leaves, causing wilting.",
        "solution": "Apply fungicides like chlorothalonil and practice crop rotation.",
        "care": "Remove infected leaves and ensure proper spacing.",
        "prevention": "Use resistant tomato varieties and provide good soil drainage."
    },
    "Tomato___Leaf_Mold": {
        "cause": "Caused by the fungus Passalora fulva, spreading in humid conditions.",
        "problem": "Yellow spots on leaves that turn brown, leading to defoliation.",
        "solution": "Apply copper-based fungicides and prune lower leaves.",
        "care": "Ensure proper ventilation and avoid excessive humidity.",
        "prevention": "Space plants properly and use resistant tomato varieties."
    },
    "Tomato___healthy": {
        "cause": "No disease detected.",
        "problem": "The tomato plant is in good health.",
        "solution": "Continue regular watering and fertilization.",
        "care": "Prune excess foliage for better airflow.",
        "prevention": "Monitor for early disease symptoms."
    },
    "unknown": {
        "cause": "Disease not recognized.",
        "problem": "The uploaded image does not match any known disease.",
        "solution": "Ensure clear image capture and try again.",
        "care": "Check plant health manually for any visible symptoms.",
        "prevention": "Use proper disease diagnosis tools for accurate identification."
    }
}

# Function to Predict Disease
def predict_disease(img_bytes):
    try:
        # Load and preprocess image
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB").resize((128, 128))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Make predictions
        predictions = model.predict(img_array)
        confidence_scores = predictions[0]  
        class_index = int(np.argmax(confidence_scores))  
        confidence = float(round(100 * np.max(confidence_scores), 2))  

        # Define confidence threshold
        confidence_threshold = 70.0  

        # Handling unknown images
        if confidence < confidence_threshold or CLASS_LABELS[str(class_index)] == "Unknown":
            return {
                "class": "Unknown",
                "confidence": confidence,
                "cause": disease_info["Unknown"]["cause"],
                "problem": disease_info["Unknown"]["problem"],
                "solution": disease_info["Unknown"]["solution"],
                "care": disease_info["Unknown"]["care"],
                "prevention": disease_info["Unknown"]["prevention"]
            }

        # Get disease details
        disease = CLASS_LABELS[str(class_index)]
        result = {
            "class": disease,
            "confidence": confidence,
            "cause": disease_info.get(disease, {}).get("cause", "No information available."),
            "problem": disease_info.get(disease, {}).get("problem", "No information available."),
            "solution": disease_info.get(disease, {}).get("solution", "No solution available."),
            "care": disease_info.get(disease, {}).get("care", "No care information available."),
            "prevention": disease_info.get(disease, {}).get("prevention", "No prevention information available.")
        }
        return result
    except Exception as e:
        return {"error": str(e)}

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    img_bytes = file.read()  

    result = predict_disease(img_bytes)

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
