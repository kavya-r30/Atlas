# models/bundle.py
"""Data models for product bundles"""

from dataclasses import dataclass
from typing import List, Optional
from models.intent import UserIntent


@dataclass
class BundleProduct:
    """Individual product within a bundle"""
    id: str
    name: str
    price: float
    category: str
    explanation: str
    image_url: Optional[str] = None
    stock_quantity: Optional[int] = None


@dataclass
class ProductBundle:
    """Complete product bundle with metadata"""
    bundle_name: str
    products: List[BundleProduct]
    total_price: float
    savings: float
    intent: UserIntent
    bundle_id: Optional[str] = None
