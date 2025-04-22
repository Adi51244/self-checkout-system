from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
from ultralytics import YOLO
import shutil
import cv2
import logging
import uuid

router = APIRouter()

# Load your trained model
model = YOLO("backend/best.pt")  # or just "best.pt" if it's in the same folder

# Define product prices (in INR)
PRODUCT_PRICES = {
    # Complan Products
    "Complan Classic Creme": 290,
    "Complan Kesar Badam": 310,
    "Complan Nutrigro Badam Kheer": 325,
    "Complan Pista Badam": 310,
    "Complan Royal Chocolate": 290,
    
    # Dermi Cool Products
    "Dermi Cool": 55,
    
    # Everyuth Facewash and Scrubs
    "EY AAAM TULSI TURMERIC FACEWASH50G": 85,
    "EY ADVANCED GOLDEN GLOW PEEL OFF M- 50G": 145,
    "EY ADVANCED GOLDEN GLOW PEEL OFF M- 90G": 225,
    "EY EXF WALNUT SCRUB AYR 200G": 180,
    "EY HALDICHANDAN FP HF POWDER 25G": 45,
    "EY HYD-EXF WALNT APR SCRUB AYR100G": 120,
    "EY HYDR - EXF WALNUT APRICOT SCRUB 50G": 75,
    "EY NAT GLOW ORANGE PEEL OFF AY 90G": 195,
    "EY NATURALS NEEM FACE WASH AY 50G": 85,
    "EY RJ CUCUMBER ALOEVERA FACEPAK50G": 95,
    "EY TAN CHOCO CHERRY PACK 50G": 145,
    "EY_SCR_PURIFYING_EXFOLTNG_NEEM_PAPAYA_50G": 95,
    
    # Everyuth Body Lotions
    "Everyuth Naturals Body Lotion Nourishing Cocoa 200ml": 195,
    "Everyuth Naturals Body Lotion Rejuvenating Flora 200ml": 195,
    "Everyuth Naturals Body Lotion Soothing Citrus 200ml": 195,
    "Everyuth Naturals Body Lotion Sun Care Berries SPF 15 200ml": 225,
    
    # Gatsby Products
    "Gatsby Deo Shield": 199,
    
    # Glucon-D Products
    "Glucon D Nimbu Pani 1-KG": 210,
    "Glucon D Regular 1-KG": 195,
    "Glucon D Regular 2-KG": 380,
    "Glucon D Tangy orange 1-KG": 210,
    
    # Lux Products
    "Lux Purple": 45,
    
    # Nutralite Products
    "Nutralite ACHARI MAYO 300g-275g-25g-": 135,
    "Nutralite ACHARI MAYO 30g": 25,
    "Nutralite CHEESY GARLIC MAYO 300g-275g-25g-": 145,
    "Nutralite CHEESY GARLIC MAYO 30g": 30,
    "Nutralite CHOCO SPREAD CALCIUM 275g": 175,
    "Nutralite DOODHSHAKTHI PURE GHEE 1L": 599,
    "Nutralite TANDOORI MAYO 300g-275g-25g-": 135,
    "Nutralite TANDOORI MAYO 30g": 25,
    "Nutralite VEG MAYO 300g-275g-25g-": 125,
    
    # Nycil Products
    "Nycil Prickly Heat Powder": 85,
    
    # Sugar Free Products
    "SUGAR FREE GOLD 500 PELLET": 295,
    "SUGAR FREE GOLD POWDER 100GM": 235,
    "SUGAR FREE GOLD SACHET 50": 85,
    "SUGAR FREE GRN 300 PELLET": 245,
    "SUGAR FREE NATURA 500 PELLET": 275,
    "SUGAR FREE NATURA DIET SUGAR": 195,
    "SUGAR FREE NATURA DIET SUGAR 80GM": 165,
    "SUGAR FREE NATURA SACHET 50": 85,
    "SUGAR FREE NATURA SWEET DROPS": 145,
    "SUGAR FREE NATURA_ POWDER_CONC_100G": 235,
    "SUGAR FREE_GRN_ POWDER_CONC_100G": 235,
    "SUGARLITE POUCH 500G": 155
}

def get_product_price(detected_name: str) -> tuple[str, float]:
    """
    Get the price of a product by matching it with the closest product name in PRODUCT_PRICES.
    Returns a tuple of (matched_product_name, price).
    """
    # First try exact match
    if detected_name in PRODUCT_PRICES:
        return detected_name, PRODUCT_PRICES[detected_name]
    
    # Try partial match
    for product_name in PRODUCT_PRICES:
        if product_name.lower() in detected_name.lower():
            return product_name, PRODUCT_PRICES[product_name]
        if detected_name.lower() in product_name.lower():
            return product_name, PRODUCT_PRICES[product_name]
    
    return detected_name, 0

@router.post("/detect")
async def detect_products(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=422,
                detail="File upload must be an image"
            )
            
        # Corrected folder names with plurals
        uploaded_dir = Path("static/uploaded_images")
        processed_dir = Path("static/processed_images")
        uploaded_dir.mkdir(parents=True, exist_ok=True)
        processed_dir.mkdir(parents=True, exist_ok=True)

        # Generate unique filename
        file_ext = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4().hex}{file_ext}"
        image_path = uploaded_dir / unique_filename

        # Save uploaded image
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Load image with OpenCV
        img = cv2.imread(str(image_path))
        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image")

        # Run YOLO inference
        results = model.predict(img, conf=0.25)[0]

        if not results or len(results.boxes) == 0:
            return {
                "bill": {"items": [], "total": 0},
                "output_image": None,
                "message": "No products detected."
            }

        # Count detected products and match with prices
        product_counts = {}
        product_mappings = {}  # To store the mapping between detected and matched names
        for box in results.boxes:
            class_id = int(box.cls[0])
            detected_label = results.names[class_id]
            matched_name, _ = get_product_price(detected_label)
            product_counts[matched_name] = product_counts.get(matched_name, 0) + 1
            product_mappings[matched_name] = detected_label

        # Create bill
        items = []
        total = 0
        for product, count in product_counts.items():
            _, price = get_product_price(product)
            subtotal = price * count
            items.append({
                "item": product_mappings.get(product, product),  # Use original detected name
                "quantity": count,
                "price": price,  # Add unit price
                "subtotal": subtotal
            })
            total += subtotal

        # Save annotated image
        annotated_img = results.plot()
        output_image_path = processed_dir / f"processed_{unique_filename}"
        cv2.imwrite(str(output_image_path), annotated_img)

        # Update output image path format
        return {
            "bill": {
                "items": items,
                "total": total
            },
            "output_image": str(output_image_path.relative_to("static"))
        }

    except Exception as e:
        logging.error(f"Detection failed: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
