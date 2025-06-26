#!/usr/bin/env python3
import requests
import json
import time
import random
import concurrent.futures
import sys
import os
import subprocess
from datetime import datetime, timedelta

# Configuration
API_BASE_URL = "http://localhost:8001/api"  # Direct connection to backend port
ADMIN_CREDENTIALS = {"username": "admin", "password": "Admin123!"}

# Test session for maintaining cookies
admin_session = requests.Session()

# Store password reset code for testing
password_reset_code = None
quote_id = None

# Test results tracking
test_results = {
    "total_tests": 0,
    "passed_tests": 0,
    "failed_tests": 0,
    "response_times": [],
    "errors": []
}

def log_test(name, success, response=None, error=None, response_time=None):
    """Log test results with detailed information"""
    test_results["total_tests"] += 1
    
    if success:
        test_results["passed_tests"] += 1
        status = "✅ PASS"
    else:
        test_results["failed_tests"] += 1
        status = "❌ FAIL"
        
    if response_time:
        test_results["response_times"].append(response_time)
        
    if error:
        test_results["errors"].append({"test": name, "error": str(error)})
        
    # Format response for logging
    response_info = ""
    if response:
        try:
            status_code = response.status_code
            response_info = f"Status: {status_code}"
            if hasattr(response, 'elapsed'):
                response_info += f", Time: {response.elapsed.total_seconds():.3f}s"
            if response.text:
                try:
                    json_data = response.json()
                    if len(str(json_data)) > 100:
                        response_info += f", Response: {str(json_data)[:100]}..."
                    else:
                        response_info += f", Response: {json_data}"
                except:
                    if len(response.text) > 100:
                        response_info += f", Response: {response.text[:100]}..."
                    else:
                        response_info += f", Response: {response.text}"
        except:
            response_info = str(response)
    
    print(f"{status} - {name} - {response_info}")
    if error:
        print(f"       Error: {error}")
    
    return success

