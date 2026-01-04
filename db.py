import os
from supabase import create_client, Client
from datetime import datetime, timedelta
import random
import uuid
import pandas as pd

# Initialize Supabase client
SUPABASE_URL = "https://tqwptkcpcefltuazvrpc.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxd3B0a2NwY2VmbHR1YXp2cnBjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzQzMzI2MiwiZXhwIjoyMDgzMDA5MjYyfQ.fcilTzgTGgz9Q7xuuXkV1T8N5jXrHRhTBw_EfGgTinQ"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Helper function to generate random dates
def random_date(start_days_ago=365, end_days_ago=0):
    start = datetime.now() - timedelta(days=start_days_ago)
    end = datetime.now() - timedelta(days=end_days_ago)
    return start + (end - start) * random.random()

print("""
IMPORTANT: Run these SQL commands in Supabase SQL Editor BEFORE running this script:

-- Disable all constraints temporarily
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE product_sellers DROP CONSTRAINT IF EXISTS product_sellers_product_id_fkey;
ALTER TABLE product_sellers DROP CONSTRAINT IF EXISTS product_sellers_seller_id_fkey;
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_fkey;
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_product_id_fkey;
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_seller_id_fkey;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_seller_id_fkey;
ALTER TABLE order_tracking DROP CONSTRAINT IF EXISTS order_tracking_order_id_fkey;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_product_id_fkey;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_seller_id_fkey;
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_order_id_fkey;
ALTER TABLE wishlists DROP CONSTRAINT IF EXISTS wishlists_user_id_fkey;
ALTER TABLE wishlists DROP CONSTRAINT IF EXISTS wishlists_product_id_fkey;
ALTER TABLE outfits DROP CONSTRAINT IF EXISTS outfits_user_id_fkey;
ALTER TABLE replenishment_schedules DROP CONSTRAINT IF EXISTS replenishment_schedules_user_id_fkey;
ALTER TABLE replenishment_schedules DROP CONSTRAINT IF EXISTS replenishment_schedules_product_id_fkey;
ALTER TABLE addresses DROP CONSTRAINT IF EXISTS addresses_user_id_fkey;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_parent_id_fkey;
""")

input("Press Enter after running the above SQL commands...")

# Read CSV files
print("\nReading CSV files...")
try:
    categories_df = pd.read_csv('categories_rows.csv')
    products_df = pd.read_csv('products_rows.csv')
    print(f"✓ Loaded {len(categories_df)} categories and {len(products_df)} products from CSV")
except Exception as e:
    print(f"✗ Error reading CSV files: {e}")
    exit(1)

# Generate UUIDs for reference
user_ids = [str(uuid.uuid4()) for _ in range(20)]
seller_ids = [str(uuid.uuid4()) for _ in range(20)]
order_ids = [str(uuid.uuid4()) for _ in range(20)]

# Get product and category IDs from CSV
product_ids = products_df['id'].tolist()
category_ids = categories_df['id'].tolist()

# Sample data
indian_cities = [
    {"city": "Mumbai", "state": "Maharashtra", "lat": 19.0760, "lon": 72.8777},
    {"city": "Delhi", "state": "Delhi", "lat": 28.7041, "lon": 77.1025},
    {"city": "Bangalore", "state": "Karnataka", "lat": 12.9716, "lon": 77.5946},
    {"city": "Hyderabad", "state": "Telangana", "lat": 17.3850, "lon": 78.4867},
    {"city": "Chennai", "state": "Tamil Nadu", "lat": 13.0827, "lon": 80.2707},
    {"city": "Kolkata", "state": "West Bengal", "lat": 22.5726, "lon": 88.3639},
    {"city": "Pune", "state": "Maharashtra", "lat": 18.5204, "lon": 73.8567},
    {"city": "Ahmedabad", "state": "Gujarat", "lat": 23.0225, "lon": 72.5714}
]

first_names = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Rohan", "Pooja", 
               "Arjun", "Kavya", "Aditya", "Neha", "Karan", "Riya", "Sanjay", 
               "Divya", "Varun", "Shreya", "Nikhil", "Isha"]

last_names = ["Sharma", "Patel", "Kumar", "Singh", "Reddy", "Mehta", "Gupta", "Desai",
              "Verma", "Rao", "Iyer", "Nair", "Joshi", "Malhotra", "Kapoor"]

print("Starting database population...")

