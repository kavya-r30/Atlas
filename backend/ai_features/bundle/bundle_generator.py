# services/bundle_service.py
"""
Bundle generation service - creates curated product bundles
Orchestrates product selection, pricing, and AI-generated content
"""

import google.generativeai as genai
import os
from typing import List, Dict, Optional
from models.intent import UserIntent
from models.bundle import ProductBundle, BundleProduct
from database.supabase_repository import SupabaseProductRepository


class BundleGeneratorService:
    """Service for generating smart product bundles"""
    
    def __init__(self, product_repository: SupabaseProductRepository):
        """
        Initialize bundle generator
        
        Args:
            product_repository: Repository for product database operations
        """
        self.product_repo = product_repository
        
        # Initialize Gemini for content generation
        api_key = os.getenv('GEMINI_API_KEY')
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
    
    def create_bundle_from_intent(
        self, 
        intent: UserIntent, 
        user_id: Optional[str] = None
    ) -> ProductBundle:
        """
        Generate a curated bundle based on user intent
        
        Args:
            intent: Parsed user intent
            user_id: Optional user ID for personalization
            
        Returns:
            ProductBundle with selected products and metadata
        """
        # Step 1: Fetch relevant products from database
        products = self._fetch_relevant_products(intent)
        
        if not products:
            raise ValueError("No products found matching your criteria")
        
        # Step 2: Filter by budget
        budget_filtered = self._filter_products_by_budget(products, intent.budget_level)
        
        # Step 3: Select complementary products (4-6 items)
        selected_products = self._select_complementary_products(
            budget_filtered,
            intent,
            min_items=4,
            max_items=6
        )
        
        if len(selected_products) < 2:
            raise ValueError("Not enough products available for bundle")
        
        # Step 4: Generate bundle name
        bundle_name = self._generate_bundle_name(intent)
        
        # Step 5: Create bundle products with explanations
        bundle_products = self._create_bundle_products(selected_products, intent)
        
        # Step 6: Calculate pricing
        total_price, savings = self._calculate_bundle_pricing(bundle_products)
        
        # Step 7: Create bundle object
        bundle = ProductBundle(
            bundle_name=bundle_name,
            products=bundle_products,
            total_price=total_price,
            savings=savings,
            intent=intent
        )
        
        # Step 8: Save bundle to database
        bundle_id = self.product_repo.save_generated_bundle(bundle, user_id)
        bundle.bundle_id = bundle_id
        
        # Step 9: Log for analytics
        self.product_repo.log_search_query(
            query=intent.primary_activity,
            intent=intent,
            result_count=len(bundle_products)
        )
        
        return bundle
    
    def _fetch_relevant_products(self, intent: UserIntent) -> List[Dict]:
        """Fetch products matching intent from database"""
        products = self.product_repo.search_products_by_categories(
            categories=intent.related_categories,
            experience_level=intent.experience_level,
            budget_level=intent.budget_level,
            limit=30
        )
        
        # Fallback if strict filters return nothing
        if not products:
            products = self.product_repo.search_products_by_categories(
                categories=intent.related_categories,
                limit=20
            )
        
        return products
    
    def _filter_products_by_budget(
        self, 
        products: List[Dict], 
        budget_level: str
    ) -> List[Dict]:
        """Filter products based on budget constraints"""
        if not products:
            return []
        
        # Calculate average price
        prices = [p['price'] for p in products]
        avg_price = sum(prices) / len(prices)
        
        # Budget multipliers
        budget_limits = {
            "low": avg_price * 0.7,
            "medium": avg_price * 1.0,
            "high": avg_price * 1.5
        }
        
        max_price = budget_limits.get(budget_level, avg_price) * 1.3
        
        return [p for p in products if p['price'] <= max_price]
    
    def _select_complementary_products(
        self,
        products: List[Dict],
        intent: UserIntent,
        min_items: int = 4,
        max_items: int = 6
    ) -> List[Dict]:
        """Select diverse, complementary products"""
        
        # Group by category
        by_category = {}
        for product in products:
            category = product.get('category', 'other')
            if category not in by_category:
                by_category[category] = []
            by_category[category].append(product)
        
        selected = []
        target_count = min(max_items, max(min_items, len(by_category)))
        
        # Prioritize intent categories
        for category in intent.related_categories:
            if category in by_category and len(selected) < target_count:
                selected.append(by_category[category][0])
        
        # Fill remaining slots with diverse products
        for category, cat_products in by_category.items():
            if len(selected) >= target_count:
                break
            if not any(p.get('category') == category for p in selected):
                selected.append(cat_products[0])
        
        return selected[:max_items]
    
    def _generate_bundle_name(self, intent: UserIntent) -> str:
        """Generate intelligent bundle name using AI"""
        if not self.model:
            return f"{intent.experience_level.title()} {intent.primary_activity} Bundle"
        
        prompt = f"""Create a catchy, helpful product bundle name (max 6 words) for:
- Activity: {intent.primary_activity}
- Level: {intent.experience_level}
- Context: {intent.emotional_context}

Examples:
- "Beginner Runner Starter Kit"
- "Advanced Yoga Journey Bundle"
- "Confident Lifter Essentials"

Return ONLY the bundle name, nothing else."""

        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"temperature": 0.7, "max_output_tokens": 50}
            )
            return response.text.strip().strip('"')
        except:
            return f"{intent.experience_level.title()} {intent.primary_activity} Bundle"
    
    def _create_bundle_products(
        self,
        products: List[Dict],
        intent: UserIntent
    ) -> List[BundleProduct]:
        """Create BundleProduct objects with AI-generated explanations"""
        bundle_products = []
        
        for product in products:
            explanation = self._generate_product_explanation(product, intent)
            
            bundle_products.append(BundleProduct(
                id=product['id'],
                name=product['name'],
                price=product['price'],
                category=product.get('category', ''),
                explanation=explanation,
                image_url=product.get('image_url'),
                stock_quantity=product.get('stock_quantity')
            ))
        
        return bundle_products
    
    def _generate_product_explanation(
        self,
        product: Dict,
        intent: UserIntent
    ) -> str:
        """Generate personalized product explanation using AI"""
        if not self.model:
            return f"Perfect for {intent.primary_activity}"
        
        prompt = f"""Explain in one concise sentence (max 20 words) why this product fits the customer's need:

Product: {product['name']}
Category: {product.get('category', '')}
Customer Activity: {intent.primary_activity}
Experience Level: {intent.experience_level}
Emotional Context: {intent.emotional_context}

Focus on how it addresses their specific situation. Be encouraging and specific.
Return ONLY the explanation sentence."""

        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"temperature": 0.6, "max_output_tokens": 100}
            )
            return response.text.strip()
        except:
            return f"Ideal for your {intent.primary_activity} journey"
    
    def _calculate_bundle_pricing(
        self,
        products: List[BundleProduct]
    ) -> tuple[float, float]:
        """Calculate total price and savings"""
        total_price = sum(p.price for p in products)
        
        # Simulate 15% markup on individual purchases
        individual_price_sum = sum(p.price * 1.15 for p in products)
        savings = individual_price_sum - total_price
        
        return total_price, savings
