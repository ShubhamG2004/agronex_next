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
        "cause": "No disease detected. The plant exhibits strong growth and natural resistance to pathogens.",
        "problem": "The corn plant is in excellent health, showing no signs of stress or infection. Leaves are green, and kernels develop properly.",
        "solution": "Continue with recommended fertilization, irrigation, and weed control practices. Use organic compost to enhance soil fertility.",
        "care": "Ensure proper plant spacing to avoid overcrowding. Remove weeds that compete for nutrients and prevent insect infestations.",
        "prevention": "Monitor for early signs of disease and take necessary preventive measures to protect the crop. Regularly inspect for pests like corn borers."
    },
    "Grape___Black_rot": {
        "cause": "Caused by the fungus Guignardia bidwellii, thriving in warm, humid conditions. It spreads through rain splash and contaminated pruning tools.",
        "problem": "Dark, circular lesions with black spore masses develop on leaves and fruit. Infected fruit shrivel and fall prematurely, reducing yield.",
        "solution": "Apply fungicides like mancozeb and remove infected parts. Use systemic fungicides during the early growing season for better protection.",
        "care": "Prune vines to improve airflow and reduce moisture. Remove fallen debris to prevent fungal spores from overwintering.",
        "prevention": "Use resistant grape varieties and practice good vineyard sanitation. Rotate crops and avoid planting susceptible varieties in affected areas."
    },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "cause": "Caused by the fungus Pseudocercospora vitis, spreading through rain and wind. It survives in plant debris and becomes active in high humidity.",
        "problem": "Brown necrotic spots appear on leaves, leading to defoliation. Severe infections reduce photosynthesis, weakening the plant.",
        "solution": "Apply copper-based fungicides and improve air circulation. Fungicide application should begin at the first sign of symptoms.",
        "care": "Avoid excessive nitrogen fertilization to prevent soft growth. Strengthen plants with balanced nutrients to improve disease resistance.",
        "prevention": "Ensure proper plant spacing and remove infected debris. Regularly monitor vineyards to detect early signs of infection."
    },
    "Grape___healthy": {
        "cause": "No disease detected. The plant shows vibrant growth and disease resistance.",
        "problem": "The grape plant is in good health. Leaves are green, and fruit clusters develop uniformly without signs of decay.",
        "solution": "Maintain regular vineyard care practices. Use organic mulches to retain soil moisture and suppress weeds.",
        "care": "Ensure proper pruning and fertilization. Avoid water stress by maintaining consistent irrigation.",
        "prevention": "Monitor for early signs of disease and pests. Use pheromone traps to track insect populations."
    },
    "Orange___Haunglongbing_(Citrus_greening)": {
        "cause": "Caused by bacteria Candidatus Liberibacter, spread by Asian citrus psyllid. The disease disrupts nutrient transport in trees.",
        "problem": "Yellowing leaves, misshapen fruit, and tree decline. Affected fruits have a bitter taste and remain partially green.",
        "solution": "Remove infected trees and control psyllid populations. Apply foliar sprays containing micronutrients to support tree health.",
        "care": "Apply balanced fertilizers and irrigate properly. Mulch around trees to regulate soil moisture and temperature.",
        "prevention": "Use disease-free seedlings and insect-proof nurseries. Monitor psyllid populations using sticky traps."
    },
    "Peach___Bacterial_spot": {
        "cause": "Caused by the bacterium Xanthomonas campestris, spreading through rain splash. The disease thrives in warm, wet conditions.",
        "problem": "Dark spots on leaves and fruit, causing premature drop. Severe infections can lead to defoliation and reduced fruit production.",
        "solution": "Use copper-based bactericides and resistant peach varieties. Apply sprays early in the season to prevent bacterial spread.",
        "care": "Prune infected branches and remove fallen leaves. Avoid excessive nitrogen applications, which promote susceptible new growth.",
        "prevention": "Avoid overhead irrigation and ensure proper air circulation. Space trees properly to reduce moisture retention."
    },
    "Peach___healthy": {
        "cause": "No disease detected. The tree exhibits healthy growth with a balanced nutrient supply.",
        "problem": "The peach plant is in good health. Leaves are lush green, and fruit development is optimal.",
        "solution": "Maintain regular care and pruning. Use organic mulches to improve soil health and retain moisture.",
        "care": "Ensure balanced soil nutrients and pest control. Protect young shoots from pest infestations.",
        "prevention": "Monitor for early signs of disease. Apply dormant sprays in winter to prevent fungal infections."
    },
    "Tomato___Bacterial_spot": {
        "cause": "Caused by Xanthomonas bacteria, spreading through water splashes. It survives on plant debris and spreads through contaminated tools.",
        "problem": "Small, water-soaked lesions appear on leaves and fruit. Severe infections reduce fruit quality and yield.",
        "solution": "Use copper-based sprays and remove infected plants. Rotate crops to prevent bacterial buildup in the soil.",
        "care": "Avoid overhead watering and rotate crops annually. Maintain proper field sanitation by removing weeds and plant residues.",
        "prevention": "Plant disease-resistant tomato varieties. Use drip irrigation to minimize water splashes."
    },
    "Tomato___Early_blight": {
        "cause": "Caused by the fungus Alternaria solani, thriving in warm, wet conditions. It spreads through wind, rain, and infected seeds.",
        "problem": "Dark concentric spots on lower leaves, causing wilting. The disease progresses upwards, leading to complete defoliation.",
        "solution": "Apply fungicides like chlorothalonil and practice crop rotation. Start fungicide applications at the first sign of disease.",
        "care": "Remove infected leaves and ensure proper spacing. Improve soil drainage to prevent waterlogging.",
        "prevention": "Use resistant tomato varieties and provide good soil drainage. Apply organic compost to strengthen plant immunity."
    },
    "Tomato___healthy": {
        "cause": "No disease detected. The plant shows strong growth and disease resistance.",
        "problem": "The tomato plant is in good health. Leaves are vibrant, and fruit sets without abnormalities.",
        "solution": "Continue regular watering and fertilization. Use organic fertilizers to support steady plant growth.",
        "care": "Prune excess foliage for better airflow. Stake plants properly to prevent fruit from touching the soil.",
        "prevention": "Monitor for early disease symptoms. Keep the growing area free from weeds and debris."
    },
    "Pepper,_bell___Bacterial_spot": {
        "cause": "Caused by the bacterium Xanthomonas campestris, spread through water splashes. It thrives in warm, humid conditions and enters through natural openings or wounds.",
        "problem": "Dark, water-soaked lesions on leaves and fruit, reducing yield. Severely affected leaves turn yellow and drop prematurely, weakening the plant.",
        "solution": "Use copper-based sprays and remove infected plants. Ensure sanitation of gardening tools to prevent bacterial spread.",
        "care": "Avoid overhead watering and maintain good plant spacing. Improve airflow around plants to reduce humidity levels.",
        "prevention": "Rotate crops and use resistant pepper varieties. Mulch around plants to minimize soil splash onto leaves."
    },
    "Pepper,_bell___healthy": {
        "cause": "No disease detected. The plant exhibits vigorous growth and optimal nutrient absorption.",
        "problem": "The bell pepper plant is in good health. Leaves are deep green, and fruit production is normal.",
        "solution": "Continue regular watering and fertilization. Use organic fertilizers to maintain soil fertility.",
        "care": "Monitor for early signs of disease and pests. Prune excess foliage to allow better air circulation.",
        "prevention": "Ensure proper spacing and good soil drainage. Avoid water stagnation to prevent root diseases."
    },
    "Potato___Early_blight": {
        "cause": "Caused by the fungus Alternaria solani, thriving in warm, wet conditions. It spreads through wind, rain, and contaminated soil.",
        "problem": "Dark concentric spots on older leaves, causing leaf drop. As the disease progresses, it weakens the plant, leading to lower yields.",
        "solution": "Apply fungicides like chlorothalonil or copper-based sprays. Begin treatments at the first sign of symptoms for best results.",
        "care": "Ensure good soil drainage and remove infected leaves. Avoid excessive nitrogen fertilization, which can make plants more susceptible.",
        "prevention": "Practice crop rotation and avoid overhead irrigation. Use certified disease-free seed potatoes for planting."
    },
    "Potato___Late_blight": {
        "cause": "Caused by the oomycete Phytophthora infestans, spreading in wet conditions. It is responsible for the historic Irish Potato Famine.",
        "problem": "Irregular water-soaked lesions on leaves, leading to plant collapse. Infected tubers develop a brown rot and become unmarketable.",
        "solution": "Apply fungicides like metalaxyl and remove infected plants. Destroy infected foliage to reduce pathogen spread.",
        "care": "Avoid excessive moisture and improve field ventilation. Space plants properly to reduce humidity buildup.",
        "prevention": "Use certified disease-free potato seeds and rotate crops. Plant resistant varieties and avoid planting in low-lying areas."
    },
    "Potato___healthy": {
        "cause": "No disease detected. The plant displays strong, healthy foliage and tuber development.",
        "problem": "The potato plant is in good health. Leaves are green, and tubers grow without deformities.",
        "solution": "Continue regular watering and fertilization. Add organic matter to the soil to promote tuber formation.",
        "care": "Monitor for early signs of disease and pests. Hill up soil around plants to protect tubers from sunlight and pests.",
        "prevention": "Ensure proper soil drainage and use disease-resistant varieties. Rotate crops to minimize soil-borne pathogens."
    },
    "Raspberry___healthy": {
        "cause": "No disease detected. The plant exhibits strong growth and balanced nutrient uptake.",
        "problem": "The raspberry plant is in good health. Canes are strong, and fruit production is normal.",
        "solution": "Maintain proper pruning and watering. Apply mulch to retain soil moisture and suppress weeds.",
        "care": "Monitor plants for any disease symptoms. Remove weak or overcrowded canes to enhance fruit quality.",
        "prevention": "Ensure good soil drainage and airflow. Avoid excessive nitrogen fertilization to prevent weak growth."
    },
    "Soybean___healthy": {
        "cause": "No disease detected. The plant benefits from proper care and soil health management.",
        "problem": "The soybean plant is in good health. Leaves are uniform in color, and pods develop properly.",
        "solution": "Continue with optimal farming practices. Use balanced fertilizers to maintain high productivity.",
        "care": "Monitor for pests and nutrient deficiencies. Apply foliar sprays to correct any early deficiencies.",
        "prevention": "Rotate crops and maintain soil health. Practice no-till farming to preserve soil structure."
    },
    "Squash___Powdery_mildew": {
        "cause": "Caused by Podosphaera xanthii fungus, spreading in dry conditions. It survives on plant debris and spreads through air currents.",
        "problem": "White, powdery spots appear on leaves, reducing plant growth. Severe infections cause leaf curling and premature defoliation.",
        "solution": "Apply sulfur or potassium bicarbonate-based fungicides. Remove and destroy infected leaves to prevent disease spread.",
        "care": "Water plants at the base to reduce moisture on leaves. Increase air circulation by spacing plants adequately.",
        "prevention": "Use resistant squash varieties and ensure proper plant spacing. Avoid excessive nitrogen, which promotes soft, susceptible growth."
    },
    "Strawberry___Leaf_scorch": {
        "cause": "Caused by the fungus Diplocarpon earlianum, thriving in wet conditions. It spreads through rain splashes and infected plant debris.",
        "problem": "Brown spots with purple margins appear on leaves, leading to defoliation. Severe infections weaken the plant and reduce fruit quality.",
        "solution": "Use fungicides like chlorothalonil and remove infected leaves. Begin treatment at the first sign of disease to limit spread.",
        "care": "Improve air circulation by spacing plants properly. Keep strawberry beds weed-free to reduce competition for nutrients.",
        "prevention": "Avoid overhead irrigation and ensure good drainage. Apply mulch around plants to minimize soil splash and maintain moisture balance."
    },
    "Strawberry___healthy": {
        "cause": "No disease detected. The plant is receiving adequate nutrients and care.",
        "problem": "The strawberry plant is in good health. Leaves are vibrant, and fruit production is consistent.",
        "solution": "Maintain regular watering and fertilization. Use organic compost to boost soil fertility.",
        "care": "Monitor for pests and diseases regularly. Remove old leaves after fruiting to promote new growth.",
        "prevention": "Ensure proper soil drainage and good airflow. Avoid planting strawberries in the same location for consecutive years."
    },
    "Tomato___Bacterial_spot": {
        "cause": "Caused by Xanthomonas bacteria, spreading through water splashes. It survives in plant debris and enters through leaf stomata.",
        "problem": "Small, water-soaked lesions appear on leaves and fruit. Severe infections cause leaf yellowing and reduced yield.",
        "solution": "Use copper-based sprays and remove infected plants. Disinfect gardening tools to prevent further bacterial spread.",
        "care": "Avoid overhead watering and rotate crops annually. Use drip irrigation to reduce moisture on leaves.",
        "prevention": "Plant disease-resistant tomato varieties. Maintain proper spacing to reduce humidity and bacterial spread."
    },
    "Tomato___Early_blight": {
        "cause": "Caused by the fungus Alternaria solani, thriving in warm, wet conditions. The pathogen survives in soil and plant debris for extended periods.",
        "problem": "Dark concentric spots on lower leaves, causing wilting. If left untreated, it spreads upward, affecting fruit production.",
        "solution": "Apply fungicides like chlorothalonil and practice crop rotation. Begin treatments before the disease spreads extensively.",
        "care": "Remove infected leaves and ensure proper spacing. Avoid working in fields when plants are wet to minimize disease transmission.",
        "prevention": "Use resistant tomato varieties and provide good soil drainage. Mulch around plants to prevent soil-borne spores from splashing onto leaves."
    },
    "Tomato___Leaf_Mold": {
        "cause": "Caused by the fungus Passalora fulva (formerly Cladosporium fulvum), which thrives in warm, humid conditions. The spores spread through wind, water splashes, and contaminated gardening tools.",
        "problem": "Yellow spots appear on the upper side of leaves, which later turn brown and lead to defoliation. The underside of affected leaves develops a velvety olive-green to gray mold, weakening the plant and reducing fruit yield.",
        "solution": "Apply copper-based fungicides and prune lower leaves to improve airflow. If the infection is severe, use fungicides containing chlorothalonil or mancozeb.",
        "care": "Ensure proper ventilation in greenhouses and open fields. Reduce humidity levels by spacing plants adequately and avoiding prolonged leaf wetness.",
        "prevention": "Space plants properly and use resistant tomato varieties. Implement crop rotation and remove infected plant debris to prevent reinfection in the next growing season."
    },
    "Tomato___healthy": {
        "cause": "No disease detected. The plant exhibits strong growth, adequate nutrient uptake, and effective pest resistance.",
        "problem": "The tomato plant is in optimal health, with uniform green foliage, proper flowering, and consistent fruit development.",
        "solution": "Continue regular watering and fertilization. Apply organic compost or balanced fertilizers to maintain soil health.",
        "care": "Prune excess foliage for better airflow and to reduce disease risk. Train plants using stakes or cages to prevent soil contact and improve fruit quality.",
        "prevention": "Monitor for early disease symptoms, especially during warm and humid seasons. Use mulch to retain soil moisture and reduce splash-borne pathogen spread."
    },
    "unknown": {
        "cause": "Disease not recognized. The plant's symptoms may not match any known conditions, or the image quality may be insufficient for accurate diagnosis.",
        "problem": "The uploaded image does not correspond to any documented plant disease. Possible causes include environmental stress, nutrient deficiencies, or pest damage.",
        "solution": "Ensure clear image capture and try again. Take multiple images from different angles, focusing on affected areas.",
        "care": "Check plant health manually for any visible symptoms like lesions, discoloration, or pest infestations. Conduct a soil test to rule out nutrient imbalances.",
        "prevention": "Use proper disease diagnosis tools for accurate identification. Implement regular scouting to detect plant issues early and take corrective actions."
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
