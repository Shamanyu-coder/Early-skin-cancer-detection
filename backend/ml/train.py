import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model

# Configuration
DATASET_PATH = "ham10000_dataset_real" # Should have 'train' and 'val' subdirectories with 'Benign' and 'Malignant' folders
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10

def build_model():
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=IMG_SIZE + (3,))
    base_model.trainable = False # Freeze base model
    
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(1, activation='sigmoid')(x) # Binary classification
    
    model = Model(inputs=base_model.input, outputs=predictions)
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model

def train():
    if not os.path.exists(DATASET_PATH):
        print(f"Dataset path {DATASET_PATH} not found. Please download HAM10000 dataset, organize it into train/val folders with Benign/Malignant classes, and try again.")
        return
    
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True
    )
    val_datagen = ImageDataGenerator(rescale=1./255)
    
    train_generator = train_datagen.flow_from_directory(
        os.path.join(DATASET_PATH, 'train'),
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='binary'
    )
    
    val_generator = val_datagen.flow_from_directory(
        os.path.join(DATASET_PATH, 'val'),
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='binary'
    )
    
    model = build_model()
    
    history = model.fit(
        train_generator,
        epochs=EPOCHS,
        validation_data=val_generator
    )
    
    model.save("model.h5")
    print("Model saved to model.h5")

if __name__ == "__main__":
    train()
