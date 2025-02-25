import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import json
import os

# Define dataset path
DATASET_PATH = "dataset"

# Image size and batch size
IMG_SIZE = (128, 128)
BATCH_SIZE = 32

# Data Augmentation and Preprocessing
datagen = ImageDataGenerator(
    rescale=1.0 / 255.0,
    validation_split=0.2  
)

# Load dataset
train_data = datagen.flow_from_directory(
    DATASET_PATH,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="training"
)

val_data = datagen.flow_from_directory(
    DATASET_PATH,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode="categorical",
    subset="validation"
)

# Get class indices and save them
class_indices = train_data.class_indices
class_labels = {v: k for k, v in class_indices.items()}

# Save class indices as JSON
os.makedirs("model", exist_ok=True)
with open("model/class_indices.json", "w") as f:
    json.dump(class_labels, f)

# Define CNN Model
model = tf.keras.models.Sequential([
    tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(128, 128, 3)),
    tf.keras.layers.MaxPooling2D(2, 2),
    tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D(2, 2),
    tf.keras.layers.Conv2D(128, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D(2, 2),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(len(class_labels), activation='softmax')  
])

# Compile the model
model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

# Train the model
model.fit(
    train_data,
    validation_data=val_data,
    epochs=6 # Change based on your requirements
)

# Save trained model
model.save("model/plant_disease_model.h5")

print("Model training complete and saved!")
