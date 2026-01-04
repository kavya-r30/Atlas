# replenishment_server.py
"""
Flask API Server for Smart Replenishment System
Handles HTTP requests for inventory predictions and reorder recommendations
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from datetime import datetime

# Import business logic services
from replenishment_services.prediction_service import ReplenishmentPredictionService
from replenishment_services.langchain_agent import ReplenishmentLangChainAgent
from replenishment_services.inventory_service import InventoryService
from database.supabase_repository import SupabaseInventoryRepository

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize repositories and services
inventory_repo = SupabaseInventoryRepository()
inventory_service = InventoryService(inventory_repo)
prediction_service = ReplenishmentPredictionService(inventory_repo)
langchain_agent = ReplenishmentLangChainAgent(inventory_repo)


# ============= Smart Replenishment API Endpoints =============

@app.route('/api/replenishment/predict', methods=['POST'])
def predict_replenishment():
    """
    POST /api/replenishment/predict
    Body: { 
        "user_id": "uuid",
        "product_ids": ["uuid1", "uuid2"], (optional - if empty, predicts for all user products)
        "days_ahead": 30 (optional - default 30 days)
    }
    Returns: Replenishment predictions with dates and quantities
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid request body'}), 400
        
        user_id = data.get('user_id')
        product_ids = data.get('product_ids', [])
        days_ahead = data.get('days_ahead', 30)
        
        # Validate inputs
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        
        if days_ahead < 1 or days_ahead > 365:
            return jsonify({'error': 'days_ahead must be between 1 and 365'}), 400
        
        # Get predictions from service
        predictions = prediction_service.predict_user_replenishment(
            user_id=user_id,
            product_ids=product_ids if product_ids else None,
            days_ahead=days_ahead
        )
        
        if not predictions:
            return jsonify({
                'success': True,
                'message': 'No replenishment needed in the specified timeframe',
                'predictions': []
            }), 200
        
        return jsonify({
            'success': True,
            'user_id': user_id,
            'days_ahead': days_ahead,
            'predictions': predictions,
            'total_items': len(predictions)
        }), 200
        
    except ValueError as e:
        return jsonify({'success': False, 'error': str(e)}), 400
    except Exception as e:
        app.logger.error(f"Error in replenishment prediction: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to generate predictions'
        }), 500


@app.route('/api/replenishment/smart-recommendations', methods=['POST'])
def get_smart_recommendations():
    """
    POST /api/replenishment/smart-recommendations
    Body: {
        "user_id": "uuid",
        "context": "I'm running low on protein powder" (optional natural language)
    }
    Returns: AI-powered recommendations using LangChain
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid request body'}), 400
        
        user_id = data.get('user_id')
        context = data.get('context', '')
        
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        
        # Get LangChain-powered recommendations
        recommendations = langchain_agent.generate_smart_recommendations(
            user_id=user_id,
            user_context=context
        )
        
        return jsonify({
            'success': True,
            'user_id': user_id,
            'recommendations': recommendations['recommendations'],
            'reasoning': recommendations['reasoning'],
            'total_recommended': len(recommendations['recommendations'])
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error generating smart recommendations: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to generate recommendations'
        }), 500


@app.route('/api/replenishment/analyze-consumption', methods=['POST'])
def analyze_consumption_pattern():
    """
    POST /api/replenishment/analyze-consumption
    Body: {
        "user_id": "uuid",
        "product_id": "uuid"
    }
    Returns: Detailed consumption analysis and insights
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid request body'}), 400
        
        user_id = data.get('user_id')
        product_id = data.get('product_id')
        
        if not user_id or not product_id:
            return jsonify({'error': 'user_id and product_id are required'}), 400
        
        # Analyze consumption pattern
        analysis = prediction_service.analyze_consumption_pattern(
            user_id=user_id,
            product_id=product_id
        )
        
        if not analysis:
            return jsonify({
                'success': False,
                'error': 'No consumption data found for this product'
            }), 404
        
        return jsonify({
            'success': True,
            'analysis': analysis
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error analyzing consumption: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to analyze consumption'
        }), 500


