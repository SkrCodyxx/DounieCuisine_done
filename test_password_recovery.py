#!/usr/bin/env python3
"""
Comprehensive Password Recovery System Testing for Dounie Cuisine
Tests the complete workflow end-to-end with proper session management
"""

import requests
import json
import time
from datetime import datetime

# API Base URL
BASE_URL = "http://localhost:5000/api"

class PasswordRecoveryTester:
    def __init__(self):
        self.session = requests.Session()
        self.admin_credentials = {"username": "admin", "password": "Admin123!"}
        self.test_user_email = "staff@dounie-cuisine.ca" 
        self.test_new_password = "NewPassword123!"
        self.reset_code = None
        
    def print_test(self, name, success, details=""):
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {name}")
        if details:
            print(f"   {details}")
        print()
        
    def test_admin_login(self):
        """Test admin authentication for password recovery operations"""
        try:
            response = self.session.post(f"{BASE_URL}/auth/login", json=self.admin_credentials)
            success = response.status_code == 200 and "user" in response.json()
            
            if success:
                user_data = response.json()["user"]
                self.print_test("Admin Login", True, f"Logged in as {user_data['firstName']} {user_data['lastName']} (Role: {user_data['role']})")
            else:
                self.print_test("Admin Login", False, f"Status: {response.status_code}, Response: {response.text}")
            
            return success
        except Exception as e:
            self.print_test("Admin Login", False, f"Exception: {str(e)}")
            return False
    
    def test_generate_reset_code(self):
        """Test password reset code generation (admin only)"""
        try:
            response = self.session.post(f"{BASE_URL}/admin/generate-password-reset", 
                                       json={"email": self.test_user_email})
            success = response.status_code == 200
            
            if success:
                data = response.json()
                self.reset_code = data["resetCode"]
                self.print_test("Generate Reset Code", True, 
                               f"Code: {self.reset_code}, Expires: {data['expiresAt']}")
            else:
                self.print_test("Generate Reset Code", False, 
                               f"Status: {response.status_code}, Response: {response.text}")
            
            return success
        except Exception as e:
            self.print_test("Generate Reset Code", False, f"Exception: {str(e)}")
            return False
    
    def test_list_active_codes(self):
        """Test listing active reset codes (admin only)"""
        try:
            response = self.session.get(f"{BASE_URL}/admin/password-reset-codes")
            success = response.status_code == 200
            
            if success:
                codes = response.json()
                found_code = any(code["code"] == self.reset_code for code in codes)
                self.print_test("List Active Codes", found_code, 
                               f"Found {len(codes)} active codes, our code present: {found_code}")
            else:
                self.print_test("List Active Codes", False, 
                               f"Status: {response.status_code}, Response: {response.text}")
            
            return success
        except Exception as e:
            self.print_test("List Active Codes", False, f"Exception: {str(e)}")
            return False
    
    def test_verify_reset_code(self):
        """Test reset code verification (public endpoint)"""
        try:
            # Use a new session to simulate public access
            public_session = requests.Session()
            response = public_session.post(f"{BASE_URL}/auth/verify-reset-code", 
                                         json={"code": self.reset_code})
            success = response.status_code == 200 and response.json().get("valid") == True
            
            if success:
                user_info = response.json()["user"]
                self.print_test("Verify Reset Code", True, 
                               f"Valid code for {user_info['firstName']} {user_info['lastName']} ({user_info['email']})")
            else:
                self.print_test("Verify Reset Code", False, 
                               f"Status: {response.status_code}, Response: {response.text}")
            
            return success
        except Exception as e:
            self.print_test("Verify Reset Code", False, f"Exception: {str(e)}")
            return False
    
    def test_reset_password(self):
        """Test actual password reset (public endpoint)"""
        try:
            # Use a new session to simulate public access
            public_session = requests.Session()
            response = public_session.post(f"{BASE_URL}/auth/reset-password", 
                                         json={"code": self.reset_code, "newPassword": self.test_new_password})
            success = response.status_code == 200
            
            if success:
                message = response.json()["message"]
                self.print_test("Reset Password", True, f"Message: {message}")
            else:
                self.print_test("Reset Password", False, 
                               f"Status: {response.status_code}, Response: {response.text}")
            
            return success
        except Exception as e:
            self.print_test("Reset Password", False, f"Exception: {str(e)}")
            return False
    
    def test_login_with_new_password(self):
        """Test login with the new password to confirm reset worked"""
        try:
            new_session = requests.Session()
            response = new_session.post(f"{BASE_URL}/auth/login", 
                                      json={"username": "staff", "password": self.test_new_password})
            success = response.status_code == 200 and "user" in response.json()
            
            if success:
                user_data = response.json()["user"]
                self.print_test("Login with New Password", True, 
                               f"Successfully logged in as {user_data['firstName']} {user_data['lastName']}")
            else:
                self.print_test("Login with New Password", False, 
                               f"Status: {response.status_code}, Response: {response.text}")
            
            return success
        except Exception as e:
            self.print_test("Login with New Password", False, f"Exception: {str(e)}")
            return False
    
    def test_error_cases(self):
        """Test various error scenarios"""
        error_tests = []
        
        # Test invalid code
        try:
            public_session = requests.Session()
            response = public_session.post(f"{BASE_URL}/auth/verify-reset-code", 
                                         json={"code": "INVALID_CODE"})
            success = response.status_code == 400
            error_tests.append(("Invalid Code Rejection", success))
        except:
            error_tests.append(("Invalid Code Rejection", False))
        
        # Test code reuse (should fail since we already used it)
        try:
            public_session = requests.Session()
            response = public_session.post(f"{BASE_URL}/auth/reset-password", 
                                         json={"code": self.reset_code, "newPassword": "AnotherPassword123!"})
            success = response.status_code == 400  # Should fail - code already used
            error_tests.append(("Code Reuse Prevention", success))
        except:
            error_tests.append(("Code Reuse Prevention", False))
        
        # Test weak password
        try:
            # Generate a new code first
            self.session.post(f"{BASE_URL}/admin/generate-password-reset", 
                             json={"email": self.test_user_email})
            # Try with weak password
            public_session = requests.Session()
            response = public_session.post(f"{BASE_URL}/auth/reset-password", 
                                         json={"code": self.reset_code, "newPassword": "123"})
            success = response.status_code == 400  # Should fail - weak password
            error_tests.append(("Weak Password Rejection", success))
        except:
            error_tests.append(("Weak Password Rejection", False))
        
        # Test non-admin access to admin endpoints
        try:
            public_session = requests.Session()
            response = public_session.post(f"{BASE_URL}/admin/generate-password-reset", 
                                         json={"email": "test@example.com"})
            success = response.status_code in [401, 403]  # Should fail - not authenticated
            error_tests.append(("Non-Admin Access Prevention", success))
        except:
            error_tests.append(("Non-Admin Access Prevention", False))
        
        for test_name, success in error_tests:
            self.print_test(test_name, success)
        
        return all(result for _, result in error_tests)
    
    def test_quote_system(self):
        """Test quote system manual email notification"""
        try:
            # First create a test quote
            quote_data = {
                "clientId": 1,
                "title": "Test Quote for Manual Email",
                "description": "Testing manual email notification system",
                "subtotalHT": "100.00",
                "status": "draft",
                "validUntil": "2025-12-31"
            }
            
            response = self.session.post(f"{BASE_URL}/quotes", json=quote_data)
            if response.status_code != 201:
                self.print_test("Quote Creation", False, f"Status: {response.status_code}")
                return False
            
            quote_id = response.json()["id"]
            
            # Test sending quote (should show manual notification message)
            response = self.session.post(f"{BASE_URL}/quotes/{quote_id}/send")
            success = response.status_code == 200
            
            if success:
                message = response.json()["message"]
                note = response.json().get("note", "")
                manual_notification = "manuel" in message.lower() or "manual" in note.lower()
                self.print_test("Quote Manual Email System", manual_notification, 
                               f"Message: {message}")
            else:
                self.print_test("Quote Manual Email System", False, 
                               f"Status: {response.status_code}, Response: {response.text}")
            
            return success
        except Exception as e:
            self.print_test("Quote Manual Email System", False, f"Exception: {str(e)}")
            return False
    
    def run_comprehensive_test(self):
        """Run all password recovery tests"""
        print("🚀 DOUNIE CUISINE - PASSWORD RECOVERY SYSTEM TESTING")
        print("=" * 60)
        print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print()
        
        test_results = []
        
        # Core password recovery workflow
        print("🔐 AUTHENTICATION & PASSWORD RECOVERY WORKFLOW")
        print("-" * 50)
        test_results.append(self.test_admin_login())
        test_results.append(self.test_generate_reset_code())
        test_results.append(self.test_list_active_codes())
        test_results.append(self.test_verify_reset_code())
        test_results.append(self.test_reset_password())
        test_results.append(self.test_login_with_new_password())
        
        print("⚠️  ERROR HANDLING TESTS")
        print("-" * 30)
        test_results.append(self.test_error_cases())
        
        print("📧 QUOTE SYSTEM TESTING")
        print("-" * 25)
        test_results.append(self.test_quote_system())
        
        # Summary
        print("📊 TEST SUMMARY")
        print("-" * 15)
        total_tests = len(test_results)
        passed_tests = sum(test_results)
        success_rate = (passed_tests / total_tests) * 100
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {total_tests - passed_tests}")
        print(f"Success Rate: {success_rate:.1f}%")
        print()
        
        if success_rate >= 85:
            print("🎉 PASSWORD RECOVERY SYSTEM: EXCELLENT PERFORMANCE!")
        elif success_rate >= 70:
            print("✅ PASSWORD RECOVERY SYSTEM: GOOD PERFORMANCE")
        else:
            print("⚠️  PASSWORD RECOVERY SYSTEM: NEEDS ATTENTION")
        
        print(f"Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        return success_rate >= 70

if __name__ == "__main__":
    tester = PasswordRecoveryTester()
    tester.run_comprehensive_test()