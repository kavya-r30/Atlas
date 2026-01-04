# outfit_services/agno_stylist.py
"""
Agno-powered personal stylist agent
Provides intelligent outfit recommendations using Agno framework
"""

from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.models.google import Gemini
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.memory import AgentMemory
from agno.storage import AgentStorage
from typing import Dict, List, Optional
import os
import json


class AgnoStylistAgent:
    """Agno agent for intelligent outfit styling recommendations"""
    
    def __init__(self, wardrobe_repository):
        """
        Initialize Agno stylist agent
        
        Args:
            wardrobe_repository: Repository for database operations
        """
        self.wardrobe_repo = wardrobe_repository
        
        # Initialize Agno Agent with custom tools
        self.agent = Agent(
            model=OpenAIChat(id="gpt-4o"),
            description="""You are an expert personal fashion stylist with years of experience.
            You help users create stylish, coordinated outfits based on their wardrobe items,
            occasion, weather, and personal style. You understand color theory, fashion trends,
            body types, and outfit compatibility. You provide specific, actionable recommendations
            with clear reasoning.""",
            tools=[
                self._create_wardrobe_lookup_tool(),
                self._create_color_matching_tool(),
                self._create_style_compatibility_tool(),
                self._create_product_search_tool()
            ],
            memory=AgentMemory(),
            markdown=True,
            show_tool_calls=True
        )
        
        # Initialize specialized agents for specific tasks
        self._setup_specialized_agents()
    
    def _setup_specialized_agents(self):
        """Setup specialized Agno agents for different styling tasks"""
        
        # Outfit completion agent
        self.outfit_completion_agent = Agent(
            model=OpenAIChat(id="gpt-4o"),
            description="""You specialize in completing outfits. Given an anchor item
            (like jeans or a dress), you suggest complementary pieces that create a
            cohesive, stylish look. You consider color coordination, style balance,
            and occasion appropriateness.""",
            tools=[self._create_wardrobe_lookup_tool()],
            markdown=True
        )
        
        # Wardrobe compatibility agent
        self.compatibility_agent = Agent(
            model=Gemini(id="gemini-2.0-flash-exp"),
            description="""You analyze how well new items match with existing wardrobe pieces.
            You evaluate color harmony, style consistency, versatility, and gap-filling potential.
            You provide compatibility scores and specific pairing suggestions.""",
            markdown=True
        )
        
        # Occasion styling agent
        self.occasion_agent = Agent(
            model=OpenAIChat(id="gpt-4o"),
            description="""You create complete outfits for specific occasions like weddings,
            interviews, dates, or casual outings. You understand dress codes, formality levels,
            and seasonal appropriateness.""",
            tools=[self._create_wardrobe_lookup_tool()],
            markdown=True
        )
    
    # ============= Custom Tools for Agno Agent =============
    
    def _create_wardrobe_lookup_tool(self):
        """Create tool for looking up user's wardrobe items"""
        def lookup_wardrobe(user_id: str, category: str = None) -> str:
            """
            Look up user's wardrobe items by category
            
            Args:
                user_id: User identifier
                category: Optional category filter (tops, bottoms, shoes, accessories)
            
            Returns:
                JSON string of wardrobe items
            """
            items = self.wardrobe_repo.get_user_wardrobe(user_id, category)
            
            formatted_items = []
            for item in items:
                formatted_items.append({
                    'id': item['id'],
                    'name': item['name'],
                    'category': item['category'],
                    'color': item.get('primary_color', 'unknown'),
                    'style': item.get('style_tags', []),
                    'season': item.get('season', [])
                })
            
            return json.dumps(formatted_items, indent=2)
        
        return lookup_wardrobe
    
    def _create_color_matching_tool(self):
        """Create tool for color coordination suggestions"""
        def get_color_matches(base_color: str) -> str:
            """
            Get colors that pair well with base color
            
            Args:
                base_color: The base color to match
            
            Returns:
                JSON string of matching colors with reasoning
            """
            color_pairings = {
                'blue': {
                    'complementary': ['orange', 'coral', 'rust'],
                    'analogous': ['navy', 'teal', 'cyan'],
                    'neutral': ['white', 'beige', 'gray', 'black'],
                    'monochromatic': ['light blue', 'dark blue']
                },
                'black': {
                    'pairs_well': ['white', 'red', 'gold', 'silver', 'pink', 'any color'],
                    'reason': 'Black is neutral and pairs with everything'
                },
                'red': {
                    'complementary': ['green', 'teal'],
                    'analogous': ['orange', 'pink', 'burgundy'],
                    'neutral': ['black', 'white', 'gray', 'navy'],
                    'caution': 'Avoid with bright purple or orange unless intentional'
                },
                'white': {
                    'pairs_well': ['any color'],
                    'best_with': ['navy', 'black', 'pastels', 'bright colors'],
                    'reason': 'White is neutral and provides clean canvas'
                },
                'beige': {
                    'pairs_well': ['navy', 'brown', 'olive', 'burgundy', 'black'],
                    'style': 'Creates sophisticated, neutral looks'
                },
                'navy': {
                    'pairs_well': ['white', 'beige', 'tan', 'burgundy', 'pink'],
                    'avoid': ['black (too similar)', 'brown (can clash)']
                }
            }
            
            base_color_lower = base_color.lower()
            matches = color_pairings.get(base_color_lower, {
                'suggestion': 'Use neutral colors like white, black, or gray',
                'note': f'No specific pairings available for {base_color}'
            })
            
            return json.dumps(matches, indent=2)
        
        return get_color_matches
    
    def _create_style_compatibility_tool(self):
        """Create tool for checking style compatibility"""
        def check_style_compatibility(style1: str, style2: str) -> str:
            """
            Check if two styles work well together
            
            Args:
                style1: First style (e.g., 'casual', 'formal', 'sporty')
                style2: Second style
            
            Returns:
                Compatibility assessment
            """
            compatibility_matrix = {
                'casual': {
                    'casual': 'Perfect match',
                    'sporty': 'Good mix',
                    'formal': 'Difficult - consider smart casual bridge pieces',
                    'bohemian': 'Works well',
                    'streetwear': 'Great combination'
                },
                'formal': {
                    'formal': 'Perfect match',
                    'business': 'Excellent combination',
                    'casual': 'Needs smart casual intermediary',
                    'sporty': 'Generally incompatible'
                },
                'sporty': {
                    'sporty': 'Perfect match',
                    'casual': 'Athleisure works great',
                    'streetwear': 'Very trendy combination',
                    'formal': 'Incompatible'
                },
                'streetwear': {
                    'streetwear': 'Perfect match',
                    'casual': 'Works well',
                    'sporty': 'Great urban look',
                    'formal': 'Intentional contrast can work'
                }
            }
            
            style1_lower = style1.lower()
            style2_lower = style2.lower()
            
            if style1_lower in compatibility_matrix:
                result = compatibility_matrix[style1_lower].get(
                    style2_lower,
                    'Compatibility unknown - use discretion'
                )
            else:
                result = 'Styles not in database - consider general fashion principles'
            
            return json.dumps({
                'style_1': style1,
                'style_2': style2,
                'compatibility': result
            }, indent=2)
        
        return check_style_compatibility
    
    def _create_product_search_tool(self):
        """Create tool for searching available products"""
        def search_products(category: str, style: str = None, color: str = None) -> str:
            """
            Search available products to purchase
            
            Args:
                category: Product category
                style: Optional style filter
                color: Optional color filter
            
            Returns:
                JSON string of available products
            """
            products = self.wardrobe_repo.search_available_products(
                category=category,
                style=style,
                color=color,
                limit=10
            )
            
            return json.dumps(products, indent=2)
        
        return search_products
    
    # ============= Main Styling Functions =============
    
    def complete_outfit_from_anchor(
        self,
        user_id: str,
        anchor_item_id: str,
        occasion: str = 'casual',
        weather: str = None
    ) -> List[Dict]:
        """
        Complete an outfit based on an anchor item (e.g., jeans)
        
        Args:
            user_id: User identifier
            anchor_item_id: The item to build around
            occasion: Occasion type
            weather: Weather conditions
        
        Returns:
            List of complete outfit suggestions
        """
        # Get anchor item details
        anchor_item = self.wardrobe_repo.get_wardrobe_item(anchor_item_id)
        
        if not anchor_item:
            return []
        
        # Get user's wardrobe
        wardrobe_items = self.wardrobe_repo.get_user_wardrobe(user_id)
        
        # Create prompt for outfit completion agent
        prompt = f"""I have a {anchor_item['name']} ({anchor_item.get('color', 'color unknown')}).
        
Anchor Item Details:
- Name: {anchor_item['name']}
- Category: {anchor_item.get('category')}
- Color: {anchor_item.get('primary_color', 'unknown')}
- Style: {anchor_item.get('style_tags', [])}

Occasion: {occasion}
Weather: {weather or 'not specified'}

My Wardrobe:
{json.dumps(wardrobe_items, indent=2)}

Create 3 complete outfit combinations using this item. For each outfit:
1. List all items (including the anchor item)
2. Explain why items work together
3. Provide styling tips
4. Suggest any missing pieces I should consider buying

Return response as JSON array:
[
  {{
    "outfit_name": "Casual Weekend Look",
    "items": [
      {{
        "id": "item_id",
        "name": "item name",
        "role": "anchor|complementary|accent"
      }}
    ],
    "reasoning": "Why these items work together",
    "styling_tips": "How to wear this outfit",
    "missing_pieces": ["Items to consider purchasing"]
  }}
]"""
        
        # Get response from Agno agent
        response = self.outfit_completion_agent.run(prompt)
        
        # Parse and return outfits
        try:
            outfits = self._extract_json_from_response(response.content)
            return outfits
        except:
            # Fallback to rule-based suggestions
            return self._fallback_outfit_completion(anchor_item, wardrobe_items, occasion)
    
    def generate_outfit_suggestions(
        self,
        user_id: str,
        user_request: str
    ) -> Dict:
        """
        Generate outfit suggestions based on natural language request
        
        Args:
            user_id: User identifier
            user_request: Natural language request
        
        Returns:
            Dictionary with outfit suggestions and advice
        """
        # Get user's wardrobe
        wardrobe_items = self.wardrobe_repo.get_user_wardrobe(user_id)
        
        # Enhanced prompt with wardrobe context
        full_prompt = f"""User Request: {user_request}

User's Wardrobe Items:
{json.dumps(wardrobe_items, indent=2)}

Based on their wardrobe and request, provide:
1. Complete outfit recommendations using their existing items
2. Styling tips and advice
3. Items they should consider purchasing to fill gaps
4. Color and accessory suggestions

Format response as JSON:
{{
  "outfits": [
    {{
      "name": "outfit name",
      "items": [
        {{"id": "item_id", "name": "item name", "from_wardrobe": true}}
      ],
      "why_it_works": "explanation",
      "styling_tips": "specific tips"
    }}
  ],
  "purchase_suggestions": [
    {{"category": "tops", "description": "white button-down shirt", "reason": "versatile piece"}}
  ],
  "general_advice": "overall styling advice"
}}"""
        
        # Get response from main Agno agent
        response = self.agent.run(full_prompt)
        
        try:
            result = self._extract_json_from_response(response.content)
            return result
        except:
            return {
                'outfits': [],
                'general_advice': response.content,
                'purchase_suggestions': []
            }
    
    def analyze_wardrobe_match(
        self,
        user_id: str,
        new_item_id: str
    ) -> Dict:
        """
        Analyze how well a new item matches user's wardrobe
        
        Args:
            user_id: User identifier
            new_item_id: Item being considered for purchase
        
        Returns:
            Compatibility analysis
        """
        # Get new item details
        new_item = self.wardrobe_repo.get_product_by_id(new_item_id)
        
        # Get user's wardrobe
        wardrobe = self.wardrobe_repo.get_user_wardrobe(user_id)
        
        prompt = f"""Analyze this item for wardrobe compatibility:

New Item:
{json.dumps(new_item, indent=2)}

Existing Wardrobe:
{json.dumps(wardrobe, indent=2)}

Provide compatibility analysis as JSON:
{{
  "overall_score": 85,
  "matches_well_with": [
    {{"item_id": "id", "item_name": "name", "why": "explanation"}}
  ],
  "versatility_score": 90,
  "fills_gap": true,
  "gap_description": "You don't have a neutral blazer",
  "color_harmony": "Excellent - complements your blue and gray items",
  "style_fit": "Perfect for your business casual style",
  "recommendation": "Strong buy|Consider|Pass",
  "reasoning": "Overall assessment"
}}"""
        
        response = self.compatibility_agent.run(prompt)
        
        try:
            return self._extract_json_from_response(response.content)
        except:
            return {
                'overall_score': 70,
                'recommendation': 'Consider',
                'reasoning': response.content
            }
    
    def build_occasion_outfits(
        self,
        user_id: str,
        occasion: str
    ) -> List[Dict]:
        """
        Build complete outfits for specific occasion
        
        Args:
            user_id: User identifier
            occasion: Occasion type
        
        Returns:
            List of occasion-appropriate outfits
        """
        wardrobe = self.wardrobe_repo.get_user_wardrobe(user_id)
        
        prompt = f"""Create complete outfits for: {occasion}

Available Wardrobe:
{json.dumps(wardrobe, indent=2)}

Provide 2-3 outfit options as JSON:
[
  {{
    "outfit_name": "Professional Interview Look",
    "items": [{{"id": "id", "name": "name", "category": "category"}}],
    "appropriateness_score": 95,
    "tips": "Specific tips for this occasion",
    "dos": ["What to do"],
    "donts": ["What to avoid"]
  }}
]"""
        
        response = self.occasion_agent.run(prompt)
        
        try:
            return self._extract_json_from_response(response.content)
        except:
            return []
    
    # ============= Helper Methods =============
    
    def _extract_json_from_response(self, response_text: str):
        """Extract JSON from agent response"""
        # Remove markdown code blocks
        if '```json' in response_text:
            response_text = response_text.split('```json').split('```')[1]
        elif '```' in response_text:
            response_text = response_text.split('```')[11].split('```')[0]
        
        return json.loads(response_text.strip())
    
    def _fallback_outfit_completion(
        self,
        anchor_item: Dict,
        wardrobe: List[Dict],
        occasion: str
    ) -> List[Dict]:
        """Fallback rule-based outfit completion"""
        
        anchor_category = anchor_item.get('category', '').lower()
        
        # Simple rule-based matching
        complementary_categories = {
            'bottoms': ['tops', 'shoes', 'accessories'],
            'jeans': ['tops', 'shoes', 'jacket'],
            'dress': ['shoes', 'accessories', 'jacket'],
            'tops': ['bottoms', 'shoes'],
            'shoes': ['bottoms', 'tops']
        }
        
        needed_categories = complementary_categories.get(anchor_category, ['tops', 'bottoms'])
        
        outfit_items = [anchor_item]
        
        for category in needed_categories:
            matching_items = [
                item for item in wardrobe 
                if category in item.get('category', '').lower()
            ]
            if matching_items:
                outfit_items.append(matching_items[0])
        
        return [{
            'outfit_name': f'{occasion.title()} Look',
            'items': outfit_items,
            'reasoning': 'Basic color and category coordination',
            'styling_tips': f'Perfect for {occasion} occasions'
        }]
