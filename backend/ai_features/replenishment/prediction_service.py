# replenishment_services/prediction_service.py
"""
Replenishment prediction service
Uses statistical analysis and ML for consumption prediction
"""

from typing import List, Dict, Optional
from datetime import datetime, timedelta
from collections import defaultdict
import statistics


class ReplenishmentPredictionService:
    """Service for predicting when users need to reorder products"""
    
    def __init__(self, inventory_repository):
        """
        Initialize prediction service
        
        Args:
            inventory_repository: Repository for database operations
        """
        self.inventory_repo = inventory_repository
    
    def predict_user_replenishment(
        self,
        user_id: str,
        product_ids: Optional[List[str]] = None,
        days_ahead: int = 30
    ) -> List[Dict]:
        """
        Predict which products user will need to reorder
        
        Args:
            user_id: User identifier
            product_ids: Specific products to predict (None for all)
            days_ahead: Prediction window in days
            
        Returns:
            List of replenishment predictions
        """
        # Get user purchase history
        purchase_history = self.inventory_repo.get_user_purchases(
            user_id,
            limit=200
        )
        
        if not purchase_history:
            return []
        
        # Group by product
        product_purchases = self._group_purchases_by_product(purchase_history)
        
        # Filter if specific products requested
        if product_ids:
            product_purchases = {
                k: v for k, v in product_purchases.items() 
                if k in product_ids
            }
        
        # Generate predictions for each product
        predictions = []
        for product_id, purchases in product_purchases.items():
            prediction = self._predict_product_replenishment(
                user_id,
                product_id,
                purchases,
                days_ahead
            )
            
            if prediction:
                predictions.append(prediction)
        
        # Sort by urgency (days until stockout)
        predictions.sort(key=lambda x: x.get('days_until_stockout', 999))
        
        return predictions
    
    def _predict_product_replenishment(
        self,
        user_id: str,
        product_id: str,
        purchases: List[Dict],
        days_ahead: int
    ) -> Optional[Dict]:
        """Predict replenishment for single product"""
        
        if len(purchases) < 2:
            return None  # Need at least 2 purchases to predict
        
        # Calculate consumption pattern
        consumption_pattern = self._analyze_consumption_pattern(purchases)
        
        # Get product details
        product = self.inventory_repo.get_product_by_id(product_id)
        
        if not product:
            return None
        
        # Calculate predicted reorder date
        last_purchase_date = datetime.fromisoformat(purchases[0]['purchase_date'])
        avg_interval = consumption_pattern['average_interval_days']
        
        predicted_reorder_date = last_purchase_date + timedelta(days=avg_interval)
        days_until_stockout = (predicted_reorder_date - datetime.now()).days
        
        # Only include if within prediction window
        if days_until_stockout > days_ahead or days_until_stockout < 0:
            return None
        
        # Determine urgency
        if days_until_stockout <= 7:
            urgency = 'high'
        elif days_until_stockout <= 14:
            urgency = 'medium'
        else:
            urgency = 'low'
        
        return {
            'product_id': product_id,
            'product_name': product['name'],
            'product_category': product.get('category'),
            'price': product['price'],
            'image_url': product.get('image_url'),
            'predicted_reorder_date': predicted_reorder_date.isoformat(),
            'days_until_stockout': max(0, days_until_stockout),
            'urgency': urgency,
            'recommended_quantity': consumption_pattern['typical_quantity'],
            'confidence_score': consumption_pattern['consistency_score'],
            'average_interval_days': avg_interval,
            'total_past_purchases': len(purchases)
        }
    
    def analyze_consumption_pattern(
        self,
        user_id: str,
        product_id: str
    ) -> Optional[Dict]:
        """
        Detailed consumption pattern analysis for a product
        
        Args:
            user_id: User identifier
            product_id: Product identifier
            
        Returns:
            Consumption analysis details
        """
        purchases = self.inventory_repo.get_user_product_purchases(
            user_id,
            product_id
        )
        
        if not purchases:
            return None
        
        pattern = self._analyze_consumption_pattern(purchases)
        product = self.inventory_repo.get_product_by_id(product_id)
        
        return {
            'product_id': product_id,
            'product_name': product['name'] if product else 'Unknown',
            'total_purchases': len(purchases),
            'first_purchase_date': purchases[-1]['purchase_date'],
            'last_purchase_date': purchases[0]['purchase_date'],
            'average_interval_days': pattern['average_interval_days'],
            'min_interval_days': pattern['min_interval'],
            'max_interval_days': pattern['max_interval'],
            'typical_quantity': pattern['typical_quantity'],
            'consistency_score': pattern['consistency_score'],
            'pattern_type': pattern['pattern_type'],
            'recommended_subscription_interval': pattern['recommended_interval']
        }
    
    def recommend_subscriptions(self, user_id: str) -> List[Dict]:
        """
        Recommend products suitable for subscription
        
        Args:
            user_id: User identifier
            
        Returns:
            List of subscription recommendations
        """
        purchase_history = self.inventory_repo.get_user_purchases(
            user_id,
            limit=200
        )
        
        if not purchase_history:
            return []
        
        product_purchases = self._group_purchases_by_product(purchase_history)
        
        recommendations = []
        
        for product_id, purchases in product_purchases.items():
            if len(purchases) < 3:  # Need consistent pattern
                continue
            
            pattern = self._analyze_consumption_pattern(purchases)
            
            # Only recommend if pattern is consistent
            if pattern['consistency_score'] >= 0.7:
                product = self.inventory_repo.get_product_by_id(product_id)
                
                if product:
                    # Calculate potential savings (e.g., 10% subscription discount)
                    regular_price = product['price'] * pattern['typical_quantity']
                    subscription_price = regular_price * 0.9
                    annual_savings = (regular_price - subscription_price) * (365 / pattern['average_interval_days'])
                    
                    recommendations.append({
                        'product_id': product_id,
                        'product_name': product['name'],
                        'recommended_interval_days': pattern['recommended_interval'],
                        'recommended_quantity': pattern['typical_quantity'],
                        'consistency_score': pattern['consistency_score'],
                        'potential_annual_savings': round(annual_savings, 2),
                        'price_per_delivery': round(subscription_price, 2)
                    })
        
        # Sort by potential savings
        recommendations.sort(
            key=lambda x: x['potential_annual_savings'],
            reverse=True
        )
        
        return recommendations
    
    # ============= Helper Methods =============
    
    def _group_purchases_by_product(
        self,
        purchases: List[Dict]
    ) -> Dict[str, List[Dict]]:
        """Group purchases by product ID"""
        grouped = defaultdict(list)
        for purchase in purchases:
            grouped[purchase['product_id']].append(purchase)
        
        # Sort each group by date (most recent first)
        for product_id in grouped:
            grouped[product_id].sort(
                key=lambda x: x['purchase_date'],
                reverse=True
            )
        
        return dict(grouped)
    
    def _analyze_consumption_pattern(
        self,
        purchases: List[Dict]
    ) -> Dict:
        """Analyze consumption pattern from purchase history"""
        
        if len(purchases) < 2:
            return {
                'average_interval_days': 0,
                'consistency_score': 0,
                'pattern_type': 'insufficient_data',
                'typical_quantity': 1,
                'recommended_interval': 30,
                'min_interval': 0,
                'max_interval': 0
            }
        
        # Calculate intervals between purchases
        dates = [
            datetime.fromisoformat(p['purchase_date']) 
            for p in sorted(purchases, key=lambda x: x['purchase_date'])
        ]
        
        intervals = [
            (dates[i+1] - dates[i]).days 
            for i in range(len(dates) - 1)
        ]
        
        # Calculate statistics
        avg_interval = statistics.mean(intervals)
        
        if len(intervals) > 1:
            std_dev = statistics.stdev(intervals)
            consistency_score = max(0, 1 - (std_dev / avg_interval))
        else:
            consistency_score = 0.5
        
        # Determine pattern type
        if consistency_score >= 0.8:
            pattern_type = 'highly_regular'
        elif consistency_score >= 0.6:
            pattern_type = 'regular'
        elif consistency_score >= 0.4:
            pattern_type = 'somewhat_regular'
        else:
            pattern_type = 'irregular'
        
        # Calculate typical quantity
        quantities = [p.get('quantity', 1) for p in purchases]
        typical_quantity = round(statistics.mean(quantities))
        
        # Recommended subscription interval (slightly shorter than average)
        recommended_interval = max(7, int(avg_interval * 0.9))
        
        return {
            'average_interval_days': round(avg_interval, 1),
            'min_interval': min(intervals),
            'max_interval': max(intervals),
            'consistency_score': round(consistency_score, 2),
            'pattern_type': pattern_type,
            'typical_quantity': typical_quantity,
            'recommended_interval': recommended_interval
        }
