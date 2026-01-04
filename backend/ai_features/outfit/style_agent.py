# outfit_services/styling_service.py
"""
Styling service - handles outfit logic without AI
Basic rule-based styling for fallbacks
"""

from typing import List, Dict, Optional


class OutfitStylingService:
    """Service for basic outfit styling operations"""
    
    def __init__(self, wardrobe_repository):
        self.wardrobe_repo = wardrobe_repository
    
    def get_trending_styles(self, season: str = None, limit: int = 10) -> List[Dict]:
        """Get trending outfit styles"""
        # This would connect to a trends database or API
        trends = [
            {
                'style_name': 'Quiet Luxury',
                'description': 'Minimalist, high-quality basics in neutral tones',
                'key_pieces': ['cashmere sweater', 'tailored trousers', 'leather loafers'],
                'season': 'all'
            },
            {
                'style_name': 'Athleisure Chic',
                'description': 'Comfortable athletic wear styled fashionably',
                'key_pieces': ['joggers', 'sneakers', 'oversized hoodie'],
                'season': 'all'
            },
            {
                'style_name': 'Coastal Grandmother',
                'description': 'Relaxed, elegant beachy vibes',
                'key_pieces': ['linen shirt', 'wide-leg pants', 'espadrilles'],
                'season': 'spring/summer'
            }
        ]
        
        if season:
            trends = [t for t in trends if season.lower() in t['season']]
        
        return trends[:limit]
    
    def analyze_user_style(self, user_id: str) -> Dict:
        """Analyze user's style preferences from wardrobe"""
        wardrobe = self.wardrobe_repo.get_user_wardrobe(user_id)
        
        if not wardrobe:
            return {'message': 'No wardrobe items found'}
        
        # Analyze color preferences
        colors = {}
        categories = {}
        styles = {}
        
        for item in wardrobe:
            # Count colors
            color = item.get('primary_color', 'unknown')
            colors[color] = colors.get(color, 0) + 1
            
            # Count categories
            category = item.get('category', 'unknown')
            categories[category] = categories.get(category, 0) + 1
            
            # Count styles
            style_tags = item.get('style_tags', [])
            for style in style_tags:
                styles[style] = styles.get(style, 0) + 1
        
        # Find top preferences
        top_colors = sorted(colors.items(), key=lambda x: x[1], reverse=True)[:3]
        top_categories = sorted(categories.items(), key=lambda x: x[1], reverse=True)[:3]
        top_styles = sorted(styles.items(), key=lambda x: x[1], reverse=True)[:3]
        
        # Identify gaps
        standard_categories = ['tops', 'bottoms', 'shoes', 'outerwear', 'accessories']
        missing_categories = [cat for cat in standard_categories if cat not in categories]
        
        return {
            'total_items': len(wardrobe),
            'favorite_colors': [color for color, count in top_colors],
            'dominant_categories': [cat for cat, count in top_categories],
            'style_preferences': [style for style, count in top_styles],
            'wardrobe_gaps': missing_categories,
            'recommendations': self._generate_gap_recommendations(missing_categories)
        }
    
    def _generate_gap_recommendations(self, gaps: List[str]) -> List[str]:
        """Generate recommendations to fill wardrobe gaps"""
        recommendations = []
        
        gap_suggestions = {
            'tops': 'Add basic tees and button-down shirts',
            'bottoms': 'Include jeans and versatile pants',
            'shoes': 'Get comfortable sneakers and dress shoes',
            'outerwear': 'Invest in a versatile jacket or blazer',
            'accessories': 'Add belts, watches, or jewelry for finishing touches'
        }
        
        for gap in gaps:
            if gap in gap_suggestions:
                recommendations.append(gap_suggestions[gap])
        
        return recommendations


# outfit_services/wardrobe_service.py
"""
Wardrobe service - manages user wardrobe operations
"""

from typing import List, Dict, Optional
from datetime import datetime


class WardrobeService:
    """Service for wardrobe management"""
    
    def __init__(self, wardrobe_repository):
        self.wardrobe_repo = wardrobe_repository
    
    def get_user_wardrobe(
        self,
        user_id: str,
        category: Optional[str] = None,
        limit: int = 50
    ) -> List[Dict]:
        """Get user's wardrobe items"""
        return self.wardrobe_repo.get_user_wardrobe(
            user_id=user_id,
            category=category,
            limit=limit
        )
    
    def add_to_wardrobe(
        self,
        user_id: str,
        product_id: str,
        purchase_date: Optional[str] = None
    ) -> Dict:
        """Add item to user's wardrobe"""
        
        # Get product details
        product = self.wardrobe_repo.get_product_by_id(product_id)
        
        if not product:
            raise ValueError(f"Product {product_id} not found")
        
        wardrobe_item = {
            'user_id': user_id,
            'product_id': product_id,
            'product_name': product['name'],
            'category': product.get('category'),
            'primary_color': product.get('primary_color'),
            'style_tags': product.get('style_tags', []),
            'season': product.get('season', []),
            'purchase_date': purchase_date or datetime.now().isoformat(),
            'added_at': datetime.now().isoformat()
        }
        
        item_id = self.wardrobe_repo.add_wardrobe_item(wardrobe_item)
        wardrobe_item['id'] = item_id
        
        return wardrobe_item


# outfit_services/compatibility_service.py
"""
Compatibility service - analyzes item compatibility
"""

from typing import Dict, List


class CompatibilityService:
    """Service for analyzing outfit compatibility"""
    
    def __init__(self, wardrobe_repository):
        self.wardrobe_repo = wardrobe_repository
    
    def get_color_pairings(self, color: str, item_type: str) -> Dict:
        """Get color pairing suggestions"""
        
        color_theory = {
            'blue': {
                'complementary': ['orange', 'rust', 'coral'],
                'neutral': ['white', 'beige', 'gray', 'black'],
                'monochromatic': ['navy', 'light blue', 'sky blue']
            },
            'red': {
                'complementary': ['green', 'teal'],
                'neutral': ['black', 'white', 'gray'],
                'analogous': ['orange', 'pink']
            },
            'black': {
                'pairs_with': 'everything',
                'best_combinations': ['white', 'red', 'gold', 'pastels']
            },
            'white': {
                'pairs_with': 'everything',
                'creates_contrast': ['navy', 'black', 'burgundy']
            }
        }
        
        pairings = color_theory.get(color.lower(), {
            'neutral': ['black', 'white', 'gray'],
            'note': 'Safe neutral pairings'
        })
        
        return {
            'base_color': color,
            'item_type': item_type,
            'suggested_pairings': pairings,
            'tips': f'For {item_type}, these colors create balanced looks'
        }