@app.route('/api/replenishment/subscription-recommendations', methods=['POST'])
def get_subscription_recommendations():
    """
    POST /api/replenishment/subscription-recommendations
    Body: {
        "user_id": "uuid"
    }
    Returns: Products suitable for subscription with optimal intervals
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid request body'}), 400
        
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400
        
        # Get subscription recommendations
        recommendations = prediction_service.recommend_subscriptions(user_id)
        
        return jsonify({
            'success': True,
            'user_id': user_id,
            'subscription_recommendations': recommendations
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error generating subscription recommendations: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to generate subscription recommendations'
        }), 500


@app.route('/api/replenishment/create-reminder', methods=['POST'])
def create_replenishment_reminder():
    """
    POST /api/replenishment/create-reminder
    Body: {
        "user_id": "uuid",
        "product_id": "uuid",
        "reminder_date": "2026-02-15",
        "reminder_type": "email|push|sms"
    }
    Returns: Created reminder details
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid request body'}), 400
        
        user_id = data.get('user_id')
        product_id = data.get('product_id')
        reminder_date = data.get('reminder_date')
        reminder_type = data.get('reminder_type', 'email')
        
        if not all([user_id, product_id, reminder_date]):
            return jsonify({
                'error': 'user_id, product_id, and reminder_date are required'
            }), 400
        
        # Create reminder
        reminder = inventory_service.create_reminder(
            user_id=user_id,
            product_id=product_id,
            reminder_date=reminder_date,
            reminder_type=reminder_type
        )
        
        return jsonify({
            'success': True,
            'reminder': reminder
        }), 201
        
    except Exception as e:
        app.logger.error(f"Error creating reminder: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to create reminder'
        }), 500


@app.route('/api/replenishment/user-history/<user_id>', methods=['GET'])
def get_user_purchase_history(user_id):
    """
    GET /api/replenishment/user-history/<user_id>?limit=50
    Returns: User's purchase history for analysis
    """
    try:
        limit = request.args.get('limit', default=50, type=int)
        
        if limit < 1 or limit > 200:
            return jsonify({'error': 'Limit must be between 1 and 200'}), 400
        
        # Fetch purchase history
        history = inventory_service.get_purchase_history(user_id, limit)
        
        return jsonify({
            'success': True,
            'user_id': user_id,
            'purchase_history': history,
            'total_orders': len(history)
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error fetching purchase history: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch purchase history'
        }), 500


@app.route('/api/replenishment/bulk-predict', methods=['POST'])
def bulk_predict_replenishment():
    """
    POST /api/replenishment/bulk-predict
    Body: {
        "user_ids": ["uuid1", "uuid2", ...],
        "days_ahead": 30
    }
    Returns: Predictions for multiple users (for admin/analytics)
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid request body'}), 400
        
        user_ids = data.get('user_ids', [])
        days_ahead = data.get('days_ahead', 30)
        
        if not user_ids:
            return jsonify({'error': 'user_ids array is required'}), 400
        
        if len(user_ids) > 100:
            return jsonify({'error': 'Maximum 100 users per bulk request'}), 400
        
        # Generate predictions for all users
        all_predictions = {}
        for user_id in user_ids:
            predictions = prediction_service.predict_user_replenishment(
                user_id=user_id,
                days_ahead=days_ahead
            )
            all_predictions[user_id] = predictions
        
        return jsonify({
            'success': True,
            'total_users': len(user_ids),
            'days_ahead': days_ahead,
            'predictions': all_predictions
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error in bulk prediction: {e}")
        return jsonify({
            'success': False,
            'error': 'Failed to generate bulk predictions'
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Smart Replenishment API',
        'supabase_connected': os.getenv('SUPABASE_URL') is not None,
        'openai_configured': os.getenv('OPENAI_API_KEY') is not None,
        'timestamp': datetime.utcnow().isoformat()
    }), 200


# ============= Error Handlers =============

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500


# ============= Run Server =============

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )
