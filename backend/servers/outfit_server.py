# outfit_builder_server.py
"""
Flask API Server for Smart Outfit Builder
Handles HTTP requests for outfit recommendations and styling suggestions
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from datetime import datetime

# Import business logic services with Agno
from outfit_services.styling_service import OutfitStylingService
from outfit_services.agno_stylist import AgnoStylistAgent
from outfit_services.wardrobe_service import WardrobeService
from outfit_services.compatibility_service import CompatibilityService
from database.supabase_repository import SupabaseWardrobeRepository

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize repositories and services
wardrobe_repo = SupabaseWardrobeRepository()
wardrobe_service = WardrobeService(wardrobe_repo)
styling_service = OutfitStylingService(wardrobe_repo)
compatibility_service = CompatibilityService(wardrobe_repo)
agno_stylist = AgnoStylistAgent(wardrobe_repo)


# ============= Outfit Builder API Endpoints =============

@app.route('/api/outfits/complete-look', methods=['POST'])
def complete_the_look():
    """
    POST /api/outfits/complete-look
    Body: {
        "user_id": "uuid",
        "anchor_item_id": "uuid",
        "occasion": "casual|formal|party|business" (optional),
        "weather": "hot|cold|mild" (optional)
    }
    Returns: Complete outfit suggestions based on anchor item
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid request body'}), 400
        
        user_id = data.get('user_id')
        anchor_item_id = data.get('anchor_item_id')
        occasion = data.get('occasion', 'casual')
        weather = data.get('weather')
        
        if not user_id or not anchor_item_id:
            return jsonify({
                'error': 'user_id and anchor_item_id are required'
            }), 400
        
        # Get outfit recommendations using Agno
        outfits = agno_stylist.complete_outfit_from_anchor(
            user_id=user_id,
            anchor_item_id=anchor_item_id,
            occasion=occasion,
            weather=weather
        )
        
        return jsonify({
            'success': True,
            'anchor_item_id': anchor_item_id,
            'occasion': occasion,
            'outfits': outfits,
            'total_suggestions': len(outfits)
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error completing outfit: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to generate outfit suggestions'
        }), 500


@app.route('/api/outfits/ai-stylist', methods=['POST'])
def ai_stylist_recommendations():
    """
    POST /api/outfits/ai-stylist
    Body: {
        "user_id": "uuid",
        "request": "I need something to wear with my blue jeans for a casual dinner"
    }
    Returns: AI-powered outfit suggestions using Agno
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid request body'}), 400
        
        user_id = data.get('user_id')
        user_request = data.get('request', '')
        
        if not user_id or not user_request:
            return jsonify({
                'error': 'user_id and request are required'
            }), 400
        
        # Get AI-powered recommendations using Agno
        recommendations = agno_stylist.generate_outfit_suggestions(
            user_id=user_id,
            user_request=user_request
        )
        
        return jsonify({
            'success': True,
            'recommendations': recommendations
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error in AI stylist: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to generate AI recommendations'
        }), 500


@app.route('/api/outfits/wardrobe-match', methods=['POST'])
def match_with_wardrobe():
    """Match new item with existing wardrobe"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        new_item_id = data.get('new_item_id')
        
        if not user_id or not new_item_id:
            return jsonify({
                'error': 'user_id and new_item_id are required'
            }), 400
        
        compatibility = agno_stylist.analyze_wardrobe_match(
            user_id=user_id,
            new_item_id=new_item_id
        )
        
        return jsonify({
            'success': True,
            'compatibility': compatibility
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error analyzing compatibility: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to analyze compatibility'
        }), 500


@app.route('/api/outfits/occasion-builder', methods=['POST'])
def build_occasion_outfit():
    """Build outfits for specific occasions"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        occasion = data.get('occasion')
        
        if not user_id or not occasion:
            return jsonify({
                'error': 'user_id and occasion are required'
            }), 400
        
        outfits = agno_stylist.build_occasion_outfits(
            user_id=user_id,
            occasion=occasion
        )
        
        return jsonify({
            'success': True,
            'outfits': outfits
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error building occasion outfit: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to build occasion outfit'
        }), 500


@app.route('/api/wardrobe/items/<user_id>', methods=['GET'])
def get_wardrobe_items(user_id):
    """Get user's wardrobe items"""
    try:
        category = request.args.get('category')
        limit = request.args.get('limit', default=50, type=int)
        
        items = wardrobe_service.get_user_wardrobe(
            user_id=user_id,
            category=category,
            limit=limit
        )
        
        return jsonify({
            'success': True,
            'wardrobe_items': items,
            'total_items': len(items)
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error fetching wardrobe: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch wardrobe items'
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Outfit Builder API (Agno)',
        'supabase_connected': os.getenv('SUPABASE_URL') is not None,
        'openai_configured': os.getenv('OPENAI_API_KEY') is not None
    }), 200


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5002))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    app.run(host='0.0.0.0', port=port, debug=debug)
