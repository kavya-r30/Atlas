# replenishment_services/langchain_agent.py
"""
LangChain-powered replenishment agent
Uses LangChain for intelligent recommendation generation with reasoning
"""

from langchain.prompts import PromptTemplate, ChatPromptTemplate
from langchain.chains import LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.agents import Tool, AgentExecutor, create_react_agent
from langchain.memory import ConversationBufferMemory
from langchain.schema import SystemMessage, HumanMessage
from typing import Dict, List, Optional
import os
import json
from datetime import datetime, timedelta


class ReplenishmentLangChainAgent:
    """LangChain agent for intelligent replenishment recommendations"""
    
    def __init__(self, inventory_repository):
        """
        Initialize LangChain agent with tools and chains
        
        Args:
            inventory_repository: Repository for database operations
        """
        self.inventory_repo = inventory_repository
        
        # Initialize OpenAI LLM
        self.llm = ChatOpenAI(
            model="gpt-4",
            temperature=0.3,
            openai_api_key=os.getenv('OPENAI_API_KEY')
        )
        
        # Setup chains and tools
        self._setup_chains()
        self._setup_tools()
    
    def _setup_chains(self):
        """Setup LangChain chains for different tasks"""
        
        # Chain for consumption pattern analysis
        consumption_prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content="""You are an expert at analyzing product consumption patterns.
            Given purchase history data, identify consumption rates, patterns, and predict when 
            the user will run out of products."""),
            HumanMessage(content="{purchase_history}")
        ])
        
        self.consumption_chain = LLMChain(
            llm=self.llm,
            prompt=consumption_prompt,
            output_key="consumption_analysis"
        )
        
        # Chain for personalized recommendations
        recommendation_prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content="""You are a helpful shopping assistant specializing in 
            replenishment recommendations. Analyze user purchase patterns and suggest products 
            they should reorder, along with reasoning. Be specific and considerate of their 
            usage patterns."""),
            HumanMessage(content="""
User Purchase History:
{purchase_history}

Current Context: {user_context}

Product Catalog:
{available_products}

Generate personalized replenishment recommendations with:
1. Product name and ID
2. Recommended quantity
3. Reasoning based on their consumption pattern
4. Urgency level (low/medium/high)
5. Estimated days until stockout

Return as JSON array.""")
        ])
        
        self.recommendation_chain = LLMChain(
            llm=self.llm,
            prompt=recommendation_prompt,
            output_key="recommendations"
        )
        
        # Chain for subscription optimization
        subscription_prompt = PromptTemplate(
            input_variables=["purchase_history", "product_info"],
            template="""Analyze this purchase history and determine optimal subscription intervals:

Purchase History:
{purchase_history}

Product Information:
{product_info}

For each product that shows regular purchase pattern:
1. Calculate optimal reorder interval (in days)
2. Recommend subscription quantity
3. Identify cost savings opportunity
4. Assess pattern consistency (0-1 score)

Return as JSON array with format:
[
    {{
        "product_id": "...",
        "product_name": "...",
        "recommended_interval_days": X,
        "recommended_quantity": Y,
        "consistency_score": 0.X,
        "potential_savings": "$X.XX",
        "reasoning": "..."
    }}
]"""
        )
        
        self.subscription_chain = LLMChain(
            llm=self.llm,
            prompt=subscription_prompt
        )
    
    def _setup_tools(self):
        """Setup LangChain tools for agent"""
        
        self.tools = [
            Tool(
                name="GetUserPurchaseHistory",
                func=self._get_user_purchases_tool,
                description="Retrieves user's purchase history. Input: user_id"
            ),
            Tool(
                name="GetProductDetails",
                func=self._get_product_details_tool,
                description="Gets product details including size, category. Input: product_id"
            ),
            Tool(
                name="CalculateConsumptionRate",
                func=self._calculate_consumption_rate_tool,
                description="Calculates how fast user consumes a product. Input: user_id,product_id"
            ),
            Tool(
                name="GetSimilarProducts",
                func=self._get_similar_products_tool,
                description="Finds similar products user might like. Input: product_id"
            )
        ]
    
    def generate_smart_recommendations(
        self, 
        user_id: str, 
        user_context: str = ""
    ) -> Dict:
        """
        Generate intelligent replenishment recommendations using LangChain
        
        Args:
            user_id: User identifier
            user_context: Optional context from user (natural language)
            
        Returns:
            Dictionary with recommendations and reasoning
        """
        # Step 1: Gather user data
        purchase_history = self.inventory_repo.get_user_purchases(user_id, limit=50)
        
        if not purchase_history:
            return {
                'recommendations': [],
                'reasoning': 'No purchase history found for this user'
            }
        
        # Step 2: Get available products
        available_products = self.inventory_repo.get_available_products(limit=100)
        
        # Step 3: Format data for LLM
        history_text = self._format_purchase_history(purchase_history)
        products_text = self._format_product_catalog(available_products)
        
        # Step 4: Generate recommendations using chain
        try:
            result = self.recommendation_chain.run(
                purchase_history=history_text,
                user_context=user_context or "Regular replenishment check",
                available_products=products_text
            )
            
            # Parse JSON response
            recommendations = self._parse_llm_json_response(result)
            
            # Enhance with database data
            enhanced_recommendations = self._enhance_recommendations(
                recommendations, 
                user_id
            )
            
            return {
                'recommendations': enhanced_recommendations,
                'reasoning': 'Recommendations based on purchase history analysis and consumption patterns'
            }
            
        except Exception as e:
            print(f"Error generating recommendations: {e}")
            return {
                'recommendations': self._get_fallback_recommendations(user_id),
                'reasoning': 'Using pattern-based recommendations'
            }
    
    def analyze_subscription_opportunities(self, user_id: str) -> List[Dict]:
        """
        Identify products suitable for subscription using LangChain
        
        Args:
            user_id: User identifier
            
        Returns:
            List of subscription recommendations
        """
        purchase_history = self.inventory_repo.get_user_purchases(user_id, limit=100)
        
        if not purchase_history:
            return []
        
        # Group purchases by product
        product_purchases = self._group_by_product(purchase_history)
        
        # Analyze each product for subscription suitability
        subscription_recommendations = []
        
        for product_id, purchases in product_purchases.items():
            if len(purchases) < 2:  # Need at least 2 purchases to identify pattern
                continue
            
            # Get product info
            product_info = self.inventory_repo.get_product_by_id(product_id)
            
            # Use LangChain to analyze
            history_text = json.dumps(purchases, indent=2)
            product_text = json.dumps(product_info, indent=2)
            
            try:
                result = self.subscription_chain.run(
                    purchase_history=history_text,
                    product_info=product_text
                )
                
                subscriptions = self._parse_llm_json_response(result)
                subscription_recommendations.extend(subscriptions)
                
            except Exception as e:
                print(f"Error analyzing subscription for {product_id}: {e}")
                continue
        
        return subscription_recommendations
    
    def generate_replenishment_message(
        self,
        user_name: str,
        products: List[Dict]
    ) -> str:
        """
        Generate personalized replenishment message using LangChain
        
        Args:
            user_name: User's name
            products: List of products needing replenishment
            
        Returns:
            Personalized message string
        """
        message_prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content="""You are a friendly shopping assistant. Create a 
            personalized, warm message reminding the user about products they might need to 
            reorder. Be conversational and helpful, not pushy."""),
            HumanMessage(content="""Create a replenishment reminder message for {user_name}.

Products needing reorder:
{products}

Message should:
- Be friendly and personal
- Mention specific products
- Highlight urgency if applicable
- Include helpful tips
- Keep it under 100 words

Return only the message text.""")
        ])
        
        message_chain = LLMChain(llm=self.llm, prompt=message_prompt)
        
        products_text = "\n".join([
            f"- {p['name']}: {p.get('days_until_stockout', 'Unknown')} days until running out"
            for p in products
        ])
        
        try:
            message = message_chain.run(
                user_name=user_name,
                products=products_text
            )
            return message.strip()
        except:
            return f"Hi {user_name}! Time to restock your essentials."
    
    # ============= Tool Functions =============
    
    def _get_user_purchases_tool(self, user_id: str) -> str:
        """Tool: Get user purchase history"""
        purchases = self.inventory_repo.get_user_purchases(user_id, limit=20)
        return json.dumps(purchases, indent=2)
    
    def _get_product_details_tool(self, product_id: str) -> str:
        """Tool: Get product details"""
        product = self.inventory_repo.get_product_by_id(product_id)
        return json.dumps(product, indent=2)
    
    def _calculate_consumption_rate_tool(self, input_str: str) -> str:
        """Tool: Calculate consumption rate"""
        try:
            user_id, product_id = input_str.split(',')
            rate = self._calculate_consumption_rate(user_id.strip(), product_id.strip())
            return json.dumps(rate)
        except:
            return "Error: Invalid input format. Use: user_id,product_id"
    
    def _get_similar_products_tool(self, product_id: str) -> str:
        """Tool: Get similar products"""
        similar = self.inventory_repo.get_similar_products(product_id, limit=5)
        return json.dumps(similar, indent=2)
    
    # ============= Helper Methods =============
    
    def _format_purchase_history(self, purchases: List[Dict]) -> str:
        """Format purchase history for LLM"""
        formatted = []
        for purchase in purchases:
            formatted.append(
                f"- {purchase['product_name']} (Qty: {purchase['quantity']}) "
                f"on {purchase['purchase_date']}"
            )
        return "\n".join(formatted)
    
    def _format_product_catalog(self, products: List[Dict]) -> str:
        """Format product catalog for LLM"""
        formatted = []
        for product in products[:20]:  # Limit to avoid token limits
            formatted.append(
                f"- {product['name']} (ID: {product['id']}, "
                f"Category: {product.get('category', 'N/A')}, "
                f"Price: ${product['price']})"
            )
        return "\n".join(formatted)
    
    def _parse_llm_json_response(self, response: str) -> List[Dict]:
        """Parse JSON from LLM response"""
        try:
            # Remove markdown code blocks if present
            if '```json' in response:
                response = response.split('```json').split('```')[1]
            elif '```' in response:
                response = response.split('```')[11].split('```')[0]
            
            return json.loads(response.strip())
        except:
            return []
    
    def _enhance_recommendations(
        self,
        recommendations: List[Dict],
        user_id: str
    ) -> List[Dict]:
        """Enhance LLM recommendations with real database data"""
        enhanced = []
        
        for rec in recommendations:
            product_id = rec.get('product_id')
            if product_id:
                product = self.inventory_repo.get_product_by_id(product_id)
                if product:
                    rec.update({
                        'price': product.get('price'),
                        'image_url': product.get('image_url'),
                        'in_stock': product.get('stock_quantity', 0) > 0
                    })
            enhanced.append(rec)
        
        return enhanced
    
    def _get_fallback_recommendations(self, user_id: str) -> List[Dict]:
        """Fallback recommendations if LLM fails"""
        purchases = self.inventory_repo.get_user_purchases(user_id, limit=10)
        
        # Simple logic: recommend most frequently purchased items
        product_counts = {}
        for purchase in purchases:
            pid = purchase['product_id']
            product_counts[pid] = product_counts.get(pid, 0) + 1
        
        # Get top 3
        top_products = sorted(
            product_counts.items(),
            key=lambda x: x[1],
            reverse=True
        )[:3]
        
        recommendations = []
        for product_id, count in top_products:
            product = self.inventory_repo.get_product_by_id(product_id)
            if product:
                recommendations.append({
                    'product_id': product_id,
                    'product_name': product['name'],
                    'recommended_quantity': 1,
                    'reasoning': f'You\'ve purchased this {count} times',
                    'urgency': 'medium'
                })
        
        return recommendations
    
    def _calculate_consumption_rate(
        self,
        user_id: str,
        product_id: str
    ) -> Dict:
        """Calculate consumption rate for a product"""
        purchases = self.inventory_repo.get_user_product_purchases(
            user_id,
            product_id
        )
        
        if len(purchases) < 2:
            return {'rate': 'insufficient_data'}
        
        # Calculate average days between purchases
        dates = [datetime.fromisoformat(p['purchase_date']) for p in purchases]
        dates.sort()
        
        intervals = [
            (dates[i+1] - dates[i]).days 
            for i in range(len(dates)-1)
        ]
        
        avg_interval = sum(intervals) / len(intervals)
        
        return {
            'average_days_between_purchases': round(avg_interval, 1),
            'total_purchases': len(purchases),
            'consumption_rate': 'regular' if avg_interval < 45 else 'occasional'
        }
    
    def _group_by_product(self, purchases: List[Dict]) -> Dict[str, List[Dict]]:
        """Group purchases by product ID"""
        grouped = {}
        for purchase in purchases:
            pid = purchase['product_id']
            if pid not in grouped:
                grouped[pid] = []
            grouped[pid].append(purchase)
        return grouped
