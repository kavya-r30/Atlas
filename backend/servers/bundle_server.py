# server.py
"""
Flask server - handles HTTP requests/responses, routing, and API endpoints
Responsibilities: request parsing, response formatting, status codes, CORS
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Import business logic services
from services.intent_service import IntentParserService
from services.bundle_service import BundleGeneratorService
from services.product_service import ProductService
from database.supabase_repository import SupabaseProductRepository

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize repositories and services
product_repository = SupabaseProductRepository()
product_service = ProductService(product_repository)
intent_service = IntentParserService()
bundle_service = BundleGeneratorService(product_repository)


# ============= API Endpoints =============

@app.route('/api/bundle/search', methods=['POST'])
def search_and_generate_bundle():
    """
    POST /api/bundle/search
    Body: { "query": "natural language query", "user_id": "optional" }
    Returns: Generated bundle with products and intent
    """
    try:
        # Parse request
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid request body'}), 400
        
        user_query = data.get('query', '').strip()
        user_id = data.get('user_id')
        
        # Validate input
        if not user_query:
            return jsonify({'error': 'Query field is required'}), 400
        
        if len(user_query) > 500:
            return jsonify({'error': 'Query too long (max 500 characters)'}), 400
        
        # Call business logic services
        intent = intent_service.parse_user_query(user_query)
        bundle = bundle_service.create_bundle_from_intent(intent, user_id)
        
        # Format successful response
        response_data = {
            'success': True,
            'intent': {
                'primary_activity': intent.primary_activity,
                'experience_level': intent.experience_level,
                'emotional_context': intent.emotional_context,
                'budget_level': intent.budget_level,
                'related_categories': intent.related_categories
            },
            'bundle': {
                'id': bundle.bundle_id,
                'name': bundle.bundle_name,
                'total_price': round(bundle.total_price, 2),
                'savings': round(bundle.savings, 2),
                'product_count': len(bundle.products),
                'products': [
                    {
                        'id': p.id,
                        'name': p.name,
                        'price': round(p.price, 2),
                        'category': p.category,
                        'explanation': p.explanation,
                        'image_url': p.image_url,
                        'stock_quantity': p.stock_quantity
                    }
                    for p in bundle.products
                ]
            }
        }
        
        return jsonify(response_data), 200
        
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except Exception as e:
        app.logger.error(f"Error in bundle search: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to generate bundle. Please try again.'
        }), 500


@app.route('/api/bundle/<bundle_id>', methods=['GET'])
def get_bundle_by_id(bundle_id):
    """
    GET /api/bundle/<bundle_id>
    Returns: Previously generated bundle details
    """
    try:
        bundle_data = product_service.get_saved_bundle(bundle_id)
        
        if not bundle_data:
            return jsonify({
                'success': False,
                'error': 'Bundle not found'
            }), 404
        
        return jsonify({
            'success': True,
            'bundle': bundle_data
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error fetching bundle {bundle_id}: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch bundle'
        }), 500


@app.route('/api/bundles/popular', methods=['GET'])
def get_popular_bundles():
    """
    GET /api/bundles/popular?category=sports&limit=10
    Returns: List of popular pre-generated bundles
    """
    try:
        # Parse query parameters
        category = request.args.get('category')
        limit = request.args.get('limit', default=10, type=int)
        
        # Validate limit
        if limit < 1 or limit > 50:
            return jsonify({
                'error': 'Limit must be between 1 and 50'
            }), 400
        
        # Call service
        bundles = product_service.fetch_popular_bundles(category, limit)
        
        return jsonify({
            'success': True,
            'bundles': bundles,
            'count': len(bundles)
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error fetching popular bundles: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch bundles'
        }), 500


@app.route('/api/products/search', methods=['GET'])
def search_products():
    """
    GET /api/products/search?category=shoes&category=clothing&experience_level=beginner&limit=20
    Returns: List of products matching filters
    """
    try:
        # Parse query parameters
        categories = request.args.getlist('category')
        experience_level = request.args.get('experience_level')
        budget_level = request.args.get('budget_level')
        limit = request.args.get('limit', default=20, type=int)
        
        # Validate
        if limit < 1 or limit > 100:
            return jsonify({'error': 'Limit must be between 1 and 100'}), 400
        
        # Call service
        products = product_service.search_products(
            categories=categories if categories else None,
            experience_level=experience_level,
            budget_level=budget_level,
            limit=limit
        )
        
        return jsonify({
            'success': True,
            'products': products,
            'count': len(products)
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error searching products: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to search products'
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    return jsonify({
        'status': 'healthy',
        'service': 'AI Bundle Generator',
        'supabase_configured': os.getenv('SUPABASE_URL') is not None,
        'gemini_configured': os.getenv('GEMINI_API_KEY') is not None
    }), 200


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500


# ============= Run Server =============

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )
