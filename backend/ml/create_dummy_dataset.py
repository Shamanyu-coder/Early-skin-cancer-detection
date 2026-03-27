import os
import numpy as np
from PIL import Image

def create_dummy_images(base_dir, split_name, class_name, count):
    folder = os.path.join(base_dir, split_name, class_name)
    os.makedirs(folder, exist_ok=True)
    for i in range(count):
        # Generate random RGB image
        img_array = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
        img = Image.fromarray(img_array)
        img.save(os.path.join(folder, f"{class_name}_{split_name}_{i}.jpg"))

base_dir = "ham10000_dataset"
for split in ['train', 'val']:
    for cls in ['Benign', 'Malignant']:
        count = 10 if split == 'train' else 5
        create_dummy_images(base_dir, split, cls, count)
print("Dummy dataset created successfully.")
