#!/usr/bin/env python3
"""
Startup script for Tally Inventory Management Backend
"""
import subprocess
import sys
import os

def check_requirements():
    """Check if required packages are installed"""
    try:
        import fastapi
        import uvicorn
        import sqlalchemy
        import pydantic
        print("✅ All required packages are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing required package: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def seed_database():
    """Seed the database with sample data"""
    print("🌱 Seeding database with sample data...")
    try:
        from seed_data import seed_database
        seed_database()
        return True
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        return False

def start_server():
    """Start the FastAPI server"""
    print("🚀 Starting Tally Inventory Management API...")
    print("📍 API will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔄 Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        import uvicorn
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

def main():
    print("🎯 Tally Inventory Management Backend")
    print("=" * 50)
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Seed database
    if not seed_database():
        print("⚠️  Continuing without seeding...")
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()
