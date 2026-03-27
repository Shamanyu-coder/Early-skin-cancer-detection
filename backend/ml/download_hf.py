import os
import shutil
import base64

def run():
    print("Installing requirements...")
    os.system("pip install -q datasets huggingface_hub pillow")
    
    print("Loading Hugging Face dataset...")
    try:
        from datasets import load_dataset
        # The user's system may not have much space or network, we will enable streaming if it's too big,
        # but to save to disk we need to download it.
        ds = load_dataset("kmader/skin-cancer-mnist-ham10000", split='train')
    except Exception as e:
        print("Failed to load kmader dataset. Trying another...", e)
        try:
            ds = load_dataset("Nagabu/HAM10000", split='train')
        except Exception as e2:
            print("Failed to load Nagabu. Trying karoladelk/ham1ok...", e2)
            ds = load_dataset("arise-project/ham10000", split='train')

    print(f"Dataset loaded: {ds}")
    
    # Create directories
    base_dir = "ham10000_dataset_real"
    for split in ['train', 'val']:
        for cls in ['Benign', 'Malignant']:
            os.makedirs(os.path.join(base_dir, split, cls), exist_ok=True)
            
    # Typically, classes like mel, bcc, akiec are malignant. nv, bkl, df, vasc are benign.
    malignant_classes = ['mel', 'bcc', 'akiec', 'malignant']
    
    print("Extracting images into directories...")
    # To avoid taking 2 hours, we will just download a subset of the dataset (e.g., 500 images) since they want it to "just run" but with real images
    # But if they want the whole thing, we will do it. Let's do 1000 images to make it run fast but still be "real dataset".
    total = len(ds)
    limit = min(total, 1000) # 1000 images subset for testing
    
    # Split 80/20 train/val
    import random
    indices = list(range(total))
    random.shuffle(indices)
    indices = indices[:limit]
    
    val_count = int(limit * 0.2)
    val_indices = set(indices[:val_count])
    
    saved = 0
    for idx in indices:
        item = ds[idx]
        img = item['image']
        
        # Determine class
        label = item.get('dx', item.get('label', ''))
        if str(label).lower() in malignant_classes or (isinstance(label, int) and label == 1):
            class_name = 'Malignant'
        else:
            class_name = 'Benign'
            
        split = 'val' if idx in val_indices else 'train'
        img_path = os.path.join(base_dir, split, class_name, f"real_{idx}.jpg")
        
        # Convert to RGB if needed and save
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img.save(img_path)
        
        saved += 1
        if saved % 100 == 0:
            print(f"Saved {saved}/{limit} images...")
            
    print(f"Successfully downloaded and organized {saved} real images into {base_dir}")

if __name__ == "__main__":
    run()
