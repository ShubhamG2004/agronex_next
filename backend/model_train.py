import os
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, Input
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Define dataset path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "dataset")

# Image augmentation
datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    validation_split=0.2  # 80% training, 20% validation
)

# Load dataset
train_data = datagen.flow_from_directory(
    DATASET_PATH,
    target_size=(128, 128),
    batch_size=32,
    class_mode="categorical",
    subset="training"
)

val_data = datagen.flow_from_directory(
    DATASET_PATH,
    target_size=(128, 128),
    batch_size=32,
    class_mode="categorical",
    subset="validation"
)

# Get number of classes
num_classes = train_data.num_classes

# CNN Model
model = Sequential([
    Input(shape=(128, 128, 3)),  # Correct input shape
    Conv2D(32, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    
    Conv2D(128, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    
    Flatten(),
    Dense(128, activation='relu'),
    Dropout(0.5),
    Dense(num_classes, activation='softmax')  # Dynamic number of classes
])

# Compile model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train model
history = model.fit(
    train_data,
    validation_data=val_data,
    epochs=15  # Increase if needed
)

# Save model
MODEL_PATH = os.path.join(BASE_DIR, "model", "plant_disease_model.h5")
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
model.save(MODEL_PATH)

print(f"Model saved at: {MODEL_PATH}")
