import openai
import os
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from models import Material, Order, OrderQueue, Product
from datetime import datetime, timedelta
import json

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

class AIInventoryAssistant:
    def __init__(self, db: Session):
        self.db = db
        self.client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    def analyze_inventory_health(self) -> Dict[str, Any]:
        """Analyze current inventory and generate smart alerts"""
        materials = self.db.query(Material).all()
        orders = self.db.query(Order).all()
        order_queue = self.db.query(OrderQueue).all()
        
        # Calculate inventory health metrics
        low_stock_items = []
        critical_stock_items = []
        reorder_recommendations = []
        
        for material in materials:
            # Calculate days of stock remaining based on recent order patterns
            days_remaining = self._calculate_days_remaining(material, orders, order_queue)
            
            if days_remaining <= 7:  # Critical: less than 1 week
                critical_stock_items.append({
                    "material": material,
                    "days_remaining": days_remaining,
                    "urgency": "CRITICAL",
                    "recommended_action": f"Order immediately - will run out in {days_remaining} days"
                })
            elif days_remaining <= 14:  # Low: less than 2 weeks
                low_stock_items.append({
                    "material": material,
                    "days_remaining": days_remaining,
                    "urgency": "LOW",
                    "recommended_action": f"Order soon - will run out in {days_remaining} days"
                })
            
            # Generate reorder recommendations
            if days_remaining <= 21:  # Reorder point: 3 weeks
                recommended_quantity = self._calculate_reorder_quantity(material, orders)
                reorder_recommendations.append({
                    "material": material,
                    "current_stock": material.quantity,
                    "recommended_quantity": recommended_quantity,
                    "days_remaining": days_remaining,
                    "reasoning": f"Based on consumption rate, order {recommended_quantity} units to maintain 30-day buffer"
                })
        
        return {
            "critical_alerts": critical_stock_items,
            "low_stock_alerts": low_stock_items,
            "reorder_recommendations": reorder_recommendations,
            "total_materials": len(materials),
            "analysis_timestamp": datetime.now().isoformat()
        }
    
    def _calculate_days_remaining(self, material: Material, orders: List[Order], order_queue: List[OrderQueue]) -> int:
        """Calculate how many days of stock remain based on consumption patterns"""
        # Get recent consumption (last 30 days)
        thirty_days_ago = datetime.now() - timedelta(days=30)
        
        # Calculate average daily consumption from recent orders
        total_consumption = 0
        for order in orders:
            if order.order_date >= thirty_days_ago:
                # Estimate consumption based on order items
                # This is simplified - in real app, you'd track actual material usage
                total_consumption += len(order.items) * 2  # Assume 2 units per order item
        
        # Add pending orders from order queue
        for pending_order in order_queue:
            if pending_order.order_date >= thirty_days_ago:
                total_consumption += 2  # Assume 2 units per pending order
        
        # Calculate daily average
        daily_consumption = total_consumption / 30 if total_consumption > 0 else 1
        
        # Calculate days remaining
        if daily_consumption > 0:
            days_remaining = material.quantity / daily_consumption
            return int(days_remaining)
        else:
            return 999  # No consumption, plenty of stock
    
    def _calculate_reorder_quantity(self, material: Material, orders: List[Order]) -> int:
        """Calculate recommended reorder quantity"""
        # Simple reorder logic: maintain 30-day buffer
        thirty_days_ago = datetime.now() - timedelta(days=30)
        
        total_consumption = 0
        for order in orders:
            if order.order_date >= thirty_days_ago:
                total_consumption += len(order.items) * 2
        
        daily_consumption = total_consumption / 30 if total_consumption > 0 else 1
        recommended_quantity = int(daily_consumption * 30)  # 30-day supply
        
        return max(recommended_quantity, material.required)  # At least meet minimum requirement
    
    def generate_procurement_insights(self, query: str) -> str:
        """Generate AI-powered insights based on user query"""
        try:
            # Get current inventory data
            materials = self.db.query(Material).all()
            orders = self.db.query(Order).all()
            products = self.db.query(Product).all()
            
            # Create context for AI
            inventory_context = {
                "materials": [
                    {
                        "name": m.name,
                        "quantity": m.quantity,
                        "unit": m.unit,
                        "required": m.required,
                        "color": m.color
                    } for m in materials
                ],
                "recent_orders": len([o for o in orders if o.order_date >= datetime.now() - timedelta(days=30)]),
                "total_products": len(products),
                "analysis_date": datetime.now().isoformat()
            }
            
            # Create AI prompt
            system_prompt = """You are an AI procurement assistant for a T-shirt manufacturing business. 
            You help with inventory management, demand forecasting, and procurement decisions.
            
            Current inventory data:
            """ + json.dumps(inventory_context, indent=2) + """
            
            Provide helpful, actionable insights based on the user's question. Focus on:
            - Inventory optimization
            - Demand forecasting
            - Cost reduction opportunities
            - Risk mitigation
            - Business continuity planning
            
            Be specific and data-driven in your recommendations."""
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": query}
                ],
                max_tokens=200,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            return f"I apologize, but I'm having trouble accessing the AI service right now. Error: {str(e)}"
    
    def get_smart_alerts(self) -> List[Dict[str, Any]]:
        """Get prioritized smart alerts for the dashboard"""
        analysis = self.analyze_inventory_health()
        alerts = []
        
        # Critical alerts (highest priority)
        for item in analysis["critical_alerts"]:
            alerts.append({
                "id": f"critical_{item['material'].id}",
                "type": "CRITICAL",
                "title": f"Critical Stock Alert: {item['material'].name}",
                "message": f"Only {item['days_remaining']} days of stock remaining! {item['recommended_action']}",
                "material_id": item['material'].id,
                "material_name": item['material'].name,
                "current_quantity": item['material'].quantity,
                "days_remaining": item['days_remaining'],
                "priority": 1,
                "timestamp": datetime.now().isoformat()
            })
        
        # Low stock alerts
        for item in analysis["low_stock_alerts"]:
            alerts.append({
                "id": f"low_{item['material'].id}",
                "type": "LOW_STOCK",
                "title": f"Low Stock Alert: {item['material'].name}",
                "message": f"Stock running low - {item['days_remaining']} days remaining. {item['recommended_action']}",
                "material_id": item['material'].id,
                "material_name": item['material'].name,
                "current_quantity": item['material'].quantity,
                "days_remaining": item['days_remaining'],
                "priority": 2,
                "timestamp": datetime.now().isoformat()
            })
        
        # Reorder recommendations
        for rec in analysis["reorder_recommendations"]:
            alerts.append({
                "id": f"reorder_{rec['material'].id}",
                "type": "REORDER",
                "title": f"Reorder Recommendation: {rec['material'].name}",
                "message": f"Consider ordering {rec['recommended_quantity']} units. {rec['reasoning']}",
                "material_id": rec['material'].id,
                "material_name": rec['material'].name,
                "current_quantity": rec['current_stock'],
                "recommended_quantity": rec['recommended_quantity'],
                "priority": 3,
                "timestamp": datetime.now().isoformat()
            })
        
        # Sort by priority
        alerts.sort(key=lambda x: x['priority'])
        return alerts