# Insert Profiles
print("\nInserting profiles...")
profiles = []
for i, user_id in enumerate(user_ids):
    city_info = random.choice(indian_cities)
    profile = {
        "id": user_id,
        "email": f"{first_names[i].lower()}.{random.choice(last_names).lower()}@example.com",
        "full_name": f"{first_names[i]} {random.choice(last_names)}",
        "phone": f"+91{random.randint(7000000000, 9999999999)}",
        "avatar_url": f"https://i.pravatar.cc/150?u={user_id}",
        "location": city_info,
        "preferences": {
            "sizes": random.choice([["S", "M"], ["M", "L"], ["L", "XL"]]),
            "favorite_categories": random.sample(category_ids[:min(3, len(category_ids))], min(2, len(category_ids))),
            "budget_range": {"min": 500, "max": random.choice([5000, 10000, 20000])}
        },
        "created_at": random_date(180, 1).isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    profiles.append(profile)

try:
    result = supabase.table('profiles').insert(profiles).execute()
    print(f"✓ Inserted {len(profiles)} profiles")
except Exception as e:
    print(f"✗ Error inserting profiles: {e}")

# Insert Sellers
print("\nInserting sellers...")
seller_names = ["FashionHub", "TechWorld", "HomeEssentials", "BeautyBox", "SportsZone",
                "BookHaven", "ToyLand", "JewelCraft", "BagMart", "WatchWorld",
                "StyleNest", "GadgetStore", "FitGear", "TrendyWear", "ElectroMart",
                "ComfortHome", "GlamourBeauty", "PlayZone", "LuxeAccessories", "WellnessHub"]

sellers = []
for i, seller_id in enumerate(seller_ids):
    seller = {
        "id": seller_id,
        "name": seller_names[i],
        "description": f"Premium quality products from {seller_names[i]}",
        "logo_url": f"https://ui-avatars.com/api/?name={seller_names[i]}&background=random",
        "rating": round(random.uniform(3.5, 5.0), 2),
        "total_reviews": random.randint(50, 5000),
        "return_policy": "30 days easy return policy",
        "return_days": random.choice([15, 30, 45]),
        "return_shipping_paid": random.choice([True, False]),
        "delivery_days": random.choice([2, 3, 5, 7]),
        "verified": random.choice([True, True, True, False]),
        "created_at": random_date(365, 30).isoformat()
    }
    sellers.append(seller)

try:
    result = supabase.table('sellers').insert(sellers).execute()
    print(f"✓ Inserted {len(sellers)} sellers")
except Exception as e:
    print(f"✗ Error inserting sellers: {e}")

# Insert Categories from CSV
print("\nInserting categories from CSV...")
categories = []
for _, row in categories_df.iterrows():
    category = {
        "id": row['id'],
        "name": row['name'],
        "slug": row['slug'],
        "description": row['description'] if pd.notna(row['description']) else f"{row['name']} category",
        "parent_id": row['parent_id'] if pd.notna(row['parent_id']) else None,
        "image_url": row['image_url'] if pd.notna(row['image_url']) else f"https://source.unsplash.com/400x300/?{row['slug']}",
        "created_at": row['created_at'] if pd.notna(row['created_at']) else random_date(365, 1).isoformat()
    }
    categories.append(category)

try:
    result = supabase.table('categories').insert(categories).execute()
    print(f"✓ Inserted {len(categories)} categories")
except Exception as e:
    print(f"✗ Error inserting categories: {e}")

# Insert Products from CSV
print("\nInserting products from CSV...")
products = []
for _, row in products_df.iterrows():
    # Parse images array
    images = []
    if pd.notna(row['images']):
        import json
        try:
            images = json.loads(row['images'])
        except:
            images = [row['images']]
    
    # Ensure at least one image
    if not images:
        images = [f"https://source.unsplash.com/600x600/?{row['slug']}"]
    
    # Parse attributes
    attributes = {}
    if pd.notna(row['attributes']):
        try:
            attributes = json.loads(row['attributes'])
        except:
            attributes = {"material": "Premium", "brand": "Generic"}
    
    # Parse tags
    tags = []
    if pd.notna(row['tags']):
        try:
            tags = json.loads(row['tags'])
        except:
            tags = []
    
    product = {
        "id": row['id'],
        "name": row['name'],
        "slug": row['slug'],
        "description": row['description'] if pd.notna(row['description']) else f"High quality {row['name']}",
        "category_id": row['category_id'],
        "base_price": float(row['base_price']),
        "images": images,
        "attributes": attributes,
        "tags": tags,
        "is_digital": bool(row['is_digital']) if pd.notna(row['is_digital']) else False,
        "stock_quantity": random.randint(10, 500),
        "created_at": row['created_at'] if pd.notna(row['created_at']) else random_date(180, 1).isoformat(),
        "updated_at": row['updated_at'] if pd.notna(row['updated_at']) else datetime.now().isoformat()
    }
    products.append(product)

try:
    result = supabase.table('products').insert(products).execute()
    print(f"✓ Inserted {len(products)} products")
except Exception as e:
    print(f"✗ Error inserting products: {e}")

# Insert Product Sellers
print("\nInserting product-seller relationships...")
product_sellers = []
for product_id in product_ids[:200]:  # Limit to avoid too many relationships
    num_sellers = random.randint(2, 4)
    selected_sellers = random.sample(seller_ids, num_sellers)
    
    # Get base price from products_df
    base_price = float(products_df[products_df['id'] == product_id]['base_price'].iloc[0])
    
    for seller_id in selected_sellers:
        price_variation = random.uniform(0.9, 1.1)
        
        ps = {
            "id": str(uuid.uuid4()),
            "product_id": product_id,
            "seller_id": seller_id,
            "price": round(base_price * price_variation, 2),
            "stock_quantity": random.randint(5, 100),
            "delivery_days": random.choice([2, 3, 5, 7]),
            "is_active": random.choice([True, True, True, False]),
            "created_at": random_date(90, 1).isoformat()
        }
        product_sellers.append(ps)

try:
    # Insert in batches of 100
    for i in range(0, len(product_sellers), 100):
        batch = product_sellers[i:i+100]
        result = supabase.table('product_sellers').insert(batch).execute()
    print(f"✓ Inserted {len(product_sellers)} product-seller relationships")
except Exception as e:
    print(f"✗ Error inserting product_sellers: {e}")

# Insert Cart Items
print("\nInserting cart items...")
cart_items = []
for i in range(20):
    cart = {
        "id": str(uuid.uuid4()),
        "user_id": random.choice(user_ids),
        "product_id": random.choice(product_ids),
        "seller_id": random.choice(seller_ids),
        "quantity": random.randint(1, 3),
        "selected_attributes": {"size": random.choice(["S", "M", "L", "XL"]), "color": random.choice(["Red", "Blue", "Black"])},
        "created_at": random_date(30, 0).isoformat()
    }
    cart_items.append(cart)

try:
    result = supabase.table('cart_items').insert(cart_items).execute()
    print(f"✓ Inserted {len(cart_items)} cart items")
except Exception as e:
    print(f"✗ Error inserting cart_items: {e}")

# Insert Orders
print("\nInserting orders...")
orders = []
order_statuses = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled']
for i, order_id in enumerate(order_ids):
    city_info = random.choice(indian_cities)
    order = {
        "id": order_id,
        "order_number": f"OAT-{100000 + i}",
        "user_id": random.choice(user_ids),
        "status": random.choice(order_statuses),
        "subtotal": round(random.uniform(500, 10000), 2),
        "tax": round(random.uniform(50, 500), 2),
        "shipping_cost": round(random.uniform(0, 200), 2),
        "total": 0,
        "shipping_address": {
            "full_name": f"{random.choice(first_names)} {random.choice(last_names)}",
            "phone": f"+91{random.randint(7000000000, 9999999999)}",
            "address_line1": f"{random.randint(1, 999)} Main Street",
            "address_line2": f"Near {random.choice(['Park', 'Mall', 'Station'])}",
            "city": city_info["city"],
            "state": city_info["state"],
            "pincode": f"{random.randint(100000, 999999)}",
            "country": "India"
        },
        "billing_address": None,
        "payment_method": random.choice(["UPI", "Credit Card", "Debit Card", "Net Banking", "COD"]),
        "payment_status": random.choice(["pending", "completed", "failed"]),
        "estimated_delivery": (datetime.now() + timedelta(days=random.randint(2, 7))).isoformat(),
        "created_at": random_date(90, 1).isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    order["total"] = order["subtotal"] + order["tax"] + order["shipping_cost"]
    orders.append(order)

try:
    result = supabase.table('orders').insert(orders).execute()
    print(f"✓ Inserted {len(orders)} orders")
except Exception as e:
    print(f"✗ Error inserting orders: {e}")

# Insert Order Items
print("\nInserting order items...")
order_items = []
for order_id in order_ids:
    num_items = random.randint(1, 4)
    for _ in range(num_items):
        product_row = products_df.sample(1).iloc[0]
        
        item = {
            "id": str(uuid.uuid4()),
            "order_id": order_id,
            "product_id": product_row['id'],
            "seller_id": random.choice(seller_ids),
            "product_name": product_row['name'],
            "product_image": product_row['images'].split(',')[0] if pd.notna(product_row['images']) else "https://via.placeholder.com/150",
            "quantity": random.randint(1, 3),
            "price": float(product_row['base_price']),
            "attributes": {"size": random.choice(["S", "M", "L"])},
            "created_at": random_date(90, 1).isoformat()
        }
        order_items.append(item)

try:
    result = supabase.table('order_items').insert(order_items).execute()
    print(f"✓ Inserted {len(order_items)} order items")
except Exception as e:
    print(f"✗ Error inserting order_items: {e}")

# Insert Order Tracking
print("\nInserting order tracking...")
order_tracking = []
tracking_statuses = [
    {"status": "order_placed", "location": "Mumbai", "description": "Order has been placed successfully"},
    {"status": "confirmed", "location": "Mumbai", "description": "Order confirmed by seller"},
    {"status": "packed", "location": "Mumbai Warehouse", "description": "Order packed and ready for dispatch"},
    {"status": "in_transit", "location": "Delhi Hub", "description": "Package in transit"},
    {"status": "out_for_delivery", "location": "Local Delivery Center", "description": "Out for delivery"},
    {"status": "delivered", "location": "Customer Address", "description": "Delivered successfully"}
]

for order_id in order_ids[:15]:
    num_updates = random.randint(2, 6)
    for j in range(num_updates):
        tracking_info = tracking_statuses[j]
        track = {
            "id": str(uuid.uuid4()),
            "order_id": order_id,
            "status": tracking_info["status"],
            "location": tracking_info["location"],
            "description": tracking_info["description"],
            "metadata": {
                "partner_name": random.choice(["Delhivery", "Blue Dart", "DTDC", "India Post"]),
                "vehicle_id": f"VH{random.randint(1000, 9999)}",
                "eta": (datetime.now() + timedelta(hours=random.randint(2, 48))).isoformat()
            },
            "created_at": random_date(30, max(0, 30 - j * 5)).isoformat()
        }
        order_tracking.append(track)

try:
    result = supabase.table('order_tracking').insert(order_tracking).execute()
    print(f"✓ Inserted {len(order_tracking)} tracking records")
except Exception as e:
    print(f"✗ Error inserting order_tracking: {e}")

# Insert Reviews - Realistic reviews for each product
print("\nInserting reviews for products...")
reviews = []
review_templates = {
    "5_star": {
        "titles": ["Excellent product!", "Amazing quality!", "Highly recommended!", "Best purchase ever!", 
                   "Exceeded expectations!", "Absolutely love it!", "Perfect!", "Outstanding quality!"],
        "contents": [
            "This product is amazing! Exactly what I was looking for. Highly recommended!",
            "Excellent quality and great value for money. Very satisfied with this purchase.",
            "Absolutely love it! The quality is outstanding and delivery was quick.",
            "Best purchase I've made this year. Couldn't be happier with this product.",
            "Exceeded all my expectations. The product is even better than described.",
            "Perfect in every way! Great quality, fast delivery, and excellent packaging.",
            "Outstanding product! Would definitely recommend to friends and family.",
            "Amazing quality and finish. Very happy with this purchase!"
        ]
    },
    "4_star": {
        "titles": ["Good product", "Satisfied with purchase", "Good value for money", "Pretty good", 
                   "Worth buying", "Nice product", "Good quality", "Recommended"],
        "contents": [
            "Good product overall. Quality is decent and meets expectations.",
            "Satisfied with the purchase. Good value for the price paid.",
            "Pretty good product. A few minor issues but nothing major.",
            "Worth buying. The quality is good for the price range.",
            "Nice product with good build quality. Delivery was on time.",
            "Good quality product. Would have given 5 stars but for minor issues.",
            "Recommended. Good product that does what it's supposed to do.",
            "Happy with this purchase. Good quality at a reasonable price."
        ]
    },
    "3_star": {
        "titles": ["Average product", "Okay", "Could be better", "Decent", "Not bad", "Fair", "Acceptable", "Alright"],
        "contents": [
            "Average product. Nothing special but does the job.",
            "Okay quality. Expected a bit more for the price.",
            "Could be better. The product is decent but has room for improvement.",
            "Not bad but not great either. It's acceptable for the price.",
            "Fair quality. Gets the job done but don't expect premium quality.",
            "Decent product. Some aspects are good, others could improve.",
            "Alright purchase. It's okay but I've seen better products.",
            "Acceptable quality. Works fine but could be improved."
        ]
    },
    "2_star": {
        "titles": ["Disappointed", "Not as expected", "Below average", "Poor quality", "Not satisfied", 
                   "Expected better", "Needs improvement", "Not worth it"],
        "contents": [
            "Disappointed with this purchase. Quality is below average.",
            "Not as expected. The product description was misleading.",
            "Poor quality. Would not recommend this to others.",
            "Not satisfied at all. Expected much better quality.",
            "Expected better for this price. Quality is subpar.",
            "Needs significant improvement. Many issues with the product.",
            "Not worth the money. Better options available in the market.",
            "Below expectations. The quality doesn't match the price."
        ]
    },
    "1_star": {
        "titles": ["Terrible", "Waste of money", "Very poor quality", "Awful", "Don't buy", 
                   "Horrible", "Complete waste", "Worst purchase"],
        "contents": [
            "Terrible product. Complete waste of money. Do not buy!",
            "Very poor quality. Product broke within days of use.",
            "Awful experience. The product is nothing like described.",
            "Don't waste your money on this. Extremely poor quality.",
            "Horrible product. I want my money back!",
            "Complete waste. The product is unusable and of terrible quality.",
            "Worst purchase ever. Absolutely disappointed with everything.",
            "Zero stars if I could. Terrible quality and completely useless."
        ]
    }
}

# Create 3-5 reviews per product
for product_id in product_ids[:50]:  # Limit to 50 products for reasonable data size
    product_row = products_df[products_df['id'] == product_id].iloc[0]
    num_reviews = random.randint(3, 5)
    
    for _ in range(num_reviews):
        # Weight towards positive reviews (more realistic)
        rating_weights = [0.05, 0.10, 0.15, 0.30, 0.40]  # 1-5 stars
        rating = random.choices([1, 2, 3, 4, 5], weights=rating_weights)[0]
        
        rating_key = f"{rating}_star"
        title = random.choice(review_templates[rating_key]["titles"])
        content = random.choice(review_templates[rating_key]["contents"])
        
        review = {
            "id": str(uuid.uuid4()),
            "product_id": product_id,
            "user_id": random.choice(user_ids),
            "seller_id": random.choice(seller_ids),
            "order_id": random.choice(order_ids) if random.random() > 0.3 else None,
            "rating": rating,
            "title": title,
            "content": content,
            "images": [f"https://picsum.photos/400/400?random={random.randint(1, 1000)}"] if random.random() > 0.7 else [],
            "verified_purchase": random.choice([True, True, False]),
            "helpful_count": random.randint(0, 100) if rating >= 4 else random.randint(0, 30),
            "detailed_ratings": {
                "comfort": random.randint(rating * 2 - 2, min(10, rating * 2 + 1)),
                "durability": random.randint(rating * 2 - 2, min(10, rating * 2 + 1)),
                "value": random.randint(rating * 2 - 2, min(10, rating * 2 + 1))
            } if rating >= 3 else None,
            "created_at": random_date(60, 1).isoformat()
        }
        reviews.append(review)

try:
    # Insert in batches
    for i in range(0, len(reviews), 100):
        batch = reviews[i:i+100]
        result = supabase.table('reviews').insert(batch).execute()
    print(f"✓ Inserted {len(reviews)} reviews")
except Exception as e:
    print(f"✗ Error inserting reviews: {e}")

# Insert Wishlists
print("\nInserting wishlists...")
wishlists = []
for i in range(30):
    wishlist = {
        "id": str(uuid.uuid4()),
        "user_id": random.choice(user_ids),
        "product_id": random.choice(product_ids),
        "created_at": random_date(60, 0).isoformat()
    }
    wishlists.append(wishlist)

try:
    result = supabase.table('wishlists').insert(wishlists).execute()
    print(f"✓ Inserted {len(wishlists)} wishlist items")
except Exception as e:
    print(f"✗ Error inserting wishlists: {e}")

# Insert Outfits
print("\nInserting outfits...")
outfits = []
for i in range(15):
    outfit = {
        "id": str(uuid.uuid4()),
        "user_id": random.choice(user_ids),
        "name": f"Outfit {i + 1} - {random.choice(['Casual', 'Formal', 'Party', 'Sports'])}",
        "product_ids": random.sample(product_ids, min(random.randint(2, 5), len(product_ids))),
        "thumbnail_url": f"https://picsum.photos/300/300?random=outfit{i}",
        "created_at": random_date(90, 0).isoformat()
    }
    outfits.append(outfit)

try:
    result = supabase.table('outfits').insert(outfits).execute()
    print(f"✓ Inserted {len(outfits)} outfits")
except Exception as e:
    print(f"✗ Error inserting outfits: {e}")

# Insert Replenishment Schedules
print("\nInserting replenishment schedules...")
replenishments = []
for i in range(20):
    last_purchase = random_date(60, 30)
    frequency = random.choice([30, 45, 60, 90])
    
    schedule = {
        "id": str(uuid.uuid4()),
        "user_id": random.choice(user_ids),
        "product_id": random.choice(product_ids),
        "frequency_days": frequency,
        "last_purchase_date": last_purchase.isoformat(),
        "next_due_date": (last_purchase + timedelta(days=frequency)).isoformat(),
        "auto_order": random.choice([True, False]),
        "created_at": random_date(90, 30).isoformat()
    }
    replenishments.append(schedule)

try:
    result = supabase.table('replenishment_schedules').insert(replenishments).execute()
    print(f"✓ Inserted {len(replenishments)} replenishment schedules")
except Exception as e:
    print(f"✗ Error inserting replenishment_schedules: {e}")

# Insert Addresses
print("\nInserting addresses...")
addresses = []
address_types = ["home", "work", "other"]
for i in range(30):
    city_info = random.choice(indian_cities)
    address = {
        "id": str(uuid.uuid4()),
        "user_id": random.choice(user_ids),
        "type": random.choice(address_types),
        "full_name": f"{random.choice(first_names)} {random.choice(last_names)}",
        "phone": f"+91{random.randint(7000000000, 9999999999)}",
        "address_line1": f"{random.randint(1, 999)} {random.choice(['MG Road', 'Park Street', 'Main Street', 'Church Street'])}",
        "address_line2": f"{random.choice(['Apartment', 'Building', 'Tower'])} {random.randint(1, 50)}",
        "city": city_info["city"],
        "state": city_info["state"],
        "pincode": f"{random.randint(100000, 999999)}",
        "country": "India",
        "is_default": i % 5 == 0,
        "created_at": random_date(180, 0).isoformat()
    }
    addresses.append(address)

try:
    result = supabase.table('addresses').insert(addresses).execute()
    print(f"✓ Inserted {len(addresses)} addresses")
except Exception as e:
    print(f"✗ Error inserting addresses: {e}")

# Insert Bundles
print("\nInserting bundles...")
bundles = []
bundle_names = [
    "Summer Essentials Pack", "Work from Home Bundle", "Fitness Starter Kit",
    "Party Ready Combo", "Travel Essentials", "Winter Wardrobe Bundle",
    "Electronics Combo", "Home Decor Set", "Beauty Basics Pack",
    "Sports Enthusiast Bundle", "Book Lover's Collection", "Kitchen Starter Kit",
    "Weekend Casual Outfit", "Office Professional Set", "Gaming Setup Bundle",
    "Wellness Package", "Festival Special Combo", "Student Essential Pack",
    "Yoga Starter Kit", "Photography Accessories Bundle"
]

for i in range(20):
    bundle = {
        "id": str(uuid.uuid4()),
        "name": bundle_names[i],
        "description": f"Curated bundle of products perfect for {bundle_names[i].lower()}",
        "product_ids": random.sample(product_ids, min(random.randint(3, 6), len(product_ids))),
        "discount_percentage": round(random.uniform(5, 25), 2),
        "is_ai_generated": random.choice([True, False]),
        "intent_query": f"Looking for {bundle_names[i].lower()}" if random.random() > 0.5 else None,
        "created_at": random_date(90, 0).isoformat()
    }
    bundles.append(bundle)

try:
    result = supabase.table('bundles').insert(bundles).execute()
    print(f"✓ Inserted {len(bundles)} bundles")
except Exception as e:
    print(f"✗ Error inserting bundles: {e}")

print("\n" + "="*60)
print("DATABASE POPULATION COMPLETED!")
print("="*60)
print("\nSummary:")
print(f"  • {len(profiles)} Profiles")
print(f"  • {len(sellers)} Sellers")
print(f"  • {len(categories)} Categories (from CSV)")
print(f"  • {len(products)} Products (from CSV)")
print(f"  • {len(product_sellers)} Product-Seller Relationships")
print(f"  • {len(cart_items)} Cart Items")
print(f"  • {len(orders)} Orders")
print(f"  • {len(order_items)} Order Items")
print(f"  • {len(order_tracking)} Tracking Records")
print(f"  • {len(reviews)} Reviews (realistic for products)")
print(f"  • {len(wishlists)} Wishlist Items")
print(f"  • {len(outfits)} Outfits")
print(f"  • {len(replenishments)} Replenishment Schedules")
print(f"  • {len(addresses)} Addresses")
print(f"  • {len(bundles)} Bundles")

print("\n" + "="*60)
print("NEXT STEP: Re-enable constraints in Supabase SQL Editor")
print("="*60)
print("""
-- Re-enable constraints (EXCEPT profiles_id_fkey to auth.users)
ALTER TABLE product_sellers ADD CONSTRAINT product_sellers_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE product_sellers ADD CONSTRAINT product_sellers_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE;
ALTER TABLE cart_items ADD CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE cart_items ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE cart_items ADD CONSTRAINT cart_items_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES sellers(id);
ALTER TABLE orders ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id);
ALTER TABLE order_items ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
ALTER TABLE order_items ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id);
ALTER TABLE order_items ADD CONSTRAINT order_items_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES sellers(id);
ALTER TABLE order_tracking ADD CONSTRAINT order_tracking_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
ALTER TABLE reviews ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE reviews ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id);
ALTER TABLE reviews ADD CONSTRAINT reviews_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES sellers(id);
ALTER TABLE reviews ADD CONSTRAINT reviews_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id);
ALTER TABLE wishlists ADD CONSTRAINT wishlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE wishlists ADD CONSTRAINT wishlists_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
ALTER TABLE outfits ADD CONSTRAINT outfits_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE replenishment_schedules ADD CONSTRAINT replenishment_schedules_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE replenishment_schedules ADD CONSTRAINT replenishment_schedules_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id);
ALTER TABLE addresses ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE products ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id);
ALTER TABLE categories ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES categories(id);
""")

print("\n" + "="*60)
print("OPTIONAL: Sample Queries to Test Your Data")
print("="*60)
print("""
-- Get all products with their categories
SELECT p.name, p.base_price, c.name as category, p.images
FROM products p
JOIN categories c ON p.category_id = c.id
LIMIT 10;

-- Get orders with user details
SELECT o.order_number, o.status, o.total, pr.full_name, pr.email
FROM orders o
JOIN profiles pr ON o.user_id = pr.id
ORDER BY o.created_at DESC
LIMIT 10;

-- Get product reviews with ratings
SELECT p.name, r.rating, r.title, r.content, pr.full_name as reviewer
FROM reviews r
JOIN products p ON r.product_id = p.id
JOIN profiles pr ON r.user_id = pr.id
WHERE r.rating >= 4
ORDER BY r.created_at DESC
LIMIT 10;

-- Get sellers with their product count
SELECT s.name, s.rating, COUNT(DISTINCT ps.product_id) as product_count
FROM sellers s
LEFT JOIN product_sellers ps ON s.id = ps.seller_id
GROUP BY s.id, s.name, s.rating
ORDER BY product_count DESC;

-- Get popular products (most reviews)
SELECT p.name, COUNT(r.id) as review_count, AVG(r.rating) as avg_rating
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name
HAVING COUNT(r.id) > 0
ORDER BY review_count DESC
LIMIT 10;

-- Get categories with product count
SELECT c.name, c.slug, COUNT(p.id) as product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name, c.slug
ORDER BY product_count DESC;
""")

print("\n✅ Script completed successfully!")
print("📝 Make sure to:")
print("   1. Place 'categories_rows.csv' and 'products_rows.csv' in the same directory")
print("   2. Run the SQL commands to disable constraints BEFORE running this script")
print("   3. Run the SQL commands to re-enable constraints AFTER the script completes")
print("   4. Install required packages: pip install supabase pandas")