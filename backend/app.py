from flask import Flask, request, jsonify
from flask_cors import CORS 
import tensorflow as tf
import numpy as np
import io
from PIL import Image
import json
import os

app = Flask(__name__)
CORS(app) 

# Load Model
MODEL_PATH = "model/plant_disease_model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

# Load Class Labels
with open("model/class_indices.json", "r") as f:
    CLASS_LABELS = json.load(f)

# Disease Information with Causes and Solutions
disease_info = {
     "Apple___Apple_scab": {
        "cause": "Apple scab is caused by the fungus Venturia inaequalis, which thrives in cool, wet conditions, especially during spring and early summer. The spores spread via wind and rain, infecting leaves, fruit, and young twigs.",
        "problem": "Dark, velvety, olive-green to black scabby lesions appear on leaves and fruit, leading to defoliation and reduced fruit quality. Severe infections can cause premature fruit drop, affecting yield.",
        "solution": "Apply fungicides such as captan or mancozeb early in the season, starting before bud break and continuing throughout the growing season, especially during wet weather.",
        "care": "Prune trees to improve air circulation, reduce humidity around foliage, and remove infected leaves and twigs to limit fungal spread. Keep trees well-fertilized and watered to maintain overall health.",
        "prevention": "Choose resistant apple varieties like Liberty or Enterprise. Rake up fallen leaves and discard them away from the orchard to prevent reinfection in the following season."
    },
    "Apple___Black_rot": {
        "cause": "Black rot is caused by the fungus Botryosphaeria obtusa, which overwinters in infected fruit, twigs, and bark. It spreads via rain, wind, and insects, attacking stressed or weakened trees.",
        "problem": "Circular, sunken black lesions appear on fruit, turning into rotting areas that eventually cause the fruit to shrivel. Infected leaves develop reddish-brown lesions with a 'frog-eye' appearance. Twigs may also show dieback.",
        "solution": "Remove and destroy infected fruit, twigs, and bark. Apply fungicides like thiophanate-methyl or captan during the growing season. Copper-based sprays can help prevent early infections.",
        "care": "Maintain proper orchard sanitation by removing fallen leaves and pruning out dead or infected branches. Ensure trees receive adequate nutrients and water to enhance resistance.",
        "prevention": "Plant disease-resistant apple varieties. Apply protective fungicides before the rainy season, as moisture promotes fungal growth. Space trees properly to allow for good airflow."
    },
    "Apple___Cedar_apple_rust": {
        "cause": "This disease is caused by the fungus Gymnosporangium juniperi-virginianae, which requires both apple and juniper trees to complete its lifecycle. It spreads through airborne spores from juniper to apple trees in the spring.",
        "problem": "Orange, rust-colored spots appear on apple leaves, expanding over time and leading to premature leaf drop. Severely infected trees experience reduced fruit production and weakened overall health.",
        "solution": "Remove nearby juniper hosts within a few hundred feet of apple trees. Apply fungicides such as myclobutanil or propiconazole in early spring before symptoms appear.",
        "care": "Regularly inspect apple and juniper trees for signs of infection. Prune and dispose of infected leaves to minimize fungal spread.",
        "prevention": "Plant resistant apple varieties like Liberty, Enterprise, or Redfree. Ensure proper spacing between apple trees for good airflow to reduce humidity, which favors fungal development."
    },
    "Apple___healthy": {
        "cause": "No disease detected.",
        "problem": "The apple tree is thriving with no visible signs of infection or stress.",
        "solution": "Continue with regular maintenance, including timely pruning and fertilization.",
        "care": "Ensure adequate watering, proper nutrient supply, and periodic inspection to catch early signs of disease.",
        "prevention": "Practice good orchard hygiene by removing fallen leaves and pruning excess growth. Monitor for potential disease threats and take preventive action if necessary."
    },
    "Blueberry___healthy": {
        "cause": "No disease detected.",
        "problem": "The blueberry plant is in excellent health, with no visible signs of disease or stress.",
        "solution": "Maintain consistent watering, ensuring the soil remains moist but not waterlogged.",
        "care": "Regularly prune dead or weak branches to encourage healthy growth and air circulation. Mulch around the base to retain soil moisture and suppress weeds.",
        "prevention": "Regularly inspect plants for early signs of disease or pests. Avoid overhead watering to reduce humidity and fungal risk."
    },
    "Cherry_(including_sour)___Powdery_mildew": {
        "cause": "Powdery mildew is caused by the fungus Podosphaera clandestina, which thrives in warm, humid conditions and spreads via windborne spores.",
        "problem": "White, powdery fungal growth appears on leaves, reducing photosynthesis. Infected leaves may curl, turn yellow, and drop prematurely. Severe cases can stunt tree growth and reduce fruit yield.",
        "solution": "Apply sulfur-based fungicides or potassium bicarbonate sprays early in the season when symptoms first appear. Pruning helps improve airflow, reducing fungal development.",
        "care": "Water trees at the base rather than overhead to prevent excessive leaf moisture. Remove and dispose of infected leaves to reduce spore spread.",
        "prevention": "Plant resistant cherry cultivars if available. Maintain adequate spacing between trees and prune regularly to allow for good air circulation."
    },
    "Cherry_(including_sour)___healthy": {
        "cause": "No disease detected.",
        "problem": "The cherry tree is in excellent health, with no visible symptoms of disease or stress.",
        "solution": "Continue regular maintenance, including proper pruning and soil nutrition management.",
        "care": "Maintain balanced soil nutrients, avoid overwatering, and ensure adequate sunlight exposure.",
        "prevention": "Regularly monitor the tree for early signs of disease and take preventive measures as needed."
    },
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        "cause": "This disease is caused by the fungus Cercospora zeae-maydis, which overwinters in infected plant debris and spreads through wind and rain.",
        "problem": "Grayish rectangular lesions form on leaves, reducing photosynthesis and causing premature leaf senescence. Severe cases lead to lower grain yields and increased susceptibility to other diseases.",
        "solution": "Use resistant corn hybrids and apply fungicides like azoxystrobin or pyraclostrobin if needed. Remove and destroy infected plant residues.",
        "care": "Rotate crops yearly to break the fungal lifecycle. Maintain proper plant density to reduce humidity, which favors fungal growth.",
        "prevention": "Ensure proper field drainage and avoid overhead irrigation to minimize leaf wetness. Monitor fields regularly for early signs of infection."
    },
    "Corn_(maize)___Common_rust_": {
        "cause": "Common rust is caused by the fungus Puccinia sorghi, which spreads via airborne spores and thrives in warm, humid conditions.",
        "problem": "Reddish-brown pustules appear on both sides of leaves, eventually causing yellowing and reduced photosynthesis. Severe infections weaken plants, lowering grain yield.",
        "solution": "Plant rust-resistant corn varieties and apply fungicides such as propiconazole or strobilurin if infections become severe.",
        "care": "Avoid excessive nitrogen fertilization, as overly lush growth makes plants more susceptible. Maintain good field drainage to reduce humidity.",
        "prevention": "Practice proper crop rotation and remove infected plant residues after harvest. Monitor fields regularly, especially in humid weather conditions."
    },
    "Corn_(maize)___healthy": {
        "cause": "No disease detected.",
        "problem": "The corn plant is in excellent health, showing no signs of stress or infection.",
        "solution": "Continue with recommended fertilization, irrigation, and weed control practices.",
        "care": "Ensure proper plant spacing to avoid overcrowding. Remove weeds that compete for nutrients.",
        "prevention": "Monitor for early signs of disease and take necessary preventive measures to protect the crop."
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
