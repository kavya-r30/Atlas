# services/intent_service.py
"""
Intent parsing service - extracts structured intent from natural language
Uses Gemini API for NLP processing
"""

import google.generativeai as genai
import json
import os
from typing import Optional
from models.intent import UserIntent


class IntentParserService:
    """Service for parsing user queries into structured intents"""
    
    def __init__(self):
        """Initialize Gemini API"""
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
    
    def parse_user_query(self, user_query: str) -> UserIntent:
        """
        Extract structured intent from natural language query
        
        Args:
            user_query: Natural language query from user
            
        Returns:
            UserIntent object with extracted information
        """
        if not user_query or len(user_query.strip()) == 0:
            raise ValueError("Query cannot be empty")
        
        prompt = self._build_intent_extraction_prompt(user_query)
        
        try:
            response = self.model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.2,
                    "max_output_tokens": 1024,
                }
            )
            
            intent_data = self._parse_gemini_response(response.text)
            return UserIntent(**intent_data)
            
        except Exception as e:
            print(f"Error parsing intent with Gemini: {e}")
            return self._get_fallback_intent(user_query)
    
    def _build_intent_extraction_prompt(self, user_query: str) -> str:
        """Build the prompt for Gemini API"""
        return f"""You are an expert at understanding customer product needs. Extract the following information from the user's query:

User Query: "{user_query}"

Extract and return a JSON object with these exact fields:
{{
  "primary_activity": "the main goal or activity (e.g., running for beginners, weight training, yoga)",
  "experience_level": "beginner, intermediate, or advanced",
  "emotional_context": "emotional state like self-conscious, confident, motivated, cautious, excited",
  "budget_level": "low, medium, or high (infer from language like 'affordable', 'premium', 'budget')",
  "related_categories": ["list of product categories needed like shoes, clothing, accessories, equipment"]
}}

If any field cannot be determined, use sensible defaults:
- experience_level: "beginner"
- emotional_context: "motivated"
- budget_level: "medium"

Return ONLY the JSON object, no additional text."""
    
    def _parse_gemini_response(self, response_text: str) -> dict:
        """Parse JSON from Gemini response, handling code blocks"""
        response_text = response_text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith('```'):
            parts = response_text.split('```')
            if len(parts) >= 2:
                response_text = parts[1]
                if response_text.startswith('json'):
                    response_text = response_text[4:]
        
        response_text = response_text.strip()
        
        try:
            return json.loads(response_text)
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON: {e}")
            raise
    
    def _get_fallback_intent(self, user_query: str) -> UserIntent:
        """Return default intent when parsing fails"""
        return UserIntent(
            primary_activity=user_query[:50],
            experience_level="beginner",
            emotional_context="motivated",
            budget_level="medium",
            related_categories=["general"]
        )
