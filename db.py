import os
from supabase import create_client, Client
from datetime import datetime, timedelta
import random
import uuid

# Initialize Supabase client
SUPABASE_URL = "https://tqwptkcpcefltuazvrpc.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxd3B0a2NwY2VmbHR1YXp2cnBjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzQzMzI2MiwiZXhwIjoyMDgzMDA5MjYyfQ.fcilTzgTGgz9Q7xuuXkV1T8N5jXrHRhTBw_EfGgTinQ"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Helper function to generate random dates
def random_date(start_days_ago=365, end_days_ago=0):
    start = datetime.now() - timedelta(days=start_days_ago)
    end = datetime.now() - timedelta(days=end_days_ago)
    return start + (end - start) * random.random()

# Step 1: Disable constraints (Run these SQL commands in Supabase SQL Editor first)
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

# Generate UUIDs for reference
user_ids = [str(uuid.uuid4()) for _ in range(20)]
seller_ids = [str(uuid.uuid4()) for _ in range(20)]
category_ids = [str(uuid.uuid4()) for _ in range(15)]
product_ids = [str(uuid.uuid4()) for _ in range(100)]
order_ids = [str(uuid.uuid4()) for _ in range(20)]

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

# Product categories with realistic products
categories_data = [
    {"name": "Men's Fashion", "slug": "mens-fashion", "description": "Clothing and accessories for men"},
    {"name": "Women's Fashion", "slug": "womens-fashion", "description": "Clothing and accessories for women"},
    {"name": "Footwear", "slug": "footwear", "description": "Shoes and sandals"},
    {"name": "Electronics", "slug": "electronics", "description": "Electronic gadgets and devices"},
    {"name": "Home & Kitchen", "slug": "home-kitchen", "description": "Home essentials and kitchen items"},
    {"name": "Beauty & Personal Care", "slug": "beauty-personal-care", "description": "Beauty and grooming products"},
    {"name": "Sports & Fitness", "slug": "sports-fitness", "description": "Sports equipment and fitness gear"},
    {"name": "Books", "slug": "books", "description": "Books and educational material"},
    {"name": "Toys & Games", "slug": "toys-games", "description": "Toys and games for all ages"},
    {"name": "Jewelry", "slug": "jewelry", "description": "Fashion and traditional jewelry"},
    {"name": "Bags & Luggage", "slug": "bags-luggage", "description": "Bags, backpacks and luggage"},
    {"name": "Watches", "slug": "watches", "description": "Watches for men and women"},
    {"name": "Sunglasses", "slug": "sunglasses", "description": "Sunglasses and eyewear"},
    {"name": "Mobile Accessories", "slug": "mobile-accessories", "description": "Phone cases and accessories"},
    {"name": "Health & Wellness", "slug": "health-wellness", "description": "Health and wellness products"}
]