def test_health_endpoint():
    """Test the health check endpoint"""
    try:
        start_time = time.time()
        response = requests.get(f"{API_BASE_URL}/health")
        response_time = time.time() - start_time
        
        success = response.status_code == 200 and "status" in response.json()
        return log_test("Health Endpoint", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Health Endpoint", False, error=e)

def test_login(session, credentials):
    """Test login functionality"""
    try:
        start_time = time.time()
        response = session.post(
            f"{API_BASE_URL}/auth/login", 
            json=credentials
        )
        response_time = time.time() - start_time
        
        success = response.status_code == 200 and "user" in response.json()
        return log_test("Admin Login", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Admin Login", False, error=e)

def test_generate_password_reset(session):
    """Test generating a password reset code (admin only)"""
    global password_reset_code
    try:
        # Use admin email
        email = "admin@dounie-cuisine.ca"
        
        start_time = time.time()
        response = session.post(
            f"{API_BASE_URL}/admin/generate-password-reset", 
            json={"email": email}
        )
        response_time = time.time() - start_time
        
        success = response.status_code == 200 and "resetCode" in response.json()
        
        if success:
            # Store the reset code for subsequent tests
            password_reset_code = response.json()["resetCode"]
        
        return log_test("Generate Password Reset Code", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Generate Password Reset Code", False, error=e)

def test_get_password_reset_codes(session):
    """Test retrieving active password reset codes (admin only)"""
    try:
        start_time = time.time()
        response = session.get(f"{API_BASE_URL}/admin/password-reset-codes")
        response_time = time.time() - start_time
        
        success = response.status_code == 200 and isinstance(response.json(), list)
        return log_test("Get Password Reset Codes", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Get Password Reset Codes", False, error=e)

def test_verify_reset_code():
    """Test verifying a password reset code"""
    global password_reset_code
    try:
        if not password_reset_code:
            return log_test("Verify Reset Code", False, error="No reset code available for testing")
        
        start_time = time.time()
        response = requests.post(
            f"{API_BASE_URL}/auth/verify-reset-code", 
            json={"code": password_reset_code}
        )
        response_time = time.time() - start_time
        
        success = response.status_code == 200 and "valid" in response.json()
        return log_test("Verify Reset Code", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Verify Reset Code", False, error=e)

def test_reset_password():
    """Test resetting password with a valid code"""
    global password_reset_code
    try:
        if not password_reset_code:
            return log_test("Reset Password", False, error="No reset code available for testing")
        
        new_password = "NewPassword123!"
        
        start_time = time.time()
        response = requests.post(
            f"{API_BASE_URL}/auth/reset-password", 
            json={"code": password_reset_code, "newPassword": new_password}
        )
        response_time = time.time() - start_time
        
        success = response.status_code == 200 and "message" in response.json()
        return log_test("Reset Password", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Reset Password", False, error=e)

def test_create_quote(session):
    """Test creating a quote"""
    global quote_id
    try:
        quote_data = {
            "clientName": "Test Client",
            "clientEmail": "client@example.com",
            "clientPhone": "5141234567",
            "eventDate": (datetime.now() + timedelta(days=30)).isoformat(),
            "eventType": "Wedding",
            "guestCount": 50,
            "specialRequests": "Test quote for Haitian cuisine catering",
            "budget": "5000",
            "items": [
                {
                    "description": "Catering for 50 people",
                    "quantity": 1,
                    "unitPrice": "5000.00",
                    "subtotal": "5000.00"
                }
            ]
        }
        
        start_time = time.time()
        response = session.post(f"{API_BASE_URL}/quotes", json=quote_data)
        response_time = time.time() - start_time
        
        success = response.status_code in [200, 201] and "id" in response.json()
        
        if success:
            # Store the quote ID for subsequent tests
            quote_id = response.json()["id"]
        
        return log_test("Create Quote", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Create Quote", False, error=e)

def test_send_quote(session):
    """Test sending a quote (should return manual notification message)"""
    global quote_id
    try:
        if not quote_id:
            return log_test("Send Quote", False, error="No quote available for testing")
        
        start_time = time.time()
        response = session.post(f"{API_BASE_URL}/quotes/{quote_id}/send")
        response_time = time.time() - start_time
        
        success = response.status_code == 200 and "message" in response.json()
        return log_test("Send Quote", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Send Quote", False, error=e)

def test_mongodb_connection():
    """Test MongoDB connection by checking if the API can access the database"""
    try:
        # We'll use the health endpoint to indirectly test MongoDB connection
        # since it should check database connectivity
        start_time = time.time()
        response = requests.get(f"{API_BASE_URL}/health")
        response_time = time.time() - start_time
        
        success = response.status_code == 200
        return log_test("MongoDB Connection", success, response, response_time=response_time)
    except Exception as e:
        return log_test("MongoDB Connection", False, error=e)

def run_concurrent_requests(endpoint, num_requests=20):
    """Run multiple concurrent requests to test load handling"""
    print(f"\n🔄 Running {num_requests} concurrent requests to {endpoint}...")
    
    def make_request():
        try:
            start_time = time.time()
            response = requests.get(f"{API_BASE_URL}/{endpoint}")
            response_time = time.time() - start_time
            return response.status_code, response_time
        except Exception as e:
            return None, None
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=num_requests) as executor:
        results = list(executor.map(lambda _: make_request(), range(num_requests)))
    
    success_count = sum(1 for status, _ in results if status and 200 <= status < 300)
    response_times = [time for _, time in results if time]
    
    if response_times:
        avg_response_time = sum(response_times) / len(response_times)
        max_response_time = max(response_times)
        min_response_time = min(response_times)
    else:
        avg_response_time = max_response_time = min_response_time = 0
    
    print(f"✅ Successful requests: {success_count}/{num_requests} ({success_count/num_requests*100:.1f}%)")
    print(f"⏱️ Response times - Avg: {avg_response_time:.3f}s, Min: {min_response_time:.3f}s, Max: {max_response_time:.3f}s")
    
    success = success_count == num_requests
    log_test(f"Concurrent Requests ({endpoint})", success, 
             error=None if success else f"{num_requests - success_count} requests failed")
    
    return success

def test_deploy_script():
    """Test the deploy-debian.sh script for syntax errors"""
    try:
        # We'll just check if the script is executable and has no syntax errors
        result = subprocess.run(["bash", "-n", "/app/deploy-debian.sh"], 
                               capture_output=True, text=True)
        
        success = result.returncode == 0
        error_msg = result.stderr if not success else None
        
        return log_test("Deploy Script Syntax", success, error=error_msg)
    except Exception as e:
        return log_test("Deploy Script Syntax", False, error=e)

def test_nginx_config():
    """Test the nginx configuration file for syntax errors"""
    try:
        # Check if the nginx config has the necessary components
        with open("/app/nginx-dounie.conf", "r") as f:
            config = f.read()
        
        # Check for essential components
        has_server_block = "server {" in config
        has_api_location = "location /api" in config
        has_backend_proxy = "proxy_pass http://127.0.0.1:8001" in config
        
        success = has_server_block and has_api_location and has_backend_proxy
        
        return log_test("Nginx Config", success, 
                       error=None if success else "Missing essential nginx configuration")
    except Exception as e:
        return log_test("Nginx Config", False, error=e)

def test_supervisor_config():
    """Test the supervisor configuration file for syntax errors"""
    try:
        # Check if the supervisor config has the necessary components
        with open("/app/supervisor-dounie.conf", "r") as f:
            config = f.read()
        
        # Check for essential components
        has_backend_program = "[program:dounie-backend]" in config
        has_uvicorn_command = "uvicorn" in config
        has_port_8001 = "--port 8001" in config
        
        success = has_backend_program and has_uvicorn_command and has_port_8001
        
        return log_test("Supervisor Config", success, 
                       error=None if success else "Missing essential supervisor configuration")
    except Exception as e:
        return log_test("Supervisor Config", False, error=e)

def print_summary():
    """Print test summary"""
    print("\n" + "="*80)
    print(f"📊 TEST SUMMARY")
    print("="*80)
    print(f"Total Tests: {test_results['total_tests']}")
    print(f"Passed: {test_results['passed_tests']} ({test_results['passed_tests']/test_results['total_tests']*100:.1f}%)")
    print(f"Failed: {test_results['failed_tests']} ({test_results['failed_tests']/test_results['total_tests']*100:.1f}%)")
    
    if test_results["response_times"]:
        avg_time = sum(test_results["response_times"]) / len(test_results["response_times"])
        print(f"Average Response Time: {avg_time:.3f}s")
    
    if test_results["errors"]:
        print("\n❌ ERRORS:")
        for error in test_results["errors"]:
            print(f"- {error['test']}: {error['error']}")
    
    print("="*80)
    
    # Return overall success status (for exit code)
    return test_results["failed_tests"] == 0

def run_all_tests():
    """Run all tests in sequence"""
    print("\n" + "="*80)
    print("🧪 DOUNIE CUISINE API DEPLOYMENT TEST")
    print("="*80)
    
    print("\n📡 Testing Health Endpoint...")
    test_health_endpoint()
    
    print("\n🔄 Testing Load Handling (Health Endpoint)...")
    run_concurrent_requests("health", 20)
    
    print("\n🔐 Testing Authentication...")
    admin_login_success = test_login(admin_session, ADMIN_CREDENTIALS)
    
    print("\n🔑 Testing Password Recovery System...")
    if admin_login_success:
        test_generate_password_reset(admin_session)
        test_get_password_reset_codes(admin_session)
        test_verify_reset_code()
        test_reset_password()
    
    print("\n📝 Testing Quote System...")
    if admin_login_success:
        test_create_quote(admin_session)
        test_send_quote(admin_session)
    
    print("\n🗃️ Testing MongoDB Integration...")
    test_mongodb_connection()
    
    print("\n📜 Testing Deployment Scripts...")
    test_deploy_script()
    test_nginx_config()
    test_supervisor_config()
    
    # Print summary
    return print_summary()

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)