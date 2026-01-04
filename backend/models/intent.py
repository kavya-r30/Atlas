# models/intent.py
"""Data models for user intent"""

from dataclasses import dataclass
from typing import List


@dataclass
class UserIntent:
    """Structured representation of user's search intent"""
    primary_activity: str
    experience_level: str
    emotional_context: str
    budget_level: str
    related_categories: List[str]
