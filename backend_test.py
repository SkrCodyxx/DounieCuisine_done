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
# Use the REACT_APP_BACKEND_URL from frontend/.env
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            API_BASE_URL = line.strip().split('=')[1]
            break

print(f"Using API URL: {API_BASE_URL}")

ADMIN_CREDENTIALS = {"username": "admin", "password": "Admin123!"}
STAFF_CREDENTIALS = {"username": "staff", "password": "Staff123!"}
INVALID_CREDENTIALS = {"username": "invalid", "password": "WrongPassword"}

# Test sessions for maintaining cookies
admin_session = requests.Session()
staff_session = requests.Session()

# Store password reset code for testing
password_reset_code = None
quote_id = None
menu_item_id = None
reservation_id = None

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
        
        # Check if response time is under 2 seconds
        is_fast_enough = response_time < 2.0
        
        # Check if response contains required fields
        data = response.json()
        has_required_fields = all(field in data for field in ["status", "timestamp", "service", "version"])
        
        success = response.status_code == 200 and has_required_fields and is_fast_enough
        
        if not is_fast_enough:
            error_msg = f"Response time ({response_time:.3f}s) exceeds 2 seconds limit"
            return log_test("Health Endpoint", False, response, error=error_msg, response_time=response_time)
            
        return log_test("Health Endpoint", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Health Endpoint", False, error=e)

def test_login(session, credentials, test_name="Login"):
    """Test login functionality"""
    try:
        start_time = time.time()
        response = session.post(
            f"{API_BASE_URL}/auth/login", 
            json=credentials
        )
        response_time = time.time() - start_time
        
        success = response.status_code == 200 and "user" in response.json()
        return log_test(test_name, success, response, response_time=response_time)
    except Exception as e:
        return log_test(test_name, False, error=e)

def test_admin_login():
    """Test admin login"""
    return test_login(admin_session, ADMIN_CREDENTIALS, "Admin Login")

def test_staff_login():
    """Test staff login"""
    return test_login(staff_session, STAFF_CREDENTIALS, "Staff Login")

def test_invalid_login():
    """Test login with invalid credentials"""
    try:
        start_time = time.time()
        response = requests.post(
            f"{API_BASE_URL}/auth/login", 
            json=INVALID_CREDENTIALS
        )
        response_time = time.time() - start_time
        
        # For invalid login, we expect a 401 status code
        success = response.status_code == 401
        return log_test("Invalid Login", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Invalid Login", False, error=e)

def test_logout(session):
    """Test logout functionality"""
    try:
        start_time = time.time()
        response = session.post(f"{API_BASE_URL}/auth/logout")
        response_time = time.time() - start_time
        
        success = response.status_code == 200 and "message" in response.json()
        return log_test("Logout", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Logout", False, error=e)

def test_current_user(session):
    """Test getting current user information"""
    try:
        start_time = time.time()
        response = session.get(f"{API_BASE_URL}/auth/me")
        response_time = time.time() - start_time
        
        success = response.status_code == 200
        return log_test("Current User", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Current User", False, error=e)

def test_generate_password_reset(session, email="staff@dounie-cuisine.ca"):
    """Test generating a password reset code (admin only)"""
    global password_reset_code
    try:
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
            print(f"Generated reset code: {password_reset_code}")
        
        return log_test(f"Generate Password Reset Code for {email}", success, response, response_time=response_time)
    except Exception as e:
        return log_test(f"Generate Password Reset Code for {email}", False, error=e)

def test_get_password_reset_codes(session):
    """Test retrieving active password reset codes (admin only)"""
    try:
        start_time = time.time()
        response = session.get(f"{API_BASE_URL}/admin/password-reset-codes")
        response_time = time.time() - start_time
        
        success = response.status_code == 200 and isinstance(response.json(), list)
        
        # Check if our generated code is in the list
        if success and password_reset_code:
            codes = [item.get("code") for item in response.json()]
            if password_reset_code not in codes:
                return log_test("Get Password Reset Codes", False, response, 
                               error=f"Generated code {password_reset_code} not found in active codes list", 
                               response_time=response_time)
        
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
        
        success = response.status_code == 200 and "valid" in response.json() and response.json()["valid"] == True
        return log_test("Verify Reset Code", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Verify Reset Code", False, error=e)

def test_verify_invalid_reset_code():
    """Test verifying an invalid reset code"""
    try:
        invalid_code = "INVALID1"
        
        start_time = time.time()
        response = requests.post(
            f"{API_BASE_URL}/auth/verify-reset-code", 
            json={"code": invalid_code}
        )
        response_time = time.time() - start_time
        
        # For invalid code, we expect valid=False
        success = response.status_code == 200 and "valid" in response.json() and response.json()["valid"] == False
        return log_test("Verify Invalid Reset Code", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Verify Invalid Reset Code", False, error=e)

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

def test_reset_password_with_weak_password():
    """Test resetting password with a weak password"""
    global password_reset_code
    try:
        # Generate a new reset code first
        admin_session.post(
            f"{API_BASE_URL}/admin/generate-password-reset", 
            json={"email": "staff@dounie-cuisine.ca"}
        )
        response = admin_session.get(f"{API_BASE_URL}/admin/password-reset-codes")
        codes = response.json()
        if codes:
            new_code = codes[0]["code"]
            
            weak_password = "weak"
            
            start_time = time.time()
            response = requests.post(
                f"{API_BASE_URL}/auth/reset-password", 
                json={"code": new_code, "newPassword": weak_password}
            )
            response_time = time.time() - start_time
            
            # For weak password, we expect a 400 status code
            success = response.status_code == 400
            return log_test("Reset Password with Weak Password", success, response, response_time=response_time)
        else:
            return log_test("Reset Password with Weak Password", False, error="No reset codes available")
    except Exception as e:
        return log_test("Reset Password with Weak Password", False, error=e)

def test_login_with_new_password():
    """Test login with the new password after reset"""
    try:
        new_password = "NewPassword123!"
        credentials = {"username": "staff", "password": new_password}
        
        start_time = time.time()
        response = requests.post(
            f"{API_BASE_URL}/auth/login", 
            json=credentials
        )
        response_time = time.time() - start_time
        
        success = response.status_code == 200 and "user" in response.json()
        return log_test("Login with New Password", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Login with New Password", False, error=e)

def test_login_with_old_password():
    """Test login with the old password after reset (should fail)"""
    try:
        start_time = time.time()
        response = requests.post(
            f"{API_BASE_URL}/auth/login", 
            json=STAFF_CREDENTIALS
        )
        response_time = time.time() - start_time
        
        # For old password after reset, we expect a 401 status code
        success = response.status_code == 401
        return log_test("Login with Old Password (after reset)", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Login with Old Password (after reset)", False, error=e)

def test_get_menu():
    """Test getting menu items"""
    try:
        start_time = time.time()
        response = requests.get(f"{API_BASE_URL}/menu")
        response_time = time.time() - start_time
        
        success = response.status_code == 200 and isinstance(response.json(), list)
        
        # Check if the menu contains the expected Haitian dishes
        if success:
            menu_items = response.json()
            haitian_dishes = ["Poule nan Sos", "Riz Collé", "Poisson Gros Sel"]
            found_dishes = [item["name"] for item in menu_items if item["name"] in haitian_dishes]
            
            if len(found_dishes) < len(haitian_dishes):
                missing = set(haitian_dishes) - set(found_dishes)
                return log_test("Get Menu", False, response, 
                               error=f"Missing expected Haitian dishes: {', '.join(missing)}", 
                               response_time=response_time)
        
        return log_test("Get Menu", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Get Menu", False, error=e)

def test_create_menu_item(session):
    """Test creating a menu item"""
    global menu_item_id
    try:
        menu_data = {
            "name": "Griot",
            "description": "Porc frit à la haïtienne avec pikliz",
            "price": 22.99,
            "category": "plats"
        }
        
        start_time = time.time()
        response = session.post(f"{API_BASE_URL}/menu", json=menu_data)
        response_time = time.time() - start_time
        
        success = response.status_code in [200, 201] and "id" in response.json()
        
        if success:
            # Store the menu item ID for subsequent tests
            menu_item_id = response.json()["id"]
        
        return log_test("Create Menu Item", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Create Menu Item", False, error=e)

def test_get_quotes(session):
    """Test getting quotes"""
    try:
        start_time = time.time()
        response = session.get(f"{API_BASE_URL}/quotes")
        response_time = time.time() - start_time
        
        success = response.status_code == 200 and isinstance(response.json(), list)
        return log_test("Get Quotes", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Get Quotes", False, error=e)

def test_create_quote(session):
    """Test creating a quote"""
    global quote_id
    try:
        quote_data = {
            "clientName": "Jean Baptiste",
            "clientEmail": "jean@example.com",
            "clientPhone": "5141234567",
            "eventDate": (datetime.now() + timedelta(days=30)).isoformat(),
            "eventType": "Mariage",
            "guestCount": 50,
            "specialRequests": "Menu haïtien traditionnel",
            "budget": "5000",
            "items": [
                {
                    "description": "Buffet haïtien pour 50 personnes",
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

def test_get_reservations(session):
    """Test getting reservations"""
    try:
        start_time = time.time()
        response = session.get(f"{API_BASE_URL}/reservations")
        response_time = time.time() - start_time
        
        success = response.status_code == 200 and isinstance(response.json(), list)
        return log_test("Get Reservations", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Get Reservations", False, error=e)

def test_create_reservation(session):
    """Test creating a reservation"""
    global reservation_id
    try:
        reservation_data = {
            "clientName": "Marie Durand",
            "clientEmail": "marie@example.com",
            "clientPhone": "5149876543",
            "date": (datetime.now() + timedelta(days=7)).isoformat(),
            "time": "19:00",
            "partySize": 4,
            "specialRequests": "Table près de la fenêtre"
        }
        
        start_time = time.time()
        response = session.post(f"{API_BASE_URL}/reservations", json=reservation_data)
        response_time = time.time() - start_time
        
        success = response.status_code in [200, 201] and "id" in response.json()
        
        if success:
            # Store the reservation ID for subsequent tests
            reservation_id = response.json()["id"]
        
        return log_test("Create Reservation", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Create Reservation", False, error=e)

def test_get_dashboard_stats(session):
    """Test getting dashboard statistics"""
    try:
        start_time = time.time()
        response = session.get(f"{API_BASE_URL}/dashboard/stats")
        response_time = time.time() - start_time
        
        success = response.status_code == 200 and isinstance(response.json(), dict)
        
        # Check if the response contains the expected fields
        if success:
            stats = response.json()
            required_fields = ["totalOrders", "totalRevenue", "pendingReservations", "activeMenuItems"]
            missing_fields = [field for field in required_fields if field not in stats]
            
            if missing_fields:
                return log_test("Get Dashboard Stats", False, response, 
                               error=f"Missing required fields: {', '.join(missing_fields)}", 
                               response_time=response_time)
        
        return log_test("Get Dashboard Stats", success, response, response_time=response_time)
    except Exception as e:
        return log_test("Get Dashboard Stats", False, error=e)

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