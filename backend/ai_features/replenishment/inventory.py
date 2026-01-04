# replenishment_services/inventory_service.py
"""
Inventory service - handles inventory-related operations
"""

from typing import List, Dict, Optional
from datetime import datetime


class InventoryService:
    """Service for inventory and reminder operations"""
    
    def __init__(self, inventory_repository):
        """
        Initialize inventory service
        
        Args:
            inventory_repository: Repository for database operations
        """
        self.inventory_repo = inventory_repository
    
    def get_purchase_history(
        self,
        user_id: str,
        limit: int = 50
    ) -> List[Dict]:
        """
        Get user's purchase history
        
        Args:
            user_id: User identifier
            limit: Maximum number of records
            
        Returns:
            List of purchase records
        """
        return self.inventory_repo.get_user_purchases(user_id, limit)
    
    def create_reminder(
        self,
        user_id: str,
        product_id: str,
        reminder_date: str,
        reminder_type: str = 'email'
    ) -> Dict:
        """
        Create replenishment reminder
        
        Args:
            user_id: User identifier
            product_id: Product identifier
            reminder_date: Date for reminder (ISO format)
            reminder_type: Type of reminder (email/push/sms)
            
        Returns:
            Created reminder details
        """
        reminder_data = {
            'user_id': user_id,
            'product_id': product_id,
            'reminder_date': reminder_date,
            'reminder_type': reminder_type,
            'status': 'pending',
            'created_at': datetime.utcnow().isoformat()
        }
        
        reminder_id = self.inventory_repo.save_reminder(reminder_data)
        reminder_data['id'] = reminder_id
        
        return reminder_data
    
    def get_pending_reminders(
        self,
        user_id: Optional[str] = None
    ) -> List[Dict]:
        """
        Get pending reminders
        
        Args:
            user_id: Optional user filter
            
        Returns:
            List of pending reminders
        """
        return self.inventory_repo.get_reminders(user_id, status='pending')