# Product data with real image URLs from placeholder services
products_data = [
    # Men's Fashion (15 items)
    {"name": "Cotton Casual Shirt", "category": 0, "price": 799, "images": ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c", "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c"], "color": "Blue", "material": "Cotton"},
    {"name": "Formal Blazer", "category": 0, "price": 2499, "images": ["https://images.unsplash.com/photo-1593032465207-4c1f36b1c8b0", "https://images.unsplash.com/photo-1507679799987-c73779587ccf"], "color": "Black", "material": "Polyester"},
    {"name": "Denim Jeans", "category": 0, "price": 1299, "images": ["https://images.unsplash.com/photo-1542272604-787c3835535d", "https://images.unsplash.com/photo-1475178626620-a4d074967452"], "color": "Blue", "material": "Denim"},
    {"name": "Polo T-Shirt", "category": 0, "price": 599, "images": ["https://images.unsplash.com/photo-1586790170083-2f9ceadc732d", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"], "color": "White", "material": "Cotton"},
    {"name": "Leather Belt", "category": 0, "price": 449, "images": ["https://images.unsplash.com/photo-1624222247344-550fb60583c2", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62"], "color": "Brown", "material": "Leather"},
    {"name": "Sports Track Pants", "category": 0, "price": 899, "images": ["https://images.unsplash.com/photo-1506629082955-511b1aa562c8", "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1"], "color": "Black", "material": "Polyester"},
    {"name": "Casual Shorts", "category": 0, "price": 549, "images": ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b", "https://images.unsplash.com/photo-1519689373023-dd07c7988603"], "color": "Khaki", "material": "Cotton"},
    {"name": "Formal Trousers", "category": 0, "price": 1099, "images": ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a", "https://images.unsplash.com/photo-1624378515195-6bbdb73dff1a"], "color": "Grey", "material": "Wool Blend"},
    {"name": "Hooded Sweatshirt", "category": 0, "price": 999, "images": ["https://images.unsplash.com/photo-1556821840-3a63f95609a7", "https://images.unsplash.com/photo-1578587018452-892bacefd3f2"], "color": "Navy", "material": "Cotton"},
    {"name": "Winter Jacket", "category": 0, "price": 2999, "images": ["https://images.unsplash.com/photo-1551028719-00167b16eac5", "https://images.unsplash.com/photo-1544022613-e87ca75a784a"], "color": "Black", "material": "Nylon"},
    {"name": "Slim Fit Shirt", "category": 0, "price": 849, "images": ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633", "https://images.unsplash.com/photo-1602810319428-019690571b5b"], "color": "Pink", "material": "Cotton"},
    {"name": "Cargo Pants", "category": 0, "price": 1199, "images": ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80", "https://images.unsplash.com/photo-1473966968600-fa801b869a1a"], "color": "Olive", "material": "Cotton"},
    {"name": "V-Neck T-Shirt", "category": 0, "price": 399, "images": ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a", "https://images.unsplash.com/photo-1622445275463-afa2ab738c34"], "color": "Grey", "material": "Cotton"},
    {"name": "Checked Casual Shirt", "category": 0, "price": 749, "images": ["https://images.unsplash.com/photo-1603252109303-2751441dd157", "https://images.unsplash.com/photo-1598032895397-619f94a8e6e7"], "color": "Red", "material": "Cotton"},
    {"name": "Henley T-Shirt", "category": 0, "price": 649, "images": ["https://images.unsplash.com/photo-1618354691373-d851c5c3a990", "https://images.unsplash.com/photo-1576566588028-4147f3842f27"], "color": "Maroon", "material": "Cotton"},
    
    # Women's Fashion (15 items)
    {"name": "Floral Maxi Dress", "category": 1, "price": 1499, "images": ["https://images.unsplash.com/photo-1595777457583-95e059d581b8", "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1"], "color": "Multicolor", "material": "Chiffon"},
    {"name": "Cotton Kurti", "category": 1, "price": 799, "images": ["https://images.unsplash.com/photo-1610652492500-ded49ceeb23d", "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa"], "color": "Yellow", "material": "Cotton"},
    {"name": "Ethnic Saree", "category": 1, "price": 2499, "images": ["https://images.unsplash.com/photo-1610031959253-24d8f2ac3954", "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb"], "color": "Red", "material": "Silk"},
    {"name": "Denim Jacket", "category": 1, "price": 1699, "images": ["https://images.unsplash.com/photo-1551537482-f2075a1d41f2", "https://images.unsplash.com/photo-1578932750294-f5075e85f44a"], "color": "Blue", "material": "Denim"},
    {"name": "Palazzo Pants", "category": 1, "price": 699, "images": ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1", "https://images.unsplash.com/photo-1624378440070-7f6c99f8fc30"], "color": "Black", "material": "Cotton"},
    {"name": "Crop Top", "category": 1, "price": 499, "images": ["https://images.unsplash.com/photo-1554568218-0f1715e72254", "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8"], "color": "White", "material": "Cotton"},
    {"name": "A-Line Skirt", "category": 1, "price": 899, "images": ["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa", "https://images.unsplash.com/photo-1590736969955-71cc94901144"], "color": "Navy", "material": "Polyester"},
    {"name": "Party Gown", "category": 1, "price": 3499, "images": ["https://images.unsplash.com/photo-1566174053879-31528523f8ae", "https://images.unsplash.com/photo-1595777457583-95e059d581b8"], "color": "Maroon", "material": "Georgette"},
    {"name": "Casual Top", "category": 1, "price": 549, "images": ["https://images.unsplash.com/photo-1564584217132-2271feaeb3c5", "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6"], "color": "Pink", "material": "Cotton"},
    {"name": "Leggings Set", "category": 1, "price": 449, "images": ["https://images.unsplash.com/photo-1598524678922-2838eb3f2273", "https://images.unsplash.com/photo-1506629082955-511b1aa562c8"], "color": "Black", "material": "Lycra"},
    {"name": "Designer Blouse", "category": 1, "price": 1299, "images": ["https://images.unsplash.com/photo-1610031959253-24d8f2ac3954", "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb"], "color": "Gold", "material": "Silk"},
    {"name": "Summer Dress", "category": 1, "price": 999, "images": ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1", "https://images.unsplash.com/photo-1594847098865-f48ef7f207d0"], "color": "Blue", "material": "Cotton"},
    {"name": "Cardigan Sweater", "category": 1, "price": 1199, "images": ["https://images.unsplash.com/photo-1591369822096-ffd140ec948f", "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc"], "color": "Beige", "material": "Wool"},
    {"name": "Jumpsuit", "category": 1, "price": 1799, "images": ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"], "color": "Black", "material": "Cotton"},
    {"name": "Ethnic Dupatta", "category": 1, "price": 399, "images": ["https://images.unsplash.com/photo-1610031959253-24d8f2ac3954", "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa"], "color": "Orange", "material": "Chiffon"},
    
    # Footwear (10 items)
    {"name": "Running Shoes", "category": 2, "price": 2499, "images": ["https://images.unsplash.com/photo-1542291026-7eec264c27ff", "https://images.unsplash.com/photo-1460353581641-37baddab0fa2"], "color": "Black", "material": "Synthetic"},
    {"name": "Formal Leather Shoes", "category": 2, "price": 1999, "images": ["https://images.unsplash.com/photo-1533867617858-e7b97e060509", "https://images.unsplash.com/photo-1614252234970-cd4f38d1e7fb"], "color": "Brown", "material": "Leather"},
    {"name": "Casual Sneakers", "category": 2, "price": 1499, "images": ["https://images.unsplash.com/photo-1549298916-b41d501d3772", "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"], "color": "White", "material": "Canvas"},
    {"name": "Sports Sandals", "category": 2, "price": 799, "images": ["https://images.unsplash.com/photo-1603808033192-082d6919d3e1", "https://images.unsplash.com/photo-1562876080-92e44024f5e2"], "color": "Grey", "material": "Rubber"},
    {"name": "Women's Heels", "category": 2, "price": 1799, "images": ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2", "https://images.unsplash.com/photo-1533844918633-e2e7370b5d66"], "color": "Red", "material": "Leather"},
    {"name": "Flip Flops", "category": 2, "price": 299, "images": ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f", "https://images.unsplash.com/photo-1562876080-92e44024f5e2"], "color": "Blue", "material": "Rubber"},
    {"name": "Boots", "category": 2, "price": 2999, "images": ["https://images.unsplash.com/photo-1605812860427-4024433a70fd", "https://images.unsplash.com/photo-1608256246200-53e635b5b65f"], "color": "Black", "material": "Leather"},
    {"name": "Loafers", "category": 2, "price": 1299, "images": ["https://images.unsplash.com/photo-1533867617858-e7b97e060509", "https://images.unsplash.com/photo-1512374382149-233c42b6a83b"], "color": "Tan", "material": "Suede"},
    {"name": "Ballet Flats", "category": 2, "price": 899, "images": ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2", "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a"], "color": "Pink", "material": "Leather"},
    {"name": "Slippers", "category": 2, "price": 349, "images": ["https://images.unsplash.com/photo-1605812860427-4024433a70fd", "https://images.unsplash.com/photo-1562876080-92e44024f5e2"], "color": "Brown", "material": "Leather"},
    
    # Electronics (10 items)
    {"name": "Wireless Earbuds", "category": 3, "price": 1999, "images": ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df", "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7"], "color": "Black", "material": "Plastic"},
    {"name": "Bluetooth Speaker", "category": 3, "price": 1499, "images": ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1", "https://images.unsplash.com/photo-1589003077984-894e133dabab"], "color": "Blue", "material": "Metal"},
    {"name": "Power Bank 20000mAh", "category": 3, "price": 1299, "images": ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5", "https://images.unsplash.com/photo-1625948515291-69613efd103f"], "color": "Black", "material": "Aluminum"},
    {"name": "USB Type-C Cable", "category": 3, "price": 299, "images": ["https://images.unsplash.com/photo-1625948515291-69613efd103f", "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b"], "color": "White", "material": "Nylon"},
    {"name": "Smart Watch", "category": 3, "price": 3499, "images": ["https://images.unsplash.com/photo-1523275335684-37898b6baf30", "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1"], "color": "Black", "material": "Silicone"},
    {"name": "Webcam HD", "category": 3, "price": 1799, "images": ["https://images.unsplash.com/photo-1611532736579-6b16e2b50449", "https://images.unsplash.com/photo-1625948515291-69613efd103f"], "color": "Black", "material": "Plastic"},
    {"name": "Gaming Mouse", "category": 3, "price": 999, "images": ["https://images.unsplash.com/photo-1527814050087-3793815479db", "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7"], "color": "RGB", "material": "Plastic"},
    {"name": "Mechanical Keyboard", "category": 3, "price": 2499, "images": ["https://images.unsplash.com/photo-1595225476474-87563907a212", "https://images.unsplash.com/photo-1587829741301-dc798b83add3"], "color": "Black", "material": "Aluminum"},
    {"name": "Laptop Stand", "category": 3, "price": 799, "images": ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46", "https://images.unsplash.com/photo-1625948515291-69613efd103f"], "color": "Silver", "material": "Aluminum"},
    {"name": "Ring Light", "category": 3, "price": 1199, "images": ["https://images.unsplash.com/photo-1611532736579-6b16e2b50449", "https://images.unsplash.com/photo-1598287123394-2f29c0e57dad"], "color": "White", "material": "Plastic"},
    
    # Home & Kitchen (10 items)
    {"name": "Non-Stick Cookware Set", "category": 4, "price": 2999, "images": ["https://images.unsplash.com/photo-1584990347449-ddd8b2a42ef3", "https://images.unsplash.com/photo-1556911261-6bd341186b2f"], "color": "Black", "material": "Aluminum"},
    {"name": "Dinner Set 24 Pieces", "category": 4, "price": 1999, "images": ["https://images.unsplash.com/photo-1578663248512-36c5e0ad9f50", "https://images.unsplash.com/photo-1610701596007-11502861dcfa"], "color": "White", "material": "Ceramic"},
    {"name": "Vacuum Cleaner", "category": 4, "price": 4999, "images": ["https://images.unsplash.com/photo-1558317374-067fb5f30001", "https://images.unsplash.com/photo-1558317374-067fb5f30001"], "color": "Red", "material": "Plastic"},
    {"name": "Water Purifier", "category": 4, "price": 7999, "images": ["https://images.unsplash.com/photo-1602143407264-cf1f55d6c731", "https://images.unsplash.com/photo-1551732998-9261ecba0d37"], "color": "White", "material": "Plastic"},
    {"name": "Mixer Grinder", "category": 4, "price": 2499, "images": ["https://images.unsplash.com/photo-1585515320310-259814833e62", "https://images.unsplash.com/photo-1556911261-6bd341186b2f"], "color": "Silver", "material": "Stainless Steel"},
    {"name": "Bedsheet Set", "category": 4, "price": 799, "images": ["https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5", "https://images.unsplash.com/photo-1541123437800-1bb1317badc2"], "color": "Blue", "material": "Cotton"},
    {"name": "Curtains Set", "category": 4, "price": 999, "images": ["https://images.unsplash.com/photo-1616486338812-3dadae4b4ace", "https://images.unsplash.com/photo-1605774337664-7a846e9cdf17"], "color": "Cream", "material": "Polyester"},
    {"name": "Wall Clock", "category": 4, "price": 449, "images": ["https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c", "https://images.unsplash.com/photo-1533090161767-e6ffed986c88"], "color": "Brown", "material": "Wood"},
    {"name": "Storage Containers Set", "category": 4, "price": 599, "images": ["https://images.unsplash.com/photo-1610701596007-11502861dcfa", "https://images.unsplash.com/photo-1584990347449-ddd8b2a42ef3"], "color": "Clear", "material": "Plastic"},
    {"name": "Table Lamp", "category": 4, "price": 699, "images": ["https://images.unsplash.com/photo-1513506003901-1e6a229e2d15", "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f"], "color": "White", "material": "Metal"},
    
    # Beauty & Personal Care (10 items)
    {"name": "Face Cream SPF 30", "category": 5, "price": 599, "images": ["https://images.unsplash.com/photo-1556228578-8c89e6adf883", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be"], "color": "White", "material": "Cream"},
    {"name": "Hair Serum", "category": 5, "price": 449, "images": ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b", "https://images.unsplash.com/photo-1571875257727-256c39da42af"], "color": "Transparent", "material": "Liquid"},
    {"name": "Perfume 100ml", "category": 5, "price": 1299, "images": ["https://images.unsplash.com/photo-1541643600914-78b084683601", "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75"], "color": "Gold", "material": "Glass"},
    {"name": "Lipstick Set", "category": 5, "price": 799, "images": ["https://images.unsplash.com/photo-1586495777744-4413f21062fa", "https://images.unsplash.com/photo-1631214524020-7e18db7f7f11"], "color": "Red", "material": "Wax"},
    {"name": "Shampoo & Conditioner", "category": 5, "price": 549, "images": ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b", "https://images.unsplash.com/photo-1527799820374-dcf8d9dcb2e5"], "color": "Purple", "material": "Liquid"},
    {"name": "Body Lotion", "category": 5, "price": 399, "images": ["https://images.unsplash.com/photo-1556228578-8c89e6adf883", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be"], "color": "White", "material": "Cream"},
    {"name": "Face Wash", "category": 5, "price": 299, "images": ["https://images.unsplash.com/photo-1556228578-8c89e6adf883", "https://images.unsplash.com/photo-1571875257727-256c39da42af"], "color": "Green", "material": "Gel"},
    {"name": "Makeup Kit", "category": 5, "price": 1999, "images": ["https://images.unsplash.com/photo-1596462502278-27bfdc403348", "https://images.unsplash.com/photo-1631214524020-7e18db7f7f11"], "color": "Multicolor", "material": "Mixed"},
    {"name": "Beard Oil", "category": 5, "price": 349, "images": ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b", "https://images.unsplash.com/photo-1556228578-8c89e6adf883"], "color": "Brown", "material": "Oil"},
    {"name": "Sunscreen SPF 50", "category": 5, "price": 499, "images": ["https://images.unsplash.com/photo-1556228578-8c89e6adf883", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be"], "color": "White", "material": "Lotion"},
    
    # Sports & Fitness (10 items)
    {"name": "Yoga Mat", "category": 6, "price": 799, "images": ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f", "https://images.unsplash.com/photo-1592432678016-e910b452f9a2"], "color": "Purple", "material": "PVC"},
    {"name": "Dumbbell Set 10kg", "category": 6, "price": 1499, "images": ["https://images.unsplash.com/photo-1517836357463-d25dfeac3438", "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e"], "color": "Black", "material": "Iron"},
    {"name": "Resistance Bands", "category": 6, "price": 599, "images": ["https://images.unsplash.com/photo-1598289431512-b97b0917affc", "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f"], "color": "Red", "material": "Latex"},
    {"name": "Gym Bag", "category": 6, "price": 899, "images": ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62", "https://images.unsplash.com/photo-1547949003-9792a18a2601"], "color": "Black", "material": "Polyester"},
    {"name": "Skipping Rope", "category": 6, "price": 249, "images": ["https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"], "color": "Blue", "material": "Plastic"},
    {"name": "Tennis Racket", "category": 6, "price": 1999, "images": ["https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67", "https://images.unsplash.com/photo-1617083278168-89e8e43e2a29"], "color": "Yellow", "material": "Graphite"},
    {"name": "Cricket Bat", "category": 6, "price": 1799, "images": ["https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972", "https://images.unsplash.com/photo-1531415074968-7af590202189"], "color": "Brown", "material": "Wood"},
    {"name": "Football", "category": 6, "price": 599, "images": ["https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aae", "https://images.unsplash.com/photo-1575361204480-aadea25e6e68"], "color": "White", "material": "Leather"},
    {"name": "Badminton Racket", "category": 6, "price": 999, "images": ["https://images.unsplash.com/photo-1626224583764-f87db24ac4ea", "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea"], "color": "Red", "material": "Aluminum"},
    {"name": "Cycling Gloves", "category": 6, "price": 399, "images": ["https://images.unsplash.com/photo-1557804506-669a67965ba0", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"], "color": "Black", "material": "Synthetic"},
    
    # Books (10 items)
    {"name": "The Great Gatsby", "category": 7, "price": 299, "images": ["https://images.unsplash.com/photo-1544947950-fa07a98d237f", "https://images.unsplash.com/photo-1512820790803-83ca734da794"], "color": "Multicolor", "material": "Paper"},
    {"name": "To Kill a Mockingbird", "category": 7, "price": 349, "images": ["https://images.unsplash.com/photo-1543002588-bfa74002ed7e", "https://images.unsplash.com/photo-1512820790803-83ca734da794"], "color": "Multicolor", "material": "Paper"},
    {"name": "Python Programming Guide", "category": 7, "price": 599, "images": ["https://images.unsplash.com/photo-1532012197267-da84d127e765", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"], "color": "Blue", "material": "Paper"},
    {"name": "Indian History Book", "category": 7, "price": 449, "images": ["https://images.unsplash.com/photo-1512820790803-83ca734da794", "https://images.unsplash.com/photo-1543002588-bfa74002ed7e"], "color": "Brown", "material": "Paper"},
    {"name": "Cookbook 500 Recipes", "category": 7, "price": 499, "images": ["https://images.unsplash.com/photo-1590691566903-692bf5ca2ea4", "https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9"], "color": "Red", "material": "Paper"},
    {"name": "Self Help Book", "category": 7, "price": 399, "images": ["https://images.unsplash.com/photo-1544947950-fa07a98d237f", "https://images.unsplash.com/photo-1512820790803-83ca734da794"], "color": "Yellow", "material": "Paper"},
    {"name": "Children's Story Book", "category": 7, "price": 249, "images": ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c", "https://images.unsplash.com/photo-1512820790803-83ca734da794"], "color": "Multicolor", "material": "Paper"},
    {"name": "Business Strategy Book", "category": 7, "price": 699, "images": ["https://images.unsplash.com/photo-1589829085413-56de8ae18c73", "https://images.unsplash.com/photo-1532012197267-da84d127e765"], "color": "Black", "material": "Paper"},
    {"name": "Fiction Novel", "category": 7, "price": 349, "images": ["https://images.unsplash.com/photo-1543002588-bfa74002ed7e", "https://images.unsplash.com/photo-1512820790803-83ca734da794"], "color": "Green", "material": "Paper"},
    {"name": "Travel Guide India", "category": 7, "price": 549, "images": ["https://images.unsplash.com/photo-1512820790803-83ca734da794", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"], "color": "Blue", "material": "Paper"},
    
    # Toys & Games (5 items)
    {"name": "LEGO Building Blocks", "category": 8, "price": 1999, "images": ["https://images.unsplash.com/photo-1587654780291-39c9404d746b", "https://images.unsplash.com/photo-1558060370-d644479cb6f7"], "color": "Multicolor", "material": "Plastic"},
    {"name": "Board Game Set", "category": 8, "price": 899, "images": ["https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09", "https://images.unsplash.com/photo-1606167668584-78701c57f13d"], "color": "Multicolor", "material": "Cardboard"},
    {"name": "Puzzle 1000 Pieces", "category": 8, "price": 599, "images": ["https://images.unsplash.com/photo-1587654780291-39c9404d746b", "https://images.unsplash.com/photo-1609784810008-eaf12e0e5a5f"], "color": "Multicolor", "material": "Cardboard"},
    {"name": "Remote Control Car", "category": 8, "price": 1499, "images": ["https://images.unsplash.com/photo-1558060370-d644479cb6f7", "https://images.unsplash.com/photo-1587654780291-39c9404d746b"], "color": "Red", "material": "Plastic"},
    {"name": "Soft Toy Teddy Bear", "category": 8, "price": 499, "images": ["https://images.unsplash.com/photo-1530325553241-4f6e7690cf36", "https://images.unsplash.com/photo-1563454392212-322f684e57b7"], "color": "Brown", "material": "Fabric"},
    
    # Jewelry (5 items)
    {"name": "Gold Plated Necklace", "category": 9, "price": 1999, "images": ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338"], "color": "Gold", "material": "Gold Plated"},
    {"name": "Silver Earrings", "category": 9, "price": 899, "images": ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908", "https://images.unsplash.com/photo-1611591437281-460bfbe1220a"], "color": "Silver", "material": "Silver"},
    {"name": "Diamond Ring", "category": 9, "price": 4999, "images": ["https://images.unsplash.com/photo-1605100804763-247f67b3557e", "https://images.unsplash.com/photo-1603561591411-07134e71a2a9"], "color": "Silver", "material": "Silver"},
    {"name": "Pearl Bracelet", "category": 9, "price": 1499, "images": ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338"], "color": "White", "material": "Pearl"},
    {"name": "Fashion Bangles Set", "category": 9, "price": 699, "images": ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a", "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f"], "color": "Gold", "material": "Brass"},
    
    # Bags & Luggage (5 items)
    {"name": "Leather Backpack", "category": 10, "price": 1999, "images": ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62", "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3"], "color": "Brown", "material": "Leather"},
    {"name": "Travel Suitcase 28 inch", "category": 10, "price": 3999, "images": ["https://images.unsplash.com/photo-1565026057447-bc90a3dceb87", "https://images.unsplash.com/photo-1591561954557-26941169b49e"], "color": "Black", "material": "Polycarbonate"},
    {"name": "Handbag for Women", "category": 10, "price": 1499, "images": ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7", "https://images.unsplash.com/photo-1548036328-c9fa89d128fa"], "color": "Red", "material": "Leather"},
    {"name": "Laptop Bag", "category": 10, "price": 1299, "images": ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62", "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3"], "color": "Black", "material": "Nylon"},
    {"name": "Duffle Bag", "category": 10, "price": 899, "images": ["https://images.unsplash.com/photo-1547949003-9792a18a2601", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62"], "color": "Navy", "material": "Canvas"},
    
    # Watches (5 items)
    {"name": "Analog Watch Men", "category": 11, "price": 1999, "images": ["https://images.unsplash.com/photo-1523275335684-37898b6baf30", "https://images.unsplash.com/photo-1524805444758-089113d48a6d"], "color": "Black", "material": "Stainless Steel"},
    {"name": "Digital Sports Watch", "category": 11, "price": 1299, "images": ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1", "https://images.unsplash.com/photo-1622434641406-a158123450f9"], "color": "Blue", "material": "Plastic"},
    {"name": "Luxury Watch", "category": 11, "price": 9999, "images": ["https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd", "https://images.unsplash.com/photo-1524805444758-089113d48a6d"], "color": "Gold", "material": "Gold"},
    {"name": "Women's Watch", "category": 11, "price": 1799, "images": ["https://images.unsplash.com/photo-1533139143976-84c4e7ec9b08", "https://images.unsplash.com/photo-1622434641406-a158123450f9"], "color": "Rose Gold", "material": "Stainless Steel"},
    {"name": "Smart Fitness Watch", "category": 11, "price": 2499, "images": ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1", "https://images.unsplash.com/photo-1544117519-31a4b719223d"], "color": "Black", "material": "Silicone"},
    
    # Sunglasses (5 items)
    {"name": "Aviator Sunglasses", "category": 12, "price": 1299, "images": ["https://images.unsplash.com/photo-1511499767150-a48a237f0083", "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a"], "color": "Black", "material": "Metal"},
    {"name": "Wayfarer Sunglasses", "category": 12, "price": 999, "images": ["https://images.unsplash.com/photo-1572635196237-14b3f281503f", "https://images.unsplash.com/photo-1511499767150-a48a237f0083"], "color": "Brown", "material": "Plastic"},
    {"name": "Sports Sunglasses", "category": 12, "price": 799, "images": ["https://images.unsplash.com/photo-1556306535-0f09a537f0a3", "https://images.unsplash.com/photo-1572635196237-14b3f281503f"], "color": "Blue", "material": "Plastic"},
    {"name": "Cat Eye Sunglasses", "category": 12, "price": 1099, "images": ["https://images.unsplash.com/photo-1511499767150-a48a237f0083", "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a"], "color": "Black", "material": "Acetate"},
    {"name": "Round Sunglasses", "category": 12, "price": 899, "images": ["https://images.unsplash.com/photo-1572635196237-14b3f281503f", "https://images.unsplash.com/photo-1556306535-0f09a537f0a3"], "color": "Gold", "material": "Metal"},
    
    # Mobile Accessories (5 items)
    {"name": "Phone Case iPhone", "category": 13, "price": 399, "images": ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb", "https://images.unsplash.com/photo-1585060544812-6b45742d762f"], "color": "Black", "material": "Silicone"},
    {"name": "Tempered Glass Screen Protector", "category": 13, "price": 199, "images": ["https://images.unsplash.com/photo-1598327105666-5b89351aff97", "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb"], "color": "Clear", "material": "Glass"},
    {"name": "Pop Socket", "category": 13, "price": 149, "images": ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb", "https://images.unsplash.com/photo-1585060544812-6b45742d762f"], "color": "Blue", "material": "Plastic"},
    {"name": "Car Phone Holder", "category": 13, "price": 299, "images": ["https://images.unsplash.com/photo-1598327105666-5b89351aff97", "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb"], "color": "Black", "material": "Plastic"},
    {"name": "Wireless Charger", "category": 13, "price": 999, "images": ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5", "https://images.unsplash.com/photo-1625948515291-69613efd103f"], "color": "White", "material": "Plastic"},
    
    # Health & Wellness (5 items)
    {"name": "Digital Thermometer", "category": 14, "price": 299, "images": ["https://images.unsplash.com/photo-1584515933487-779824d29309", "https://images.unsplash.com/photo-1631549916768-4119b2e5f926"], "color": "White", "material": "Plastic"},
    {"name": "Blood Pressure Monitor", "category": 14, "price": 1499, "images": ["https://images.unsplash.com/photo-1615486364531-84e67d8bb9bd", "https://images.unsplash.com/photo-1584515933487-779824d29309"], "color": "White", "material": "Plastic"},
    {"name": "Vitamin C Tablets", "category": 14, "price": 399, "images": ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae", "https://images.unsplash.com/photo-1471864190281-a93a3070b6de"], "color": "Orange", "material": "Tablets"},
    {"name": "Protein Powder 1kg", "category": 14, "price": 1999, "images": ["https://images.unsplash.com/photo-1579722820308-d742811e1243", "https://images.unsplash.com/photo-1593095948071-474c5cc2989d"], "color": "Chocolate", "material": "Powder"},
    {"name": "First Aid Kit", "category": 14, "price": 599, "images": ["https://images.unsplash.com/photo-1603398938378-e54eab446dde", "https://images.unsplash.com/photo-1584515933487-779824d29309"], "color": "Red", "material": "Plastic"}
]

print("Starting database population...")

# Insert Profiles
print("\nInserting profiles...")
profiles = []
for i, user_id in enumerate(user_ids):
    city_info = random.choice(indian_cities)
    profile = {
        "id": user_id,
        "email": f"{first_names[i].lower()}.{random.choice(last_names).lower()}@example.com",  # FIXED: Use random.choice
        "full_name": f"{first_names[i]} {random.choice(last_names)}",
        "phone": f"+91{random.randint(7000000000, 9999999999)}",
        "avatar_url": f"https://i.pravatar.cc/150?u={user_id}",
        "location": city_info,
        "preferences": {
            "sizes": random.choice([["S", "M"], ["M", "L"], ["L", "XL"]]),
            "favorite_categories": random.sample(["mens-fashion", "womens-fashion", "electronics"], 2),
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

# Insert Categories
print("\nInserting categories...")
categories = []
for i, cat_id in enumerate(category_ids):
    if i < len(categories_data):
        category = {
            "id": cat_id,
            "name": categories_data[i]["name"],
            "slug": categories_data[i]["slug"],
            "description": categories_data[i]["description"],
            "parent_id": None,
            "image_url": f"https://source.unsplash.com/400x300/?{categories_data[i]['slug']}",
            "created_at": random_date(365, 1).isoformat()
        }
        categories.append(category)

try:
    result = supabase.table('categories').insert(categories).execute()
    print(f"✓ Inserted {len(categories)} categories")
except Exception as e:
    print(f"✗ Error inserting categories: {e}")

# Insert Products
print("\nInserting products...")
products = []
for i, product_id in enumerate(product_ids):
    if i < len(products_data):
        prod_data = products_data[i]
        product = {
            "id": product_id,
            "name": prod_data["name"],
            "slug": prod_data["name"].lower().replace(" ", "-").replace("'", ""),
            "description": f"High quality {prod_data['name']} made from {prod_data['material']}. Perfect for everyday use.",
            "category_id": category_ids[prod_data["category"]],
            "base_price": prod_data["price"],
            "images": prod_data["images"],
            "attributes": {
                "color": prod_data["color"],
                "material": prod_data["material"],
                "brand": random.choice(["Brand A", "Brand B", "Brand C", "Generic"])
            },
            "tags": [prod_data["material"], prod_data["color"], "bestseller"] if i % 3 == 0 else [prod_data["material"]],
            "is_digital": False,
            "stock_quantity": random.randint(10, 500),
            "created_at": random_date(180, 1).isoformat(),
            "updated_at": datetime.now().isoformat()
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
ps_id_counter = 0
for product_id in product_ids:
    # Each product sold by 2-4 sellers
    num_sellers = random.randint(2, 4)
    selected_sellers = random.sample(seller_ids, num_sellers)
    
    for seller_id in selected_sellers:
        base_price = next((p["price"] for p in products_data if products_data.index(p) == product_ids.index(product_id)), 1000)
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
        ps_id_counter += 1
        
        if ps_id_counter >= 200:  # Limit to reasonable number
            break
    if ps_id_counter >= 200:
        break

try:
    result = supabase.table('product_sellers').insert(product_sellers[:200]).execute()
    print(f"✓ Inserted {min(200, len(product_sellers))} product-seller relationships")
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
        "total": 0,  # Will calculate
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
    # Each order has 1-4 items
    num_items = random.randint(1, 4)
    for _ in range(num_items):
        # FIXED: Use len(product_ids) instead of len(products_data)
        product_idx = random.randint(0, len(product_ids) - 1)
        prod_data = products_data[product_idx]
        
        item = {
            "id": str(uuid.uuid4()),
            "order_id": order_id,
            "product_id": product_ids[product_idx],
            "seller_id": random.choice(seller_ids),
            "product_name": prod_data["name"],
            "product_image": prod_data["images"][0],
            "quantity": random.randint(1, 3),
            "price": prod_data["price"],
            "attributes": {"color": prod_data["color"], "size": random.choice(["S", "M", "L"])},
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

for order_id in order_ids[:15]:  # Add tracking for 15 orders
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

# Insert Reviews
print("\nInserting reviews...")
reviews = []
review_titles = [
    "Excellent product!", "Good value for money", "Not as expected", "Amazing quality",
    "Satisfied with purchase", "Could be better", "Highly recommended", "Waste of money",
    "Perfect fit", "Disappointed", "Great product", "Average quality",
    "Exceeded expectations", "Not worth the price", "Will buy again", "Poor quality",
    "Awesome!", "Decent product", "Not satisfied", "Best purchase ever"
]

review_contents = [
    "This product is amazing! Exactly what I was looking for.",
    "Good quality but delivery was delayed.",
    "The product quality is not as shown in pictures.",
    "Excellent product. Worth every penny!",
    "Happy with my purchase. Would recommend to others.",
    "The product is okay but packaging could be better.",
    "Absolutely love it! Best purchase this year.",
    "Not satisfied. The quality is very poor.",
    "Perfect size and great material quality.",
    "Disappointed with the product. Expected better quality.",
    "Great value for money. Highly satisfied!",
    "Average product. Nothing special about it.",
    "This exceeded my expectations. Amazing!",
    "Overpriced for the quality offered.",
    "Will definitely buy again. Loved it!",
    "Very poor quality. Would not recommend.",
    "Awesome product! My family loves it.",
    "Decent product for the price.",
    "Not happy with this purchase.",
    "Best product ever! Couldn't be happier."
]

for i in range(50):  # 50 reviews
    rating = random.randint(1, 5)
    review = {
        "id": str(uuid.uuid4()),
        "product_id": random.choice(product_ids),
        "user_id": random.choice(user_ids),
        "seller_id": random.choice(seller_ids),
        "order_id": random.choice(order_ids) if random.random() > 0.3 else None,
        "rating": rating,
        "title": review_titles[i % len(review_titles)],
        "content": review_contents[i % len(review_contents)],
        "images": [f"https://picsum.photos/400/400?random={i}"] if random.random() > 0.7 else [],
        "verified_purchase": random.choice([True, True, False]),
        "helpful_count": random.randint(0, 100),
        "detailed_ratings": {
            "comfort": random.randint(6, 10),
            "durability": random.randint(6, 10),
            "value": random.randint(6, 10)
        } if rating >= 4 else None,
        "created_at": random_date(60, 1).isoformat()
    }
    reviews.append(review)

try:
    result = supabase.table('reviews').insert(reviews).execute()
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
        "product_ids": random.sample(product_ids, random.randint(2, 5)),
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
        "product_ids": random.sample(product_ids, random.randint(3, 6)),
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
print("\nNow run this SQL in Supabase to re-enable constraints:")
print("""
-- Re-enable constraints
ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
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
""").table('profiles').insert(profiles).execute()
print(f"✓ Inserted {len(profiles)} profiles")

# Continue with the rest of your existing code for orders, order_items, tracking, reviews, etc.
# (The code you already have in the document starting from "Insert Orders" section)

print("\n" + "="*60)
print("DATABASE POPULATION COMPLETED!")
print("="*60)
print("\nSummary:")
print(f"  • {len(profiles)} Profiles")
print(f"  • {len(sellers)} Sellers")
print(f"  • {len(categories)} Categories")
print(f"  • {len(products)} Products")
print(f"  • {min(200, len(product_sellers))} Product-Seller Relationships")
print(f"  • {len(cart_items)} Cart Items")
print(f"  • {len(orders)} Orders")
print(f"  • {len(order_items)} Order Items")
print(f"  • {len(order_tracking)} Tracking Records")
print(f"  • {len(reviews)} Reviews")
print(f"  • {len(wishlists)} Wishlist Items")
print(f"  • {len(outfits)} Outfits")
print(f"  • {len(replenishments)} Replenishment Schedules")
print(f"  • {len(addresses)} Addresses")
print(f"  • {len(bundles)} Bundles")

print("\n" + "="*60)
print("OPTIONAL: Sample Queries to Test Your Data")
print("="*60)
print("""
-- Get all products with their categories and images
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
LIMIT 10;

-- Get sellers with their product count
SELECT s.name, s.rating, COUNT(ps.product_id) as product_count
FROM sellers s
LEFT JOIN product_sellers ps ON s.id = ps.seller_id
GROUP BY s.id, s.name, s.rating
ORDER BY product_count DESC;

-- Get popular products (most reviews)
SELECT p.name, COUNT(r.id) as review_count, AVG(r.rating) as avg_rating
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name
ORDER BY review_count DESC
LIMIT 10;
""")

print("\nRemember to re-enable constraints in Supabase SQL Editor!")